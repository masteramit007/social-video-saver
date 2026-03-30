/**
 * Cloudflare Worker — SEO Prerender Proxy
 * 
 * Detects search-engine / social-media bot user-agents and serves a
 * lightweight HTML page with correct <title>, <meta>, canonical, and
 * Open Graph tags.  All other traffic is passed through to the origin
 * (Lovable Cloud).
 *
 * Deploy: npx wrangler deploy
 * Config: see wrangler.toml in the same folder
 */

// ── Origin (your Lovable Cloud published URL) ──────────────────────
const ORIGIN = 'https://vid-stream-direct.lovable.app';
const CANONICAL_BASE = 'https://socialmediavideodownload.com';
const SITE_NAME = 'SocialMediaVideoDownload.com';

// ── Bot detection ──────────────────────────────────────────────────
const BOT_UA = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|applebot|pinterestbot|redditbot|rogerbot|embedly|quora link preview|showyoubot|outbrain|pinterest|vkshare|w3c_validator|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|bytespider/i;

// ── Platform SEO data (English) ────────────────────────────────────
const P = {
  tiktok: { t: 'TikTok Video Downloader — No Watermark, Free HD 2026', d: 'Download TikTok videos without watermark free. Best TikTok downloader online — save TikTok to MP4 or MP3 in HD. No login, no app. Works on iPhone & Android.' },
  youtube: { t: 'YouTube Video Downloader — Free MP4 & MP3 Download Online 2026', d: 'Free YouTube video downloader — save YouTube videos as MP4 or convert to MP3. Download YouTube Shorts, HD videos online. No software needed.' },
  reddit: { t: 'Reddit Video Downloader — Download Reddit Videos With Audio 2026', d: 'Download Reddit videos with audio merged. Free Reddit video downloader — save any Reddit video post in HD quality. No login required.' },
  pinterest: { t: 'Pinterest Video Downloader — Download Video Pins Free HD 2026', d: 'Download Pinterest videos and video pins. Save video pins in HD quality to your device. Free, no login required.' },
  twitch: { t: 'Twitch Clip Downloader — Download Twitch Clips & VODs Free 2026', d: 'Download Twitch clips and VODs. Save your favorite Twitch moments in HD quality. Free, no login required.' },
  bilibili: { t: 'Bilibili Video Downloader — Download Bilibili Videos Free 2026', d: 'Download Bilibili videos for international users. Free Bilibili video downloader in HD quality. No account needed.' },
  vimeo: { t: 'Vimeo Video Downloader — Download Vimeo Videos Free HD 2026', d: 'Download public Vimeo videos for free in HD. Multiple quality options available. No Vimeo account needed.' },
  dailymotion: { t: 'Dailymotion Video Downloader — Free HD Download 2026', d: 'Download Dailymotion videos in multiple qualities. Free and fast Dailymotion video downloader.' },
  tumblr: { t: 'Tumblr Video Downloader — Free HD Download 2026', d: 'Download Tumblr videos from posts. Save Tumblr video content in HD quality.' },
  vk: { t: 'VK Video Downloader — Скачать видео из ВК бесплатно 2026', d: 'Download VK (VKontakte) videos. Скачивайте видео и клипы Вконтакте в высоком качестве MP4.' },
  ok: { t: 'OK.ru Video Downloader — Скачать видео с Одноклассников 2026', d: 'Download OK.ru (Odnoklassniki) videos. Загружайте видео из Одноклассников по ссылке.' },
  rutube: { t: 'RuTube Video Downloader — Скачать видео с Рутуба 2026', d: 'Download RuTube videos. Скачивайте видео с Rutube в HD качестве.' },
  '9gag': { t: '9GAG Video Downloader — Free HD Download 2026', d: 'Download 9GAG videos and GIFs. Save funny video content from 9GAG.' },
  ted: { t: 'TED Talk Downloader — Free HD Download 2026', d: 'Download TED Talk videos for offline viewing. Save inspiring talks in HD quality.' },
  imgur: { t: 'Imgur Video Downloader — Free HD Download 2026', d: 'Download Imgur videos and GIFs. Save Imgur video content to your device.' },
  streamable: { t: 'Streamable Video Downloader — Free HD Download 2026', d: 'Download Streamable videos in HD. Save short video clips from Streamable.' },
  bitchute: { t: 'BitChute Video Downloader — Free HD Download 2026', d: 'Download BitChute videos for free in HD quality. Fast BitChute video downloader.' },
  coub: { t: 'Coub Video Downloader — Free HD Download 2026', d: 'Download Coub looping videos. Save Coub video content to your device.' },
  likee: { t: 'Likee Video Downloader — Free HD Download 2026', d: 'Download Likee short videos. Save Likee video content in HD quality.' },
  sharechat: { t: 'ShareChat Video Downloader — Free HD Download 2026', d: 'Download ShareChat videos. Save Indian social media video content in HD quality.' },
  espn: { t: 'ESPN Video Downloader — Free HD Download 2026', d: 'Download ESPN video clips. Save sports highlights and news clips from ESPN.' },
  lemon8: { t: 'Lemon8 Video Downloader — Free HD Download 2026', d: 'Download Lemon8 videos and content. Save lifestyle video content from Lemon8.' },
  ifunny: { t: 'iFunny Video Downloader — Free HD Download 2026', d: 'Download iFunny videos and GIFs. Save funny video content from iFunny.' },
  weibo: { t: 'Weibo Video Downloader — Free HD Download 2026', d: 'Download Weibo videos from posts. Save Chinese social media video content in HD.' },
  bandcamp: { t: 'Bandcamp Audio Downloader — Free Download 2026', d: 'Download Bandcamp tracks. Save independent music for offline listening.' },
};

// ── Localized metadata (top platforms) ─────────────────────────────
const L = {
  hi: {
    tiktok: { t: 'TikTok वीडियो डाउनलोडर — बिना वॉटरमार्क, मुफ्त HD 2026', d: 'TikTok वीडियो बिना वॉटरमार्क मुफ्त डाउनलोड करें। HD में MP4 या MP3 में सेव करें।' },
    youtube: { t: 'YouTube वीडियो डाउनलोडर — मुफ्त MP4 और MP3 2026', d: 'YouTube वीडियो मुफ्त डाउनलोड करें। HD में ऑफ़लाइन देखने के लिए सेव करें।' },
    reddit: { t: 'Reddit वीडियो डाउनलोडर — ऑडियो के साथ डाउनलोड 2026', d: 'Reddit वीडियो ऑडियो के साथ डाउनलोड करें। HD में सेव करें।' },
    pinterest: { t: 'Pinterest वीडियो डाउनलोडर — मुफ्त HD 2026', d: 'Pinterest वीडियो और पिन मुफ्त डाउनलोड करें।' },
    twitch: { t: 'Twitch क्लिप डाउनलोडर — मुफ्त HD 2026', d: 'Twitch क्लिप और VOD डाउनलोड करें।' },
  },
  es: {
    tiktok: { t: 'Descargador de Videos TikTok — Sin Marca de Agua, HD Gratis 2026', d: 'Descarga videos de TikTok sin marca de agua gratis. Guarda TikTok en MP4 o MP3 en HD.' },
    youtube: { t: 'Descargador de Videos YouTube — MP4 y MP3 Gratis 2026', d: 'Descarga videos de YouTube gratis en HD. Sin software necesario.' },
    reddit: { t: 'Descargador de Videos Reddit — Con Audio Gratis 2026', d: 'Descarga videos de Reddit con audio en HD. Sin registro.' },
    pinterest: { t: 'Descargador de Videos Pinterest — HD Gratis 2026', d: 'Descarga videos y pines de Pinterest en HD gratis.' },
    twitch: { t: 'Descargador de Clips Twitch — HD Gratis 2026', d: 'Descarga clips y VODs de Twitch en HD.' },
  },
  fr: {
    tiktok: { t: 'Téléchargeur TikTok — Sans Filigrane, HD Gratuit 2026', d: 'Téléchargez des vidéos TikTok sans filigrane gratuitement en HD.' },
    youtube: { t: 'Téléchargeur YouTube — MP4 et MP3 Gratuit 2026', d: 'Téléchargez des vidéos YouTube gratuitement en HD.' },
    reddit: { t: 'Téléchargeur Reddit — Avec Audio Gratuit 2026', d: 'Téléchargez des vidéos Reddit avec audio en HD.' },
    pinterest: { t: 'Téléchargeur Pinterest — HD Gratuit 2026', d: 'Téléchargez des vidéos Pinterest en HD gratuitement.' },
    twitch: { t: 'Téléchargeur Twitch — Clips et VODs Gratuit 2026', d: 'Téléchargez des clips Twitch et VODs en HD.' },
  },
  de: {
    tiktok: { t: 'TikTok Video Downloader — Ohne Wasserzeichen, Kostenlos HD 2026', d: 'TikTok Videos ohne Wasserzeichen kostenlos herunterladen. In HD als MP4 oder MP3 speichern.' },
    youtube: { t: 'YouTube Video Downloader — Kostenlos MP4 & MP3 2026', d: 'YouTube Videos kostenlos in HD herunterladen. Keine Software nötig.' },
    reddit: { t: 'Reddit Video Downloader — Mit Audio Kostenlos 2026', d: 'Reddit Videos mit Audio in HD herunterladen.' },
    pinterest: { t: 'Pinterest Video Downloader — Kostenlos HD 2026', d: 'Pinterest Videos und Pins kostenlos in HD herunterladen.' },
    twitch: { t: 'Twitch Clip Downloader — Kostenlos HD 2026', d: 'Twitch Clips und VODs kostenlos in HD herunterladen.' },
  },
  pt: {
    tiktok: { t: "Baixar Vídeos TikTok — Sem Marca D'Água, HD Grátis 2026", d: "Baixe vídeos do TikTok sem marca d'água grátis em HD." },
    youtube: { t: 'Baixar Vídeos YouTube — MP4 e MP3 Grátis 2026', d: 'Baixe vídeos do YouTube grátis em HD.' },
    reddit: { t: 'Baixar Vídeos Reddit — Com Áudio Grátis 2026', d: 'Baixe vídeos do Reddit com áudio em HD.' },
    pinterest: { t: 'Baixar Vídeos Pinterest — HD Grátis 2026', d: 'Baixe vídeos e pins do Pinterest em HD.' },
    twitch: { t: 'Baixar Clips Twitch — HD Grátis 2026', d: 'Baixe clips e VODs do Twitch em HD.' },
  },
  ar: {
    tiktok: { t: 'تحميل فيديوهات TikTok — بدون علامة مائية، HD مجاناً 2026', d: 'حمّل فيديوهات TikTok بدون علامة مائية مجاناً بجودة عالية.' },
    youtube: { t: 'تحميل فيديوهات YouTube — MP4 و MP3 مجاناً 2026', d: 'حمّل فيديوهات YouTube مجاناً بجودة عالية.' },
    reddit: { t: 'تحميل فيديوهات Reddit — مع الصوت مجاناً 2026', d: 'حمّل فيديوهات Reddit مع الصوت بجودة عالية.' },
    pinterest: { t: 'تحميل فيديوهات Pinterest — HD مجاناً 2026', d: 'حمّل فيديوهات Pinterest بجودة عالية مجاناً.' },
    twitch: { t: 'تحميل كليبات Twitch — HD مجاناً 2026', d: 'حمّل كليبات Twitch و VODs بجودة عالية.' },
  },
  ja: {
    tiktok: { t: 'TikTok動画ダウンローダー — 透かしなし、無料HD 2026', d: 'TikTok動画を透かしなしで無料ダウンロード。HD画質でMP4またはMP3に保存。' },
    youtube: { t: 'YouTube動画ダウンローダー — 無料MP4 & MP3 2026', d: 'YouTube動画を無料でHDダウンロード。' },
    reddit: { t: 'Reddit動画ダウンローダー — 音声付き無料 2026', d: 'Reddit動画を音声付きでHDダウンロード。' },
    pinterest: { t: 'Pinterest動画ダウンローダー — 無料HD 2026', d: 'Pinterest動画とピンを無料でHDダウンロード。' },
    twitch: { t: 'Twitchクリップダウンローダー — 無料HD 2026', d: 'TwitchクリップとVODを無料でHDダウンロード。' },
  },
  ko: {
    tiktok: { t: 'TikTok 비디오 다운로더 — 워터마크 없이, 무료 HD 2026', d: 'TikTok 비디오를 워터마크 없이 무료로 HD 다운로드.' },
    youtube: { t: 'YouTube 비디오 다운로더 — 무료 MP4 & MP3 2026', d: 'YouTube 비디오를 무료로 HD 다운로드.' },
    reddit: { t: 'Reddit 비디오 다운로더 — 오디오 포함 무료 2026', d: 'Reddit 비디오를 오디오와 함께 HD 다운로드.' },
    pinterest: { t: 'Pinterest 비디오 다운로더 — 무료 HD 2026', d: 'Pinterest 비디오와 핀을 무료로 HD 다운로드.' },
    twitch: { t: 'Twitch 클립 다운로더 — 무료 HD 2026', d: 'Twitch 클립과 VOD를 무료로 HD 다운로드.' },
  },
  zh: {
    tiktok: { t: 'TikTok视频下载器 — 无水印、免费高清 2026', d: '免费下载TikTok视频，无水印。高清MP4或MP3格式保存。' },
    youtube: { t: 'YouTube视频下载器 — 免费MP4和MP3 2026', d: '免费下载YouTube视频，高清质量。' },
    reddit: { t: 'Reddit视频下载器 — 含音频免费 2026', d: '下载Reddit视频含音频，高清质量。' },
    pinterest: { t: 'Pinterest视频下载器 — 免费高清 2026', d: '免费下载Pinterest视频和图钉，高清质量。' },
    twitch: { t: 'Twitch剪辑下载器 — 免费高清 2026', d: '免费下载Twitch剪辑和VOD，高清质量。' },
  },
  ru: {
    tiktok: { t: 'Скачать видео TikTok — Без водяного знака, бесплатно HD 2026', d: 'Скачивайте видео TikTok без водяного знака бесплатно в HD.' },
    youtube: { t: 'Скачать видео YouTube — Бесплатно MP4 и MP3 2026', d: 'Скачивайте видео YouTube бесплатно в HD качестве.' },
    reddit: { t: 'Скачать видео Reddit — Со звуком бесплатно 2026', d: 'Скачивайте видео Reddit со звуком в HD качестве.' },
    pinterest: { t: 'Скачать видео Pinterest — Бесплатно HD 2026', d: 'Скачивайте видео Pinterest в HD качестве бесплатно.' },
    twitch: { t: 'Скачать клипы Twitch — Бесплатно HD 2026', d: 'Скачивайте клипы Twitch и VOD в HD качестве.' },
    vk: { t: 'Скачать видео из ВК — Вконтакте бесплатно HD 2026', d: 'Скачивайте видео из ВК (Вконтакте) бесплатно в HD качестве MP4.' },
    ok: { t: 'Скачать видео с Одноклассников — OK.ru бесплатно 2026', d: 'Загружайте видео из Одноклассников по ссылке. Быстрое сохранение в MP4.' },
    rutube: { t: 'Скачать видео с Рутуба — Rutube бесплатно HD 2026', d: 'Скачивайте видео с Rutube в HD качестве бесплатно.' },
  },
};

// ── Static pages ───────────────────────────────────────────────────
const STATIC = {
  '/': { t: 'Free Video Downloader – Save Videos from YouTube, TikTok & 25+ Sites', d: 'Download videos and audio from 25+ platforms including YouTube, TikTok, Reddit, Vimeo, Twitch and more. Fast, free, no watermark.' },
  '/video-downloader': { t: 'Video Downloader — Download Videos From 25+ Platforms Free', d: 'Free video downloader for 25+ platforms including TikTok, Reddit, Vimeo, Twitch and more. HD quality, no watermark, no login required.' },
  '/audio-downloader': { t: 'Audio Downloader — Download Music & Audio Free', d: 'Free audio downloader — download music and audio from Bandcamp and more. High quality MP3 downloads, no login required.' },
  '/watermark-free-downloader': { t: 'Watermark-Free Video Downloader — Download Without Watermark 2026', d: 'Download TikTok and other videos without watermark. Free watermark-free video downloader in HD quality.' },
  '/about': { t: 'About SocialMediaVideoDownload', d: 'Learn about SocialMediaVideoDownload.com — your free tool to download videos and audio from 25+ social media platforms.' },
  '/privacy': { t: 'Privacy Policy', d: 'Privacy policy for SocialMediaVideoDownload.com.' },
  '/terms': { t: 'Terms of Service', d: 'Terms of service for SocialMediaVideoDownload.com.' },
  '/contact': { t: 'Contact Us', d: 'Contact the SocialMediaVideoDownload.com team.' },
  '/blog': { t: 'Blog — Video Download Tips & Guides', d: 'Tips, guides and how-to articles about downloading videos from social media platforms.' },
  '/sitemap': { t: 'Sitemap', d: 'Complete sitemap of SocialMediaVideoDownload.com.' },
};

// ── Helpers ────────────────────────────────────────────────────────

function resolveMeta(pathname) {
  const path = pathname.replace(/\/$/, '') || '/';

  // Static pages
  if (STATIC[path]) return { meta: STATIC[path], lang: 'en' };

  // /:lang/download/:slug  or  /download/:slug
  let m = path.match(/^(?:\/([a-z]{2}))?\/download\/([a-z0-9-]+)$/);
  if (m) {
    const lang = m[1] || 'en';
    const slug = m[2];
    const localized = L[lang]?.[slug];
    if (localized) return { meta: localized, lang };
    if (P[slug]) return { meta: P[slug], lang };
  }

  // /:lang/audio/:slug  or  /audio/:slug
  m = path.match(/^(?:\/([a-z]{2}))?\/audio\/([a-z0-9-]+)$/);
  if (m) {
    const lang = m[1] || 'en';
    const slug = m[2];
    const localized = L[lang]?.[slug];
    if (localized) return { meta: localized, lang };
    if (P[slug]) return { meta: P[slug], lang };
  }

  return null;
}

function buildHTML({ meta, lang }, canonical) {
  const fullTitle = `${meta.t} | ${SITE_NAME}`;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${fullTitle}</title>
<meta name="description" content="${meta.d}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${meta.d}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${CANONICAL_BASE}/og-image.png">
<meta property="og:site_name" content="${SITE_NAME}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${fullTitle}">
<meta name="twitter:description" content="${meta.d}">
<meta name="twitter:image" content="${CANONICAL_BASE}/og-image.png">
<meta name="robots" content="index, follow">
</head>
<body>
<h1>${meta.t}</h1>
<p>${meta.d}</p>
<p><a href="${canonical}">Visit ${SITE_NAME}</a></p>
<script>window.location.replace(window.location.href);</script>
</body>
</html>`;
}

// ── Main handler ───────────────────────────────────────────────────

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ua = request.headers.get('user-agent') || '';

    // Only intercept for bots on known SEO routes
    if (BOT_UA.test(ua)) {
      const resolved = resolveMeta(url.pathname);
      if (resolved) {
        const canonical = CANONICAL_BASE + (url.pathname.replace(/\/$/, '') || '/');
        const html = buildHTML(resolved, canonical);
        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            'X-Robots-Tag': 'index, follow',
          },
        });
      }
    }

    // Pass through to origin for real users (and bots on unknown routes)
    const originUrl = new URL(url.pathname + url.search, ORIGIN);
    const originReq = new Request(originUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow',
    });
    return fetch(originReq);
  },
};
