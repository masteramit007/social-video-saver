const axios = require('axios');

const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const requestBuckets = new Map();

const PLATFORMS = {
  tiktok: /tiktok\.com|vm\.tiktok\.com/,
  douyin: /douyin\.com/,
  capcut: /capcut\.com/,
  hipi: /hipi\.co\.in/,
  xiaohongshu: /xiaohongshu\.com|xhslink\.com/,
  instagram: /instagram\.com/,
  facebook: /facebook\.com|fb\.watch/,
  twitter: /twitter\.com|x\.com/,
  youtube: /youtube\.com|youtu\.be/,
  reddit: /reddit\.com/,
  pinterest: /pinterest\.com/,
  linkedin: /linkedin\.com/,
  snapchat: /snapchat\.com/,
  threads: /threads\.net/,
  bluesky: /bsky\.app/,
  twitch: /twitch\.tv/,
  kick: /kick\.com/,
  rumble: /rumble\.com/,
  dlive: /dlive\.tv/,
  bilibili: /bilibili\.com|b23\.tv/,
  weibo: /weibo\.com/,
  kuaishou: /kuaishou\.com/,
  qq: /v\.qq\.com/,
  sohu: /sohu\.com/,
  ixigua: /ixigua\.com/,
  meipai: /meipai\.com/,
  sina: /video\.sina\.com/,
  vk: /vk\.com/,
  ok: /ok\.ru/,
  rutube: /rutube\.ru/,
  afreecatv: /afreecatv\.com/,
  chzzk: /chzzk\.naver\.com/,
  vimeo: /vimeo\.com/,
  dailymotion: /dailymotion\.com/,
  telegram: /t\.me/,
  tumblr: /tumblr\.com/,
  ted: /ted\.com/,
  imdb: /imdb\.com/,
  imgur: /imgur\.com/,
  streamable: /streamable\.com/,
  bitchute: /bitchute\.com/,
  '9gag': /9gag\.com/,
  coub: /coub\.com/,
  likee: /likee\.video/,
  sharechat: /sharechat\.com/,
  espn: /espn\.com/,
  lemon8: /lemon8-app\.com/,
  ifunny: /ifunny\.co/,
  soundcloud: /soundcloud\.com/,
  spotify: /spotify\.com|open\.spotify\.com/,
  'apple-music': /music\.apple\.com/,
  'apple-podcasts': /podcasts\.apple\.com/,
  deezer: /deezer\.com/,
  tidal: /tidal\.com/,
  mixcloud: /mixcloud\.com/,
  bandcamp: /bandcamp\.com/,
  audiomack: /audiomack\.com/,
  audius: /audius\.co/,
  jiosaavn: /jiosaavn\.com/,
  gaana: /gaana\.com/,
  zingmp3: /zingmp3\.vn/,
  nhaccuatui: /nhaccuatui\.com/,
  castbox: /castbox\.fm/,
  audioboom: /audioboom\.com/,
  acast: /acast\.com/,
  hearthis: /hearthis\.at/,
  jamendo: /jamendo\.com/,
  simplecast: /simplecast\.com/,
  spreaker: /spreaker\.com/,
};

function detectPlatform(url) {
  for (const [name, regex] of Object.entries(PLATFORMS)) {
    if (regex.test(url)) return name;
  }
  return 'unknown';
}

// Layer 1: Auto Download All In One (PRIMARY - paid plan)
function inferExtension(mediaUrl, fallback = 'mp4') {
  if (!mediaUrl || typeof mediaUrl !== 'string') return fallback;
  const match = mediaUrl.match(/\.([a-zA-Z0-9]{2,5})(?:\?|#|$)/);
  return (match?.[1] || fallback).toLowerCase();
}

function normalizeRapidApiResult(payload) {
  const data = payload?.data || payload?.result || payload;
  const mediaCandidates = [];

  if (Array.isArray(data?.medias)) mediaCandidates.push(...data.medias);
  if (Array.isArray(data?.links)) mediaCandidates.push(...data.links);
  if (Array.isArray(data?.urls)) mediaCandidates.push(...data.urls);

  const directUrls = [
    data?.url,
    data?.videoUrl,
    data?.downloadUrl,
    data?.download_url,
    data?.video?.url,
    data?.audio?.url,
  ].filter(Boolean);

  mediaCandidates.push(
    ...directUrls.map((u) => ({ url: u, quality: 'HD' }))
  );

  const uniqueByUrl = new Map();
  for (const media of mediaCandidates) {
    const mediaUrl = media?.url || media?.link || media?.src;
    if (!mediaUrl || uniqueByUrl.has(mediaUrl)) continue;

    const ext = (media?.extension || media?.ext || inferExtension(mediaUrl, 'mp4')).toLowerCase();
    const isAudio = ['mp3', 'm4a', 'aac', 'wav', 'ogg'].includes(ext);

    uniqueByUrl.set(mediaUrl, {
      quality: media?.quality || media?.label || (isAudio ? 'audio' : 'HD'),
      url: mediaUrl,
      ext,
      size: media?.size || null,
      type: media?.type || (isAudio ? 'audio' : 'video'),
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

async function tryAutoDownloadAPI(url) {
  if (!process.env.RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY is not configured');
  }

  const rapidApiTargets = [
    {
      method: 'get',
      url: 'https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink',
      host: 'auto-download-all-in-one.p.rapidapi.com',
      timeout: 5000,
      params: { url },
    },
    {
      method: 'post',
      url: 'https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink',
      host: 'auto-download-all-in-one.p.rapidapi.com',
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
      data: { url },
    },
    {
      method: 'get',
      url: 'https://auto-download-all-in-one1.p.rapidapi.com/v1/social/autolink',
      host: 'auto-download-all-in-one1.p.rapidapi.com',
      timeout: 5000,
      params: { url },
    },
    {
      method: 'post',
      url: 'https://auto-download-all-in-one1.p.rapidapi.com/v1/social/autolink',
      host: 'auto-download-all-in-one1.p.rapidapi.com',
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
      data: { url },
    },
    {
      method: 'post',
      url: 'https://auto-download-all-in-one1.p.rapidapi.com/all',
      host: 'auto-download-all-in-one1.p.rapidapi.com',
      timeout: 5000,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({ url }).toString(),
    },
  ];

  let lastError = 'unknown error';

  for (const target of rapidApiTargets) {
    try {
      const response = await axios.request({
        method: target.method,
        url: target.url,
        timeout: target.timeout,
        params: target.params,
        data: target.data,
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': target.host,
          ...(target.headers || {}),
        },
      });

      if (!response.data || response.data.error) {
        throw new Error(response.data?.error || 'API returned error');
      }

      const normalized = normalizeRapidApiResult(response.data);
      if (!normalized.formats.length) {
        throw new Error('API returned no downloadable media');
      }

      return {
        ...normalized,
        source: 'auto-download-aio',
      };
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.message || 'Unknown RapidAPI error';
      lastError = status ? `${msg} (status ${status})` : msg;
      console.log(`[rapidapi:${target.host}] ${lastError}`);
    }
  }

  throw new Error(`RapidAPI failed across all endpoints: ${lastError}`);
}

// Layer 2: Self-hosted Cobalt (Railway backup)
async function tryCobalt(url) {
  if (!process.env.COBALT_API_URL) {
    throw new Error('COBALT_API_URL is not configured');
  }

  const res = await axios.post(
    process.env.COBALT_API_URL,
    { url, vCodec: 'h264', vQuality: '720', aFormat: 'mp3', isAudioOnly: false, disableMetadata: false },
    { headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, timeout: 8000 }
  );
  if (res.data.status === 'stream' || res.data.status === 'redirect') {
    return {
      title: res.data.filename || 'Video',
      thumbnail: res.data.thumb || null,
      formats: [
        { quality: '720p', url: res.data.url, ext: 'mp4' },
        { quality: 'audio', url: res.data.url, ext: 'mp3' },
      ],
      source: 'cobalt',
    };
  }
  throw new Error('Cobalt: no stream URL');
}

function getRedditVideoUrl(post) {
  const candidates = [
    post?.secure_media?.reddit_video?.fallback_url,
    post?.media?.reddit_video?.fallback_url,
    post?.crosspost_parent_list?.[0]?.secure_media?.reddit_video?.fallback_url,
    post?.crosspost_parent_list?.[0]?.media?.reddit_video?.fallback_url,
    post?.preview?.reddit_video_preview?.fallback_url,
  ];

  return candidates.find((item) => typeof item === 'string' && item.length > 0) || null;
}

function getXStatusId(url) {
  return url.match(/(?:twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/)?.[1] || null;
}

function normalizeXFormats(payload) {
  const mediaGroups = [
    payload?.media_extended,
    payload?.media,
    payload?.tweet?.media,
    payload?.tweet?.media?.all,
    payload?.videos,
  ].filter(Array.isArray);

  const uniqueByUrl = new Map();

  const addFormat = (mediaUrl, quality = 'HD') => {
    if (!mediaUrl || uniqueByUrl.has(mediaUrl)) return;
    const ext = inferExtension(mediaUrl, 'mp4');
    if (ext === 'm3u8') return;
    uniqueByUrl.set(mediaUrl, {
      quality,
      url: mediaUrl,
      ext,
      type: 'video',
      size: null,
    });
  };

  for (const group of mediaGroups) {
    for (const item of group) {
      addFormat(item?.url || item?.download_url || item?.media_url_https || item?.src, item?.quality || item?.label || 'HD');

      const variants = item?.video_info?.variants || item?.video?.variants || item?.variants || [];
      for (const variant of variants) {
        const bitrate = Number(variant?.bitrate || 0);
        const quality = bitrate > 0 ? `${Math.round(bitrate / 1000)}k` : (variant?.quality || 'HD');
        addFormat(variant?.url, quality);
      }
    }
  }

  return Array.from(uniqueByUrl.values());
}

async function tryXFallback(url) {
  const statusId = getXStatusId(url);
  if (!statusId) {
    throw new Error('X: could not parse tweet status ID');
  }

  const endpoints = [
    `https://api.vxtwitter.com/Twitter/status/${statusId}`,
    `https://api.fxtwitter.com/status/${statusId}`,
  ];

  let lastError = 'unknown error';

  for (const endpoint of endpoints) {
    try {
      const res = await axios.get(endpoint, {
        timeout: 8000,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      const formats = normalizeXFormats(res.data || {});
      if (!formats.length) {
        throw new Error('X fallback returned no downloadable media');
      }

      return {
        title: res.data?.text || res.data?.tweet?.text || 'X Video',
        thumbnail: res.data?.media_extended?.[0]?.thumbnail_url || res.data?.media?.[0]?.thumbnail_url || null,
        formats,
        source: 'native-x',
        type: 'video',
      };
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.message || 'Unknown X fallback error';
      lastError = status ? `${message} (status ${status})` : message;
      console.log(`[x-fallback] ${endpoint} failed: ${lastError}`);
    }
  }

  throw new Error(`X fallback failed: ${lastError}`);
}

function getClientIp(event) {
  const forwardedFor = event?.headers?.['x-forwarded-for'] || event?.headers?.['X-Forwarded-For'] || '';
  const direct = event?.headers?.['x-nf-client-connection-ip'] || event?.headers?.['X-Nf-Client-Connection-Ip'];
  if (direct) return String(direct).trim();
  if (forwardedFor) return String(forwardedFor).split(',')[0].trim();
  return 'unknown';
}

function checkRateLimit(ip) {
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
  requestBuckets.set(ip, bucket);
  return { allowed: true, remaining: RATE_LIMIT_MAX - bucket.count, retryAfterSec: 0 };
}

// Layer 3: Native platform fallbacks (free, always on)
// Covers ALL supported platforms with oEmbed, page scraping, or public API approaches

async function scrapeOpenGraph(url) {
  const res = await axios.get(url, {
    timeout: 8000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    },
    maxRedirects: 5,
  });
  const html = typeof res.data === 'string' ? res.data : '';
  const og = (prop) => {
    const m = html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))
      || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, 'i'));
    return m?.[1] || null;
  };
  const title = og('title') || html.match(/<title>([^<]+)<\/title>/i)?.[1] || 'Video';
  const thumbnail = og('image') || null;
  const videoUrl = og('video:secure_url') || og('video:url') || og('video') || null;
  return { title, thumbnail, videoUrl, html };
}

async function tryOEmbed(url, oembedEndpoint) {
  try {
    const res = await axios.get(oembedEndpoint, {
      params: { url, format: 'json' },
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

async function tryNativeFallback(url, platform) {
  // ---------- Reddit ----------
  if (platform === 'reddit') {
    // Normalize URL: strip trailing slash, query params, ensure .json
    let cleanUrl = url.split('?')[0].replace(/\/+$/, '');
    // Handle short links like redd.it
    if (/redd\.it/.test(cleanUrl)) {
      const resolved = await axios.get(cleanUrl, { maxRedirects: 5, timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } });
      cleanUrl = (resolved.request?.res?.responseUrl || resolved.headers?.location || cleanUrl).split('?')[0].replace(/\/+$/, '');
    }
    const jsonUrl = cleanUrl + '.json';
    const res = await axios.get(jsonUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, timeout: 8000 });
    const listing = Array.isArray(res.data) ? res.data : [res.data];
    const post = listing[0]?.data?.children?.[0]?.data;
    if (!post) throw new Error('Reddit: could not parse post data');
    const videoUrl = getRedditVideoUrl(post);
    // Also check for gif/image posts
    const gifUrl = post?.preview?.images?.[0]?.variants?.mp4?.source?.url?.replace(/&amp;/g, '&');
    const mediaUrl = videoUrl || gifUrl;
    if (!mediaUrl) throw new Error('Reddit: no video found in post');
    const formats = [{ quality: 'HD', url: mediaUrl, ext: 'mp4' }];
    // Try to get audio track for Reddit videos (they split audio/video)
    if (videoUrl) {
      const audioUrl = videoUrl.replace(/DASH_\d+\.mp4/, 'DASH_audio.mp4').replace(/DASH_\d+/, 'DASH_audio');
      formats.push({ quality: 'audio', url: audioUrl, ext: 'mp4', type: 'audio' });
    }
    return { title: post?.title || 'Reddit Video', thumbnail: (post?.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') ? post.thumbnail : null, formats, source: 'native-reddit' };
  }

  // ---------- X / Twitter ----------
  if (platform === 'twitter') {
    return tryXFallback(url);
  }

  // ---------- Bilibili ----------
  if (platform === 'bilibili') {
    const bvid = url.match(/BV[\w]+/)?.[0];
    if (!bvid) throw new Error('Bilibili: no BVID');
    const info = await axios.get(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, { timeout: 8000 });
    const cid = info.data?.data?.cid;
    const title = info.data?.data?.title;
    const thumb = info.data?.data?.pic;
    const stream = await axios.get(`https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=80`, { timeout: 8000 });
    const videoUrl = stream.data?.data?.durl?.[0]?.url;
    if (!videoUrl) throw new Error('Bilibili: no stream');
    return { title: title || 'Bilibili Video', thumbnail: thumb || null, formats: [{ quality: '720p', url: videoUrl, ext: 'mp4' }], source: 'native-bilibili' };
  }

  // ---------- Dailymotion ----------
  if (platform === 'dailymotion') {
    const videoId = url.match(/video\/([a-zA-Z0-9]+)/)?.[1];
    if (!videoId) throw new Error('Dailymotion: no ID');
    const res = await axios.get(`https://api.dailymotion.com/video/${videoId}?fields=title,thumbnail_url,stream_h264_hd_url,stream_h264_url`, { timeout: 8000 });
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

  // ---------- Vimeo ----------
  if (platform === 'vimeo') {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    if (!videoId) throw new Error('Vimeo: no ID');
    const res = await axios.get(`https://player.vimeo.com/video/${videoId}/config`, {
      timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://vimeo.com/' },
    });
    const files = res.data?.request?.files?.progressive || [];
    if (!files.length) throw new Error('Vimeo: no progressive files');
    return {
      title: res.data?.video?.title || 'Vimeo Video',
      thumbnail: res.data?.video?.thumbs?.['640'] || null,
      formats: files.map(f => ({ quality: f.quality || `${f.height}p`, url: f.url, ext: 'mp4', size: null })),
      source: 'native-vimeo',
    };
  }

  // ---------- Pinterest ----------
  if (platform === 'pinterest') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-pinterest' };
    }
    // Try extracting from page JSON data
    if (og.html) {
      const jsonMatch = og.html.match(/{"__PWS_DATA__".*?}<\/script>/s) || og.html.match(/"video_list"\s*:\s*(\{[^}]+\})/);
      if (jsonMatch) {
        try {
          const pinData = JSON.parse(jsonMatch[0].replace(/<\/script>$/, ''));
          const videoObj = JSON.stringify(pinData).match(/"url"\s*:\s*"(https:\/\/v1?\.pinimg\.com\/videos\/[^"]+)"/);
          if (videoObj?.[1]) {
            return { title: og.title || 'Pinterest Video', thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: videoObj[1], ext: 'mp4' }], source: 'native-pinterest' };
          }
        } catch {}
      }
      // Also check for image pins
      const imgMatch = og.html.match(/"(https:\/\/i\.pinimg\.com\/originals\/[^"]+)"/);
      if (og.thumbnail || imgMatch?.[1]) {
        const imgUrl = imgMatch?.[1] || og.thumbnail;
        return { title: og.title || 'Pinterest Image', thumbnail: og.thumbnail, formats: [{ quality: 'Original', url: imgUrl, ext: inferExtension(imgUrl, 'jpg') }], source: 'native-pinterest', type: 'image' };
      }
    }
    throw new Error('Pinterest: no media found');
  }

  // ---------- Tumblr ----------
  if (platform === 'tumblr') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-tumblr' };
    }
    throw new Error('Tumblr: no video found');
  }

  // ---------- Imgur ----------
  if (platform === 'imgur') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-imgur' };
    }
    // Imgur also uses direct mp4 links
    const id = url.match(/imgur\.com\/(?:a\/)?([a-zA-Z0-9]+)/)?.[1];
    if (id) {
      const mp4 = `https://i.imgur.com/${id}.mp4`;
      return { title: 'Imgur Video', thumbnail: `https://i.imgur.com/${id}.jpg`, formats: [{ quality: 'HD', url: mp4, ext: 'mp4' }], source: 'native-imgur' };
    }
    throw new Error('Imgur: no video found');
  }

  // ---------- Streamable ----------
  if (platform === 'streamable') {
    const id = url.match(/streamable\.com\/([a-zA-Z0-9]+)/)?.[1];
    if (!id) throw new Error('Streamable: no ID');
    const oembed = await tryOEmbed(url, 'https://api.streamable.com/oembed.json');
    const mp4 = `https://streamable.com/video/mp4/${id}`;
    return {
      title: oembed?.title || 'Streamable Video',
      thumbnail: oembed?.thumbnail || null,
      formats: [{ quality: 'HD', url: `https://streamable.com/o/${id}`, ext: 'mp4' }],
      source: 'native-streamable',
    };
  }

  // ---------- VK ----------
  if (platform === 'vk') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-vk' };
    }
    throw new Error('VK: no video found via OG tags');
  }

  // ---------- OK.ru ----------
  if (platform === 'ok') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-ok' };
    }
    throw new Error('OK.ru: no video found via OG tags');
  }

  // ---------- Rutube ----------
  if (platform === 'rutube') {
    const videoId = url.match(/rutube\.ru\/video\/([a-f0-9]+)/)?.[1];
    if (!videoId) throw new Error('Rutube: no video ID');
    const res = await axios.get(`https://rutube.ru/api/play/options/${videoId}/?format=json`, { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const m3u8 = res.data?.video_balancer?.m3u8;
    // For m3u8, we still return it — some clients handle it
    return {
      title: res.data?.title || 'Rutube Video',
      thumbnail: res.data?.thumbnail_url || null,
      formats: m3u8 ? [{ quality: 'HD (m3u8)', url: m3u8, ext: 'm3u8' }] : [],
      source: 'native-rutube',
    };
  }

  // ---------- TED ----------
  if (platform === 'ted') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-ted' };
    }
    throw new Error('TED: no video found');
  }

  // ---------- Coub ----------
  if (platform === 'coub') {
    const id = url.match(/coub\.com\/view\/([a-zA-Z0-9]+)/)?.[1];
    if (!id) throw new Error('Coub: no ID');
    const res = await axios.get(`https://coub.com/api/v2/coubs/${id}`, { timeout: 8000 });
    const mp4 = res.data?.file_versions?.html5?.video?.higher?.url || res.data?.file_versions?.html5?.video?.med?.url;
    if (!mp4) throw new Error('Coub: no video URL');
    return {
      title: res.data?.title || 'Coub Video',
      thumbnail: res.data?.image_versions?.template?.replace('%{version}', 'med') || null,
      formats: [{ quality: 'HD', url: mp4, ext: 'mp4' }],
      source: 'native-coub',
    };
  }

  // ---------- 9GAG ----------
  if (platform === '9gag') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-9gag' };
    }
    throw new Error('9GAG: no video found');
  }

  // ---------- SoundCloud ----------
  if (platform === 'soundcloud') {
    const og = await scrapeOpenGraph(url);
    // SoundCloud doesn't expose direct audio in OG but we can try oEmbed for metadata
    const oembed = await tryOEmbed(url, 'https://soundcloud.com/oembed');
    return {
      title: oembed?.title || og.title || 'SoundCloud Track',
      thumbnail: oembed?.thumbnail || og.thumbnail || null,
      formats: [], // RapidAPI/Cobalt handle actual download; native returns metadata
      source: 'native-soundcloud',
      type: 'audio',
      note: 'SoundCloud direct download requires API authentication. The track was detected but download must go through our primary extractors.',
    };
  }

  // ---------- Bandcamp ----------
  if (platform === 'bandcamp') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'audio', url: og.videoUrl, ext: 'mp3' }], source: 'native-bandcamp', type: 'audio' };
    }
    // Bandcamp often has direct mp3 in page source
    const mp3Match = og.html?.match(/"mp3-128"\s*:\s*"([^"]+)"/);
    if (mp3Match?.[1]) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: '128kbps', url: mp3Match[1], ext: 'mp3' }], source: 'native-bandcamp', type: 'audio' };
    }
    throw new Error('Bandcamp: no audio found');
  }

  // ---------- Mixcloud ----------
  if (platform === 'mixcloud') {
    const oembed = await tryOEmbed(url, 'https://www.mixcloud.com/oembed/');
    return {
      title: oembed?.title || 'Mixcloud Mix',
      thumbnail: oembed?.thumbnail || null,
      formats: [],
      source: 'native-mixcloud',
      type: 'audio',
      note: 'Mixcloud streams are DRM-protected. Use primary extractors.',
    };
  }

  // ---------- Twitch ----------
  if (platform === 'twitch') {
    const clipId = url.match(/clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/)?.[1] || url.match(/twitch\.tv\/\w+\/clip\/([a-zA-Z0-9_-]+)/)?.[1];
    if (clipId) {
      const og = await scrapeOpenGraph(`https://clips.twitch.tv/${clipId}`);
      if (og.videoUrl) {
        return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-twitch' };
      }
    }
    throw new Error('Twitch: only clips with OG video tags are supported natively');
  }

  // ---------- ESPN ----------
  if (platform === 'espn') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-espn' };
    }
    throw new Error('ESPN: no video found');
  }

  // ---------- Likee ----------
  if (platform === 'likee') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-likee' };
    }
    throw new Error('Likee: no video found');
  }

  // ---------- iFunny ----------
  if (platform === 'ifunny') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-ifunny' };
    }
    throw new Error('iFunny: no video found');
  }

  // ---------- Lemon8 ----------
  if (platform === 'lemon8') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-lemon8' };
    }
    throw new Error('Lemon8: no video found');
  }

  // ---------- BitChute ----------
  if (platform === 'bitchute') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-bitchute' };
    }
    throw new Error('BitChute: no video found');
  }

  // ---------- ShareChat ----------
  if (platform === 'sharechat') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-sharechat' };
    }
    throw new Error('ShareChat: no video found');
  }

  // ---------- Weibo ----------
  if (platform === 'weibo') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-weibo' };
    }
    throw new Error('Weibo: no video found');
  }

  // ---------- Instagram ----------
  if (platform === 'instagram') {
    // Try Instagram's oEmbed API for metadata
    try {
      const oembedRes = await axios.get('https://api.instagram.com/oembed/', {
        params: { url, hidecaption: true },
        timeout: 8000,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const title = oembedRes.data?.title || 'Instagram Post';
      const thumbnail = oembedRes.data?.thumbnail_url || null;
      // Try DDInstagram for actual video extraction
      const ddUrl = url.replace('instagram.com', 'ddinstagram.com');
      try {
        const ddRes = await axios.get(ddUrl, {
          timeout: 8000,
          maxRedirects: 0,
          validateStatus: (s) => s >= 200 && s < 400,
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const videoMatch = (typeof ddRes.data === 'string' ? ddRes.data : '').match(/<a[^>]+href="(https:\/\/[^"]*\.mp4[^"]*)"/i)
          || (typeof ddRes.data === 'string' ? ddRes.data : '').match(/og:video:secure_url[^>]+content="([^"]+)"/i);
        if (videoMatch?.[1]) {
          return { title, thumbnail, formats: [{ quality: 'HD', url: videoMatch[1], ext: 'mp4' }], source: 'native-instagram' };
        }
      } catch {}
      // If we at least got metadata, return with thumbnail
      if (thumbnail) {
        return { title, thumbnail, formats: [{ quality: 'Image', url: thumbnail, ext: 'jpg' }], source: 'native-instagram', type: 'image' };
      }
    } catch {}
    throw new Error('Instagram: requires login for video content. Primary extractors handle this.');
  }

  // ---------- Facebook ----------
  if (platform === 'facebook') {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      return { title: og.title, thumbnail: og.thumbnail, formats: [{ quality: 'HD', url: og.videoUrl, ext: 'mp4' }], source: 'native-facebook' };
    }
    // Try extracting from page source - Facebook embeds video URLs in JSON
    if (og.html) {
      const sdMatch = og.html.match(/"sd_src(?:_no_ratelimit)?"\s*:\s*"([^"]+)"/);
      const hdMatch = og.html.match(/"hd_src(?:_no_ratelimit)?"\s*:\s*"([^"]+)"/);
      const formats = [];
      if (hdMatch?.[1]) formats.push({ quality: 'HD', url: hdMatch[1].replace(/\\\//g, '/'), ext: 'mp4' });
      if (sdMatch?.[1]) formats.push({ quality: 'SD', url: sdMatch[1].replace(/\\\//g, '/'), ext: 'mp4' });
      if (formats.length) {
        return { title: og.title || 'Facebook Video', thumbnail: og.thumbnail, formats, source: 'native-facebook' };
      }
    }
    throw new Error('Facebook: video not publicly accessible');
  }

  // ---------- GENERIC OG FALLBACK for all remaining platforms ----------
  try {
    const og = await scrapeOpenGraph(url);
    if (og.videoUrl) {
      const ext = inferExtension(og.videoUrl, 'mp4');
      return {
        title: og.title,
        thumbnail: og.thumbnail,
        formats: [{ quality: 'HD', url: og.videoUrl, ext }],
        source: `native-${platform}`,
      };
    }
    throw new Error(`${platform}: no og:video found`);
  } catch (ogErr) {
    throw new Error(`No native fallback for ${platform}: ${ogErr.message}`);
  }
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const ip = getClientIp(event);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return {
      statusCode: 429,
      headers: {
        ...headers,
        'Retry-After': String(limit.retryAfterSec),
      },
      body: JSON.stringify({ error: 'Too many requests. Please wait and try again.' }),
    };
  }

  let url = '';
  try {
    const body = JSON.parse(event.body || '{}');
    url = String(body?.url || '').trim();
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!url) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'URL is required' }) };
  }

  try {
    new URL(url);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid URL format' }) };
  }

  const platform = detectPlatform(url);
  const layers = [
    { name: 'auto-download-aio', fn: () => tryAutoDownloadAPI(url) },
    { name: 'cobalt', fn: () => tryCobalt(url) },
    { name: 'native', fn: () => tryNativeFallback(url, platform) },
  ];

  let lastError = null;
  for (const layer of layers) {
    try {
      console.log(`[${platform}] Trying layer: ${layer.name}`);
      const result = await layer.fn();
      console.log(`[${platform}] Success via: ${layer.name}`);
      return { statusCode: 200, headers, body: JSON.stringify({ ...result, platform }) };
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.message || 'Unknown error';
      const fullMessage = status ? `${message} (status ${status})` : message;
      console.log(`[${platform}] Layer ${layer.name} failed: ${fullMessage}`);

      if (err?.response?.data) {
        const payload = typeof err.response.data === 'string'
          ? err.response.data
          : JSON.stringify(err.response.data);
        console.log(`[${platform}] Layer ${layer.name} response: ${payload.slice(0, 300)}`);
      }

      lastError = fullMessage;
    }
  }

  return {
    statusCode: 422,
    headers,
    body: JSON.stringify({ error: 'Could not extract media from this URL. Try another link.', platform, debug: process.env.NODE_ENV === 'development' ? lastError : undefined }),
  };
};
