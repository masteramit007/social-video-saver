const axios = require('axios');

const PLATFORMS = {
  tiktok: /tiktok\.com/,
  instagram: /instagram\.com/,
  twitter: /twitter\.com|x\.com/,
  facebook: /facebook\.com|fb\.watch/,
  bilibili: /bilibili\.com/,
  dailymotion: /dailymotion\.com/,
  reddit: /reddit\.com/,
  rumble: /rumble\.com/,
  vimeo: /vimeo\.com/,
  pinterest: /pinterest\.com/,
  snapchat: /snapchat\.com/,
};

function detectPlatform(url) {
  for (const [name, regex] of Object.entries(PLATFORMS)) {
    if (regex.test(url)) return name;
  }
  return 'unknown';
}

async function tryCobalt(url) {
  const res = await axios.post(
    process.env.COBALT_API_URL,
    { url, vCodec: 'h264', vQuality: '720', aFormat: 'mp3', isAudioOnly: false, disableMetadata: false },
    { headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, timeout: 6000 }
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

async function tryFastSaver(url) {
  const res = await axios.get('https://fastsaverapi.com/get-info', {
    params: { url, api_key: process.env.FASTSAVER_API_KEY },
    timeout: 6000,
  });
  if (!res.data || res.data.error) throw new Error('FastSaver failed');
  return {
    title: res.data.title || 'Video',
    thumbnail: res.data.thumbnail || null,
    formats: (res.data.medias || []).map((m) => ({ quality: m.quality || 'HD', url: m.url, ext: m.extension || 'mp4' })),
    source: 'fastsaver',
  };
}

async function tryAllDownloader(url) {
  const res = await axios.post(
    'https://all-downloader1.p.rapidapi.com/download',
    `url=${encodeURIComponent(url)}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'all-downloader1.p.rapidapi.com',
      },
      timeout: 6000,
    }
  );
  if (!res.data || (!res.data.medias && !res.data.url)) throw new Error('AllDownloader failed');
  const medias = res.data.medias || [{ url: res.data.url, quality: 'HD', extension: 'mp4' }];
  return {
    title: res.data.title || 'Video',
    thumbnail: res.data.thumbnail || null,
    formats: medias.map((m) => ({ quality: m.quality || 'HD', url: m.url, ext: m.extension || 'mp4' })),
    source: 'alldownloader',
  };
}

async function tryRapidAPI(url) {
  const res = await axios.get('https://all-social-media-video-downloader.p.rapidapi.com/v1/social/video', {
    params: { url },
    headers: { 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, 'X-RapidAPI-Host': 'all-social-media-video-downloader.p.rapidapi.com' },
    timeout: 6000,
  });
  if (!res.data || !res.data.medias) throw new Error('RapidAPI failed');
  return {
    title: res.data.title || 'Video',
    thumbnail: res.data.thumbnail || null,
    formats: res.data.medias.map((m) => ({ quality: m.quality || 'HD', url: m.url, ext: m.ext || 'mp4' })),
    source: 'rapidapi',
  };
}

async function tryNativeFallback(url, platform) {
  if (platform === 'reddit') {
    const jsonUrl = url.replace(/\/?$/, '.json');
    const res = await axios.get(jsonUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 6000 });
    const post = res.data[0]?.data?.children[0]?.data;
    const videoUrl = post?.secure_media?.reddit_video?.fallback_url;
    if (!videoUrl) throw new Error('Reddit: no video found');
    return { title: post.title || 'Reddit Video', thumbnail: post.thumbnail || null, formats: [{ quality: 'HD', url: videoUrl, ext: 'mp4' }], source: 'native-reddit' };
  }
  if (platform === 'bilibili') {
    const bvid = url.match(/BV[\w]+/)?.[0];
    if (!bvid) throw new Error('Bilibili: no BVID');
    const info = await axios.get(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, { timeout: 6000 });
    const cid = info.data?.data?.cid;
    const title = info.data?.data?.title;
    const thumb = info.data?.data?.pic;
    const stream = await axios.get(`https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=80`, { timeout: 6000 });
    const videoUrl = stream.data?.data?.durl?.[0]?.url;
    if (!videoUrl) throw new Error('Bilibili: no stream');
    return { title: title || 'Bilibili Video', thumbnail: thumb || null, formats: [{ quality: '720p', url: videoUrl, ext: 'mp4' }], source: 'native-bilibili' };
  }
  if (platform === 'dailymotion') {
    const videoId = url.match(/video\/([a-zA-Z0-9]+)/)?.[1];
    if (!videoId) throw new Error('Dailymotion: no ID');
    const res = await axios.get(`https://api.dailymotion.com/video/${videoId}?fields=title,thumbnail_url,stream_h264_hd_url,stream_h264_url`, { timeout: 6000 });
    return {
      title: res.data.title || 'Dailymotion Video',
      thumbnail: res.data.thumbnail_url || null,
      formats: [
        { quality: '720p', url: res.data.stream_h264_hd_url, ext: 'mp4' },
        { quality: '480p', url: res.data.stream_h264_url, ext: 'mp4' },
      ].filter((f) => f.url),
      source: 'native-dailymotion',
    };
  }
  throw new Error(`No native fallback for ${platform}`);
}

const rateLimitMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 15;
  if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, []);
  const requests = rateLimitMap.get(ip).filter((t) => now - t < windowMs);
  if (requests.length >= maxRequests) return true;
  requests.push(now);
  rateLimitMap.set(ip, requests);
  return false;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  const ip = event.headers['x-forwarded-for'] || 'unknown';
  if (isRateLimited(ip)) return { statusCode: 429, headers, body: JSON.stringify({ error: 'Too many requests. Please wait 60 seconds.' }) };

  let url;
  try {
    const body = JSON.parse(event.body || '{}');
    url = body.url?.trim();
    if (!url) throw new Error('No URL');
    new URL(url);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid URL provided.' }) };
  }

  const platform = detectPlatform(url);
  const layers = [
    { name: 'cobalt', fn: () => tryCobalt(url) },
    { name: 'autodownload', fn: () => tryAutoDownload(url) },
    { name: 'fastsaver', fn: () => tryFastSaver(url) },
    { name: 'rapidapi', fn: () => tryRapidAPI(url) },
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
      console.log(`[${platform}] Layer ${layer.name} failed: ${err.message}`);
      lastError = err.message;
    }
  }

  return {
    statusCode: 422,
    headers,
    body: JSON.stringify({ error: 'Could not extract video from this URL. Try another link.', platform, debug: process.env.NODE_ENV === 'development' ? lastError : undefined }),
  };
};
