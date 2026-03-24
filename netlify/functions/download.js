const axios = require('axios');

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
async function tryAutoDownloadAPI(url) {
  const response = await axios.get(
    'https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink',
    {
      params: { url },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'auto-download-all-in-one.p.rapidapi.com'
      },
      timeout: 8000
    }
  );

  if (!response.data || response.data.error) {
    throw new Error('API returned error');
  }

  const data = response.data;

  return {
    title: data.title || 'Downloaded Media',
    thumbnail: data.thumbnail || null,
    duration: data.duration || null,
    platform: data.source || 'unknown',
    type: data.type || 'video',
    formats: (data.medias || []).map(m => ({
      quality: m.quality || 'HD',
      url: m.url,
      ext: m.extension || 'mp4',
      size: m.size || null,
      type: m.type || 'video'
    })),
    source: 'auto-download-aio',
  };
}

// Layer 2: Self-hosted Cobalt (Railway backup)
async function tryCobalt(url) {
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

// Layer 3: Native platform fallbacks (free, always on)
async function tryNativeFallback(url, platform) {
  if (platform === 'reddit') {
    const jsonUrl = url.replace(/\/?$/, '.json');
    const res = await axios.get(jsonUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 });
    const post = res.data[0]?.data?.children[0]?.data;
    const videoUrl = post?.secure_media?.reddit_video?.fallback_url;
    if (!videoUrl) throw new Error('Reddit: no video found');
    return { title: post.title || 'Reddit Video', thumbnail: post.thumbnail || null, formats: [{ quality: 'HD', url: videoUrl, ext: 'mp4' }], source: 'native-reddit' };
  }
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
  if (platform === 'dailymotion') {
    const videoId = url.match(/video\/([a-zA-Z0-9]+)/)?.[1];
    if (!videoId) throw new Error('Dailymotion: no ID');
    const res = await axios.get(`https://api.dailymotion.com/video/${videoId}?fields=title,thumbnail_url,stream_h264_hd_url,stream_h264_url`, { timeout: 8000 });
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
      console.log(`[${platform}] Layer ${layer.name} failed: ${err.message}`);
      lastError = err.message;
    }
  }

  return {
    statusCode: 422,
    headers,
    body: JSON.stringify({ error: 'Could not extract media from this URL. Try another link.', platform, debug: process.env.NODE_ENV === 'development' ? lastError : undefined }),
  };
};
