const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const requestBuckets = new Map<string, { count: number; windowStart: number }>();

const PLATFORMS: Record<string, RegExp> = {
  tiktok: /tiktok\.com|vm\.tiktok\.com/,
  youtube: /youtube\.com|youtu\.be/,
  reddit: /reddit\.com/,
  pinterest: /pinterest\.com/,
  bilibili: /bilibili\.com|b23\.tv/,
  vimeo: /vimeo\.com/,
  dailymotion: /dailymotion\.com/,
  tumblr: /tumblr\.com/,
  twitch: /twitch\.tv/,
  vk: /vk\.com/,
  ok: /ok\.ru/,
  rutube: /rutube\.ru/,
  '9gag': /9gag\.com/,
  ted: /ted\.com/,
  imgur: /imgur\.com/,
  streamable: /streamable\.com/,
  bitchute: /bitchute\.com/,
  coub: /coub\.com/,
  likee: /likee\.video/,
  sharechat: /sharechat\.com/,
  espn: /espn\.com/,
  lemon8: /lemon8-app\.com/,
  ifunny: /ifunny\.co/,
  weibo: /weibo\.com/,
  bandcamp: /bandcamp\.com/,
  kwai: /kwai\.com|kw\.ai/,
  moj: /mojapp\.in|moj\.com/,
  threads: /threads\.net/,
  linkedin: /linkedin\.com/,
  naver: /naver\.com|tv\.naver\.com/,
  niconico: /nicovideo\.jp|nico\.ms/,
  clapper: /clapper\.com/,
  rumble: /rumble\.com/,
  bigo: /bigo\.tv|bigolive\.com/,
  hipi: /hipi\.co\.in/,
  chingari: /chingari\.io/,
  afreecatv: /afreecatv\.com|sooplive\.com/,
  chzzk: /chzzk\.naver\.com/,
  vidio: /vidio\.com/,
  izlesene: /izlesene\.com/,
  puhutv: /puhutv\.com/,
};

function detectPlatform(url: string): string {
  for (const [name, regex] of Object.entries(PLATFORMS)) {
    if (regex.test(url)) return name;
  }
  return 'unknown';
}

function inferExtension(mediaUrl: string | null | undefined, fallback = 'mp4'): string {
  if (!mediaUrl || typeof mediaUrl !== 'string') return fallback;
  const match = mediaUrl.match(/\.([a-zA-Z0-9]{2,5})(?:\?|#|$)/);
  return (match?.[1] || fallback).toLowerCase();
}

interface MediaFormat {
  quality: string;
  url: string;
  ext: string;
  size?: string | null;
  type?: string;
}

// deno-lint-ignore no-explicit-any
function normalizeRapidApiResult(payload: any) {
  const data = payload?.data || payload?.result || payload;
  const mediaCandidates: Array<Record<string, unknown>> = [];

  if (Array.isArray(data?.medias)) mediaCandidates.push(...data.medias);
  if (Array.isArray(data?.links)) mediaCandidates.push(...data.links);
  if (Array.isArray(data?.urls)) mediaCandidates.push(...data.urls);

  const directUrls = [
    data?.url, data?.videoUrl, data?.downloadUrl, data?.download_url,
    data?.video?.url, data?.audio?.url,
  ].filter(Boolean);

  mediaCandidates.push(...directUrls.map((u: string) => ({ url: u, quality: 'HD' })));

  const uniqueByUrl = new Map<string, MediaFormat>();
  for (const media of mediaCandidates) {
    const mediaUrl = (media?.url || media?.link || media?.src) as string | undefined;
    if (!mediaUrl || uniqueByUrl.has(mediaUrl)) continue;

    const ext = ((media?.extension || media?.ext || inferExtension(mediaUrl, 'mp4')) as string).toLowerCase();
    const isAudio = ['mp3', 'm4a', 'aac', 'wav', 'ogg'].includes(ext);

    uniqueByUrl.set(mediaUrl, {
      quality: (media?.quality || media?.label || (isAudio ? 'audio' : 'HD')) as string,
      url: mediaUrl,
      ext,
      size: (media?.size as string) || null,
      type: (media?.type as string) || (isAudio ? 'audio' : 'video'),
    });
  }

  return {
    title: data?.title || data?.caption || 'Downloaded Media',
    thumbnail: data?.thumbnail || data?.thumb || data?.cover || null,
    duration: data?.duration || null,
    platform: data?.source || data?.platform || 'unknown',
    type: data?.type || 'video',
    formats: Array.from(uniqueByUrl.values()),
  };
}

async function fetchJson(url: string, options: RequestInit & { timeout?: number } = {}) {
  const controller = new AbortController();
  const timeout = options.timeout || 8000;
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    const data = await res.json();
    return { data, status: res.status, ok: res.ok };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url: string, options: RequestInit & { timeout?: number; maxRedirects?: number } = {}) {
  const controller = new AbortController();
  const timeout = options.timeout || 8000;
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      redirect: options.maxRedirects === 0 ? 'manual' : 'follow',
    });
    const text = await res.text();
    return { data: text, status: res.status, ok: res.ok, headers: res.headers, url: res.url };
  } finally {
    clearTimeout(timer);
  }
}

// Layer 1: All Media Downloader (PRIMARY - cheap)
async function tryAllMediaDownloader(url: string) {
  const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
  if (!rapidApiKey) throw new Error('RAPIDAPI_KEY is not configured');

  const HOST = 'all-media-downloader1.p.rapidapi.com';
  const BASE = `https://${HOST}`;

  // Detect which endpoint to use based on URL
  const endpointMap: Record<string, string> = {
    tiktok: `${BASE}/TikTok`,
    twitter: `${BASE}/Twitter`,
    youtube: `${BASE}/YouTube`,
    pinterest: `${BASE}/Pinterest`,
    bilibili: `${BASE}/BiliBili`,
    douyin: `${BASE}/douyin`,
  };

  // Find matching endpoint
  let endpoint: string | null = null;
  for (const [platform, regex] of Object.entries(PLATFORMS)) {
    if (regex.test(url) && endpointMap[platform]) {
      endpoint = endpointMap[platform];
      break;
    }
  }

  // If no specific endpoint, skip this layer
  if (!endpoint) throw new Error('All Media Downloader: no endpoint for this platform');

  const res = await fetchJson(`${endpoint}?url=${encodeURIComponent(url)}`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': HOST,
    },
    timeout: 10000,
  });

  if (!res.ok || res.data?.error) throw new Error(res.data?.error || `API returned ${res.status}`);
  if (res.data?.message === 'You are not subscribed to this API.') throw new Error('Not subscribed to All Media Downloader');

  const normalized = normalizeRapidApiResult(res.data);
  if (!normalized.formats.length) throw new Error('All Media Downloader returned no downloadable media');

  return { ...normalized, source: 'all-media-downloader' };
}

// Layer 2: Social Download All In One (SECONDARY - paid)
async function trySocialDownloadAllInOne(url: string) {
  const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
  if (!rapidApiKey) throw new Error('RAPIDAPI_KEY is not configured');

  const HOST = 'social-download-all-in-one.p.rapidapi.com';
  const res = await fetchJson(`https://${HOST}/v1/social/autolink`, {
    method: 'POST',
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': HOST,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
    timeout: 10000,
  });

  if (!res.ok) throw new Error(`Social Download AIO returned ${res.status}`);
  if (res.data?.error === true) throw new Error(res.data?.message || 'Social Download AIO: not found');
  if (res.data?.error) throw new Error(String(res.data.error));
  if (res.data?.message === 'You are not subscribed to this API.') throw new Error('Not subscribed to Social Download All In One');

  console.log(`[social-download-aio] Raw response keys: ${JSON.stringify(Object.keys(res.data || {}))}`);
  console.log(`[social-download-aio] Raw response preview: ${JSON.stringify(res.data).substring(0, 500)}`);

  const normalized = normalizeRapidApiResult(res.data);
  if (!normalized.formats.length) throw new Error('Social Download All In One returned no downloadable media');

  return { ...normalized, source: 'social-download-aio' };
}

// Layer 3: Auto Download All In One (TERTIARY - paid plan)
async function tryAutoDownloadAPI(url: string) {
  const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
  if (!rapidApiKey) throw new Error('RAPIDAPI_KEY is not configured');

  const HOST = 'auto-download-all-in-one1.p.rapidapi.com';
  const res = await fetchJson(`https://${HOST}/v1/social/autolink`, {
    method: 'POST',
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': HOST,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
    timeout: 10000,
  });

  if (!res.ok || res.data?.error) throw new Error(res.data?.error || `API returned ${res.status}`);
  if (res.data?.message === 'You are not subscribed to this API.') throw new Error('Not subscribed to Auto Download All In One');

  const normalized = normalizeRapidApiResult(res.data);
  if (!normalized.formats.length) throw new Error('Auto Download All In One returned no downloadable media');

  return { ...normalized, source: 'auto-download-aio' };
}

// Layer 4: yt-dlp bridge (SELF-HOSTED FAILSAFE)
async function tryYtDlpBridge(url: string) {
  const apiUrl = Deno.env.get('YTDLP_API_URL');
  if (!apiUrl) throw new Error('YTDLP_API_URL is not configured');

  const res = await fetchJson(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
    timeout: 12000,
  });

  if (!res.ok) throw new Error(`yt-dlp bridge returned ${res.status}`);
  const normalized = normalizeRapidApiResult(res.data);
  if (!normalized.formats.length) throw new Error('yt-dlp bridge returned no downloadable media');

  return { ...normalized, source: 'yt-dlp-bridge' };
}

// Layer 5: VidBee bridge (SELF-HOSTED FAILSAFE)
async function tryVidBeeBridge(url: string) {
  const apiUrl = Deno.env.get('VIDBEE_API_URL');
  if (!apiUrl) throw new Error('VIDBEE_API_URL is not configured');

  const res = await fetchJson(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
    timeout: 12000,
  });

  if (!res.ok) throw new Error(`VidBee bridge returned ${res.status}`);
  const normalized = normalizeRapidApiResult(res.data);
  if (!normalized.formats.length) throw new Error('VidBee bridge returned no downloadable media');

  return { ...normalized, source: 'vidbee-bridge' };
}

// Layer 6: Cobalt API (FREE open-source, cycles through public instances)
const COBALT_INSTANCES = [
  'https://cobalt-api.meowing.de',
  'https://cobalt-backend.canine.tools',
  'https://kityune.imput.net',
  'https://blossom.imput.net',
];

async function tryCobaltAPI(url: string) {
  let lastError = 'all cobalt instances failed';

  for (const instance of COBALT_INSTANCES) {
    try {
      console.log(`[cobalt] Trying instance: ${instance}`);
      const res = await fetchJson(instance, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'SocialMediaVideoDownload/1.0 (+https://socialmediavideodownload.com)',
        },
        body: JSON.stringify({
          url,
          videoQuality: '1080',
          filenameStyle: 'basic',
        }),
        timeout: 10000,
      });

      if (res.data?.status === 'error' || res.data?.error) {
        throw new Error(res.data?.error?.code || res.data?.text || 'Cobalt returned error');
      }

      // Cobalt returns different statuses: "tunnel", "redirect", "picker"
      const formats: MediaFormat[] = [];

      if (res.data?.status === 'redirect' && res.data?.url) {
        formats.push({
          quality: 'HD',
          url: res.data.url,
          ext: inferExtension(res.data.url, 'mp4'),
          type: 'video',
          size: null,
        });
      } else if (res.data?.status === 'tunnel' && res.data?.url) {
        formats.push({
          quality: 'HD',
          url: res.data.url,
          ext: inferExtension(res.data.url, 'mp4'),
          type: 'video',
          size: null,
        });
      } else if (res.data?.status === 'picker' && Array.isArray(res.data?.picker)) {
        for (const item of res.data.picker) {
          if (item?.url) {
            formats.push({
              quality: item?.quality || 'HD',
              url: item.url,
              ext: inferExtension(item.url, 'mp4'),
              type: item?.type || 'video',
              size: null,
            });
          }
        }
      }

      if (!formats.length) throw new Error('Cobalt returned no downloadable media');

      return {
        title: res.data?.filename || 'Downloaded Media',
        thumbnail: null,
        duration: null,
        platform: 'unknown',
        type: formats[0]?.type || 'video',
        formats,
        source: `cobalt-${new URL(instance).hostname}`,
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : 'unknown';
      console.log(`[cobalt] Instance ${instance} failed: ${lastError}`);
    }
  }

  throw new Error(`Cobalt API: ${lastError}`);
}

// FREE failsafe via TikWM (no auth, watermark-free).
// Despite the name, TikWM's /api/ endpoint accepts URLs from many platforms
// (TikTok, Douyin, Instagram, Facebook, YouTube Shorts, Twitter/X, etc.) and returns
// a normalized payload. Used as a universal free fallback.
async function tryTikwm(url: string) {
  const res = await fetchJson('https://www.tikwm.com/api/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    body: `url=${encodeURIComponent(url)}&hd=1`,
    timeout: 10000,
  });
  const d = res.data?.data;
  if (!d || res.data?.code !== 0) {
    throw new Error(res.data?.msg || `tikwm code ${res.data?.code}`);
  }
  const abs = (u: string) => u.startsWith('http') ? u : `https://www.tikwm.com${u.startsWith('/') ? u : '/' + u}`;
  const formats: MediaFormat[] = [];

  if (d.hdplay) formats.push({ quality: 'HD (no watermark)', url: abs(d.hdplay), ext: 'mp4', type: 'video', size: null });
  if (d.play) formats.push({ quality: 'SD (no watermark)', url: abs(d.play), ext: 'mp4', type: 'video', size: null });
  if (d.wmplay) formats.push({ quality: 'With watermark', url: abs(d.wmplay), ext: 'mp4', type: 'video', size: null });
  if (d.music) formats.push({ quality: 'Audio (MP3)', url: abs(d.music), ext: 'mp3', type: 'audio', size: null });

  // Image carousels (Instagram / TikTok slideshows)
  if (Array.isArray(d.images)) {
    d.images.forEach((img: string, i: number) => {
      if (img) formats.push({
        quality: `Image ${i + 1}`,
        url: abs(img),
        ext: inferExtension(img, 'jpg'),
        type: 'image',
        size: null,
      });
    });
  }

  if (!formats.length) throw new Error('tikwm: no media in response');

  const isAudioOnly = formats.every(f => f.type === 'audio');
  const isImageOnly = formats.every(f => f.type === 'image');

  return {
    title: d.title || 'Downloaded Media',
    thumbnail: d.cover || d.origin_cover || d.ai_dynamic_cover || null,
    duration: d.duration ? `${d.duration}s` : null,
    platform: 'unknown',
    type: isImageOnly ? 'image' : isAudioOnly ? 'audio' : 'video',
    formats,
    source: 'tikwm',
  };
}

// deno-lint-ignore no-explicit-any
function getRedditVideoUrl(post: any): string | null {
  const candidates = [
    post?.secure_media?.reddit_video?.fallback_url,
    post?.media?.reddit_video?.fallback_url,
    post?.crosspost_parent_list?.[0]?.secure_media?.reddit_video?.fallback_url,
    post?.crosspost_parent_list?.[0]?.media?.reddit_video?.fallback_url,
    post?.preview?.reddit_video_preview?.fallback_url,
  ];
  return candidates.find((item: unknown) => typeof item === 'string' && (item as string).length > 0) as string || null;
}

function getXStatusId(url: string): string | null {
  return url.match(/(?:twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/)?.[1] || null;
}

// deno-lint-ignore no-explicit-any
function normalizeXFormats(payload: any): MediaFormat[] {
  const mediaGroups = [
    payload?.media_extended, payload?.media, payload?.tweet?.media,
    payload?.tweet?.media?.all, payload?.videos,
  ].filter(Array.isArray);

  const uniqueByUrl = new Map<string, MediaFormat>();

  const addFormat = (mediaUrl: string | undefined, quality = 'HD') => {
    if (!mediaUrl || uniqueByUrl.has(mediaUrl)) return;
    const ext = inferExtension(mediaUrl, 'mp4');
    if (ext === 'm3u8') return;
    uniqueByUrl.set(mediaUrl, { quality, url: mediaUrl, ext, type: 'video', size: null });
  };

  for (const group of mediaGroups) {
    // deno-lint-ignore no-explicit-any
    for (const item of group as any[]) {
      addFormat(item?.url || item?.download_url || item?.media_url_https || item?.src, item?.quality || item?.label || 'HD');
      const variants = item?.video_info?.variants || item?.video?.variants || item?.variants || [];
      // deno-lint-ignore no-explicit-any
      for (const variant of variants as any[]) {
        const bitrate = Number(variant?.bitrate || 0);
        const quality = bitrate > 0 ? `${Math.round(bitrate / 1000)}k` : (variant?.quality || 'HD');
        addFormat(variant?.url, quality);
      }
    }
  }

  return Array.from(uniqueByUrl.values());
}

async function tryXFallback(url: string) {
  const statusId = getXStatusId(url);
  if (!statusId) throw new Error('X: could not parse tweet status ID');

  const usernameMatch = url.match(/(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)\/status/);
  const username = usernameMatch?.[1] || 'i';
  const twitterUrl = `https://twitter.com/${username}/status/${statusId}`;

  let lastError = 'unknown error';

  // 1. Try ssstwitter API
  try {
    const res = await fetchJson('https://ssstwitter.com/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://ssstwitter.com',
        'Referer': 'https://ssstwitter.com/',
      },
      body: `id=${encodeURIComponent(twitterUrl)}&locale=en`,
      timeout: 8000,
    });
    if (res.data?.url || res.data?.urls) {
      const urls = res.data.urls || [{ url: res.data.url, quality: 'HD' }];
      const formats: MediaFormat[] = urls
        .filter((u: { url?: string }) => u?.url)
        .map((u: { url: string; quality?: string }, i: number) => ({
          quality: u.quality || (i === 0 ? 'HD' : `Quality ${i + 1}`),
          url: u.url,
          ext: 'mp4',
          type: 'video',
          size: null,
        }));
      if (formats.length) {
        return { title: 'X Video', thumbnail: null, formats, source: 'native-x-ssstwitter', type: 'video' };
      }
    }
    throw new Error('ssstwitter returned no media');
  } catch (err: unknown) {
    lastError = err instanceof Error ? err.message : 'unknown';
    console.log(`[x-fallback] ssstwitter failed: ${lastError}`);
  }

  // 2. Try twitsave.com
  try {
    const res = await fetchText(`https://twitsave.com/info?url=${encodeURIComponent(twitterUrl)}`, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const html = res.data || '';
    const videoMatches = [...html.matchAll(/href="(https?:\/\/[^"]*video\.twimg\.com[^"]*)"/g)];
    if (videoMatches.length) {
      const seen = new Set<string>();
      const formats: MediaFormat[] = [];
      for (const m of videoMatches) {
        const u = m[1].replace(/&amp;/g, '&');
        if (seen.has(u)) continue;
        seen.add(u);
        const resMatch = u.match(/\/(\d{3,4})x(\d{3,4})\//);
        const quality = resMatch ? `${resMatch[2]}p` : (formats.length === 0 ? 'HD' : `Quality ${formats.length + 1}`);
        formats.push({ quality, url: u, ext: 'mp4', type: 'video', size: null });
      }
      if (formats.length) {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        return { title: titleMatch?.[1]?.replace(/ - TwitSave$/i, '') || 'X Video', thumbnail: null, formats, source: 'native-x-twitsave', type: 'video' };
      }
    }
    throw new Error('twitsave returned no video links');
  } catch (err: unknown) {
    lastError = err instanceof Error ? err.message : 'unknown';
    console.log(`[x-fallback] twitsave failed: ${lastError}`);
  }

  // 3. Try vxtwitter/fxtwitter
  const jsonEndpoints = [
    `https://api.vxtwitter.com/${username}/status/${statusId}`,
    `https://api.fxtwitter.com/${username}/status/${statusId}`,
  ];
  for (const endpoint of jsonEndpoints) {
    try {
      const res = await fetchJson(endpoint, {
        timeout: 8000,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
      });
      if (!res.ok || !res.data || res.data?.code === 404) throw new Error('404');
      const formats = normalizeXFormats(res.data || {});
      if (!formats.length) throw new Error('no media');
      return {
        title: res.data?.text || res.data?.tweet?.text || 'X Video',
        thumbnail: res.data?.media_extended?.[0]?.thumbnail_url || res.data?.media?.[0]?.thumbnail_url || null,
        formats, source: 'native-x', type: 'video',
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : 'unknown';
      console.log(`[x-fallback] ${endpoint} failed: ${lastError}`);
    }
  }

  // 4. Try savetwitter.net
  try {
    const res = await fetchJson('https://savetwitter.net/api/ajaxSearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: `q=${encodeURIComponent(twitterUrl)}&lang=en`,
      timeout: 8000,
    });
    if (res.data?.status === 'ok' && res.data?.data) {
      const html = res.data.data as string;
      const videoMatches = [...html.matchAll(/href="(https?:\/\/[^"]*\.mp4[^"]*)"/g)];
      if (videoMatches.length) {
        const formats: MediaFormat[] = videoMatches.map((m, i) => ({
          quality: i === 0 ? 'HD' : `Quality ${i + 1}`,
          url: m[1], ext: 'mp4', type: 'video', size: null,
        }));
        return { title: 'X Video', thumbnail: null, formats, source: 'native-x-savetwitter', type: 'video' };
      }
    }
  } catch (err: unknown) {
    console.log(`[x-fallback] savetwitter failed: ${err instanceof Error ? err.message : 'unknown'}`);
  }

  throw new Error(`X/Twitter: Could not extract video. The post may not contain video, or may be private/deleted.`);
}

async function scrapeOpenGraph(url: string) {
  const res = await fetchText(url, {
    timeout: 8000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    },
  });
  const html = res.data || '';
  const og = (prop: string) => {
    const m = html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))
      || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, 'i'));
    return m?.[1] || null;
  };
  const title = og('title') || html.match(/<title>([^<]+)<\/title>/i)?.[1] || 'Video';
  const thumbnail = og('image') || null;
  const videoUrl = og('video:secure_url') || og('video:url') || og('video') || null;
  return { title, thumbnail, videoUrl, html };
}

async function tryOEmbed(url: string, oembedEndpoint: string) {
  try {
    const res = await fetchJson(`${oembedEndpoint}?url=${encodeURIComponent(url)}&format=json`, {
      timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const html = res.data?.html || '';
    const srcMatch = html.match(/src=["']([^"']+)["']/);
    return {
      title: res.data?.title || 'Video',
      thumbnail: res.data?.thumbnail_url || null,
      embedUrl: srcMatch?.[1] || null,
    };
  } catch {
    return null;
  }
}

// Layer 3: Native platform fallbacks
async function tryNativeFallback(url: string, platform: string) {
  // ---------- Reddit ----------
  if (platform === 'reddit') {
    let cleanUrl = url.split('?')[0].replace(/\/+$/, '');
    if (/redd\.it/.test(cleanUrl)) {
      const resolved = await fetchText(cleanUrl, { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } });
      cleanUrl = (resolved.url || cleanUrl).split('?')[0].replace(/\/+$/, '');
    }
    // Reddit blocks generic browser UAs server-side. Use bot-friendly UAs
    // and try multiple hosts (old.reddit.com first, then www, then api).
    const pathOnly = cleanUrl.replace(/^https?:\/\/(?:www\.|old\.|new\.|i\.|m\.)?reddit\.com/, '');
    const candidates = [
      `https://old.reddit.com${pathOnly}.json?raw_json=1`,
      `https://www.reddit.com${pathOnly}.json?raw_json=1`,
      `https://api.reddit.com${pathOnly}.json?raw_json=1`,
    ];
    const uaPool = [
      'curl/8.4.0',
      'SMVDDownloader/1.0 (by /u/smvd_bot)',
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    ];
    let post: any = null;
    let lastErr = '';
    outer: for (const jsonUrl of candidates) {
      for (const ua of uaPool) {
        try {
          const res = await fetchJson(jsonUrl, {
            timeout: 8000,
            headers: {
              'User-Agent': ua,
              'Accept': 'application/json',
              'Accept-Language': 'en-US,en;q=0.9',
            },
          });
          const listing = Array.isArray(res.data) ? res.data : [res.data];
          const candidate = listing[0]?.data?.children?.[0]?.data;
          if (candidate) { post = candidate; break outer; }
          lastErr = 'empty listing';
        } catch (e) {
          lastErr = e instanceof Error ? e.message : String(e);
          // Try next UA / host
        }
      }
    }
    if (!post) throw new Error(`Reddit: could not parse post data (${lastErr})`);
    const videoUrl = getRedditVideoUrl(post);
    const gifUrl = post?.preview?.images?.[0]?.variants?.mp4?.source?.url?.replace(/&amp;/g, '&');
    // Image post fallback
    const imageUrl = (!videoUrl && !gifUrl)
      ? (post?.url_overridden_by_dest && /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(post.url_overridden_by_dest) ? post.url_overridden_by_dest : null)
      : null;
    const mediaUrl = videoUrl || gifUrl || imageUrl;
    if (!mediaUrl) throw new Error('Reddit: no video found in post');
    const isImage = !!imageUrl && !videoUrl && !gifUrl;
    const formats: MediaFormat[] = [{
      quality: isImage ? 'Original' : 'HD',
      url: mediaUrl,
      ext: inferExtension(mediaUrl, isImage ? 'jpg' : 'mp4'),
    }];
    if (videoUrl) {
      const audioUrl = videoUrl.replace(/DASH_\d+\.mp4/, 'DASH_audio.mp4').replace(/DASH_\d+/, 'DASH_audio');
      formats.push({ quality: 'audio', url: audioUrl, ext: 'mp4', type: 'audio' });
    }
    return {
      title: post?.title || 'Reddit Video',
      thumbnail: (post?.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') ? post.thumbnail : null,
      formats,
      source: 'native-reddit',
      type: isImage ? 'image' : 'video',
    };
  }

  if (platform === 'twitter') return tryXFallback(url);

  if (platform === 'bilibili') {
    const bvid = url.match(/BV[\w]+/)?.[0];
    if (!bvid) throw new Error('Bilibili: no BVID');
    const info = await fetchJson(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, { timeout: 8000 });
    const cid = info.data?.data?.cid;
    const title = info.data?.data?.title;
    const thumb = info.data?.data?.pic;
    const stream = await fetchJson(`https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=80`, { timeout: 8000 });
    const videoUrl = stream.data?.data?.durl?.[0]?.url;
    if (!videoUrl) throw new Error('Bilibili: no stream');
    return { title: title || 'Bilibili Video', thumbnail: thumb || null, formats: [{ quality: '720p', url: videoUrl, ext: 'mp4' }], source: 'native-bilibili' };
  }

  if (platform === 'dailymotion') {
    const videoId = url.match(/video\/([a-zA-Z0-9]+)/)?.[1];
    if (!videoId) throw new Error('Dailymotion: no ID');
    const res = await fetchJson(`https://api.dailymotion.com/video/${videoId}?fields=title,thumbnail_url,stream_h264_hd_url,stream_h264_url`, { timeout: 8000 });
    return {
      title: res.data?.title || 'Dailymotion Video',
      thumbnail: res.data?.thumbnail_url || null,
      formats: [
        { quality: '720p', url: res.data?.stream_h264_hd_url, ext: 'mp4' },
        { quality: '480p', url: res.data?.stream_h264_url, ext: 'mp4' },
      ].filter((f) => f.url),
      source: 'native-dailymotion',
    };
  }

  if (platform === 'vimeo') {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    if (!videoId) throw new Error('Vimeo: no ID');
    const res = await fetchJson(`https://player.vimeo.com/video/${videoId}/config`, {
      timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://vimeo.com/' },
    });
    const files = res.data?.request?.files?.progressive || [];
    if (!files.length) throw new Error('Vimeo: no progressive files');
    return {
      title: res.data?.video?.title || 'Vimeo Video',
      thumbnail: res.data?.video?.thumbs?.['640'] || null,
      // deno-lint-ignore no-explicit-any
      formats: files.map((f: any) => ({ quality: f.quality || `${f.height}p`, url: f.url, ext: 'mp4', size: null })),
      source: 'native-vimeo',
    };
  }

  if (platform === 'pinterest') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-pinterest' };
    if (og.html) {
      const jsonMatch = og.html.match(/{"__PWS_DATA__".*?}<\/script>/s) || og.html.match(/"video_list"\s*:\s*(\{[^}]+\})/);
      if (jsonMatch) {
        try {
          const pinData = JSON.parse(jsonMatch[0].replace(/<\/script>$/, ''));
          const videoObj = JSON.stringify(pinData).match(/"url"\s*:\s*"(https:\/\/v1?\.pinimg\.com\/videos\/[^"]+)"/);
          if (videoObj?.[1]) return { title: og.title || 'Pinterest Video', thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: videoObj[1], ext: 'mp4' }], source: 'native-pinterest' };
        } catch { /* ignore */ }
      }
      const imgMatch = og.html.match(/"(https:\/\/i\.pinimg\.com\/originals\/[^"]+)"/);
      if (og.thumbnail || imgMatch?.[1]) {
        const imgUrl = imgMatch?.[1] || og.thumbnail!;
        return { title: og.title || 'Pinterest Image', thumbnail: og.thumbnail, formats: [{ quality: 'Original', url: imgUrl, ext: inferExtension(imgUrl, 'jpg') }], source: 'native-pinterest', type: 'image' };
      }
    }
    throw new Error('Pinterest: no media found');
  }

  if (platform === 'tumblr') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-tumblr' };
    throw new Error('Tumblr: no video found');
  }

  if (platform === 'imgur') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-imgur' };
    const id = url.match(/imgur\.com\/(?:a\/)?([a-zA-Z0-9]+)/)?.[1];
    if (id) {
      const mp4 = `https://i.imgur.com/${id}.mp4`;
      return { title: 'Imgur Video', thumbnail: `https://i.imgur.com/${id}.jpg`, formats: [{ quality: 'HD', url: mp4, ext: 'mp4' }], source: 'native-imgur' };
    }
    throw new Error('Imgur: no video found');
  }

  if (platform === 'streamable') {
    const id = url.match(/streamable\.com\/([a-zA-Z0-9]+)/)?.[1];
    if (!id) throw new Error('Streamable: no ID');
    const oembed = await tryOEmbed(url, 'https://api.streamable.com/oembed.json');
    return {
      title: oembed?.title || 'Streamable Video',
      thumbnail: oembed?.thumbnail || null,
      formats: [{ quality: 'HD', url: `https://streamable.com/o/${id}`, ext: 'mp4' }],
      source: 'native-streamable',
    };
  }

  // Platforms using OG scraping
  const ogPlatforms = ['vk', 'ok', 'ted', '9gag', 'likee', 'ifunny', 'lemon8', 'bitchute', 'sharechat', 'weibo', 'espn'];
  if (ogPlatforms.includes(platform)) {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: `native-${platform}` };
    throw new Error(`${platform}: no video found`);
  }

  if (platform === 'rutube') {
    const videoId = url.match(/rutube\.ru\/video\/([a-f0-9]+)/)?.[1];
    if (!videoId) throw new Error('Rutube: no video ID');
    const res = await fetchJson(`https://rutube.ru/api/play/options/${videoId}/?format=json`, { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const m3u8 = res.data?.video_balancer?.m3u8;
    return {
      title: res.data?.title || 'Rutube Video',
      thumbnail: res.data?.thumbnail_url || null,
      formats: m3u8 ? [{ quality: 'HD (m3u8)', url: m3u8, ext: 'm3u8' }] : [],
      source: 'native-rutube',
    };
  }

  if (platform === 'coub') {
    const id = url.match(/coub\.com\/view\/([a-zA-Z0-9]+)/)?.[1];
    if (!id) throw new Error('Coub: no ID');
    const res = await fetchJson(`https://coub.com/api/v2/coubs/${id}`, { timeout: 8000 });
    const mp4 = res.data?.file_versions?.html5?.video?.higher?.url || res.data?.file_versions?.html5?.video?.med?.url;
    if (!mp4) throw new Error('Coub: no video URL');
    return {
      title: res.data?.title || 'Coub Video',
      thumbnail: res.data?.image_versions?.template?.replace('%{version}', 'med') || null,
      formats: [{ quality: 'HD', url: mp4, ext: 'mp4' }],
      source: 'native-coub',
    };
  }

  if (platform === 'soundcloud') {
    const og = await scrapeOpenGraph(url);
    const oembed = await tryOEmbed(url, 'https://soundcloud.com/oembed');
    return {
      title: oembed?.title || og.title || 'SoundCloud Track',
      thumbnail: oembed?.thumbnail || og.thumbnail || null,
      formats: [],
      source: 'native-soundcloud',
      type: 'audio',
    };
  }

  if (platform === 'bandcamp') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'audio', url: og.videoUrl, ext: 'mp3' }], source: 'native-bandcamp', type: 'audio' };
    const mp3Match = og.html?.match(/"mp3-128"\s*:\s*"([^"]+)"/);
    if (mp3Match?.[1]) return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: '128kbps', url: mp3Match[1], ext: 'mp3' }], source: 'native-bandcamp', type: 'audio' };
    throw new Error('Bandcamp: no audio found');
  }

  if (platform === 'mixcloud') {
    const oembed = await tryOEmbed(url, 'https://www.mixcloud.com/oembed/');
    return { title: oembed?.title || 'Mixcloud Mix', thumbnail: oembed?.thumbnail || null, formats: [], source: 'native-mixcloud', type: 'audio' };
  }

  if (platform === 'twitch') {
    const clipId = url.match(/clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/)?.[1] || url.match(/twitch\.tv\/\w+\/clip\/([a-zA-Z0-9_-]+)/)?.[1];
    if (clipId) {
      const og = await scrapeOpenGraph(`https://clips.twitch.tv/${clipId}`);
      if (og.videoUrl) return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-twitch' };
    }
    throw new Error('Twitch: only clips with OG video tags are supported natively');
  }

  if (platform === 'instagram') {
    try {
      const oembedRes = await fetchJson(`https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}&hidecaption=true`, {
        timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const title = oembedRes.data?.title || 'Instagram Post';
      const thumbnail = oembedRes.data?.thumbnail_url || null;
      const ddUrl = url.replace('instagram.com', 'ddinstagram.com');
      try {
        const ddRes = await fetchText(ddUrl, { timeout: 8000, maxRedirects: 0, headers: { 'User-Agent': 'Mozilla/5.0' } });
        const videoMatch = ddRes.data.match(/<a[^>]+href="(https:\/\/[^"]*\.mp4[^"]*)"/i)
          || ddRes.data.match(/og:video:secure_url[^>]+content="([^"]+)"/i);
        if (videoMatch?.[1]) return { title, thumbnail, formats: [{ quality: 'HD', url: videoMatch[1], ext: 'mp4' }], source: 'native-instagram' };
      } catch { /* ignore */ }
      if (thumbnail) return { title, thumbnail, formats: [{ quality: 'Image', url: thumbnail, ext: 'jpg' }], source: 'native-instagram', type: 'image' };
    } catch { /* ignore */ }
    throw new Error('Instagram: requires login for video content.');
  }

  if (platform === 'facebook') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-facebook' };
    if (og.html) {
      const sdMatch = og.html.match(/"sd_src(?:_no_ratelimit)?"\s*:\s*"([^"]+)"/);
      const hdMatch = og.html.match(/"hd_src(?:_no_ratelimit)?"\s*:\s*"([^"]+)"/);
      const formats: MediaFormat[] = [];
      if (hdMatch?.[1]) formats.push({ quality: 'HD', url: hdMatch[1].replace(/\\\//g, '/'), ext: 'mp4' });
      if (sdMatch?.[1]) formats.push({ quality: 'SD', url: sdMatch[1].replace(/\\\//g, '/'), ext: 'mp4' });
      if (formats.length) return { title: og.title || 'Facebook Video', thumbnail: og.thumbnail, formats, source: 'native-facebook' };
    }
    throw new Error('Facebook: video not publicly accessible');
  }

  // Generic OG fallback
  try {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      const ext = inferExtension(og.videoUrl, 'mp4');
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext }], source: `native-${platform}` };
    }
    throw new Error(`${platform}: no og:video found`);
  } catch (ogErr: unknown) {
    throw new Error(`No native fallback for ${platform}: ${ogErr instanceof Error ? ogErr.message : 'unknown'}`);
  }
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for') || '';
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const bucket = requestBuckets.get(ip);

  if (!bucket || now - bucket.windowStart >= RATE_LIMIT_WINDOW_MS) {
    requestBuckets.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, retryAfterSec: 0 };
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    const retryAfterSec = Math.max(1, Math.ceil((RATE_LIMIT_WINDOW_MS - (now - bucket.windowStart)) / 1000));
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  bucket.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - bucket.count, retryAfterSec: 0 };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait and try again.' }), {
      status: 429,
      headers: { ...corsHeaders, 'Retry-After': String(limit.retryAfterSec) },
    });
  }

  let url = '';
  try {
    const body = await req.json();
    url = String(body?.url || '').trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: corsHeaders });
  }

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400, headers: corsHeaders });
  }

  try {
    new URL(url);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL format' }), { status: 400, headers: corsHeaders });
  }

  const platform = detectPlatform(url);
  const layers = [
    // For TikTok, TikWM is the most reliable extractor — try it first.
    ...(platform === 'tiktok' ? [{ name: 'tikwm', fn: () => tryTikwm(url) }] : []),
    { name: 'all-media-downloader', fn: () => tryAllMediaDownloader(url) },
    { name: 'social-download-aio', fn: () => trySocialDownloadAllInOne(url) },
    { name: 'auto-download-aio', fn: () => tryAutoDownloadAPI(url) },
    // For non-TikTok platforms, use TikWM as a free fallback after paid RapidAPI layers
    // but before Cobalt/native (it supports IG, FB, YouTube Shorts, X, Douyin, etc.).
    ...(platform !== 'tiktok' ? [{ name: 'tikwm', fn: () => tryTikwm(url) }] : []),
    { name: 'cobalt', fn: () => tryCobaltAPI(url) },
    { name: 'yt-dlp-bridge', fn: () => tryYtDlpBridge(url) },
    { name: 'vidbee-bridge', fn: () => tryVidBeeBridge(url) },
    { name: 'native', fn: () => tryNativeFallback(url, platform) },
  ];

  let lastError: string | null = null;
  for (const layer of layers) {
    try {
      console.log(`[${platform}] Trying layer: ${layer.name}`);
      const result = await layer.fn();
      console.log(`[${platform}] Success via: ${layer.name}`);
      return new Response(JSON.stringify({ ...result, platform }), { status: 200, headers: corsHeaders });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.log(`[${platform}] Layer ${layer.name} failed: ${message}`);
      lastError = message;
    }
  }

  return new Response(JSON.stringify({ error: 'Could not extract media from this URL. Try another link.', platform }), {
    status: 422,
    headers: corsHeaders,
  });
});
