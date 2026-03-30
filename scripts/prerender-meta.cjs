/**
 * Post-build script: generates static HTML files for each route
 * with correct <title> and <meta description> so crawlers see
 * proper content before JS hydrates.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
const SITE = 'https://socialmediavideodownload.com';

// ── Platform data (mirrored from src/data) ──────────────────────
const VIDEO_PLATFORMS = [
  { id:'tiktok', name:'TikTok', slug:'tiktok', cat:'video', wm:true },
  { id:'youtube', name:'YouTube', slug:'youtube', cat:'video', wm:false },
  { id:'reddit', name:'Reddit', slug:'reddit', cat:'video', wm:false },
  { id:'pinterest', name:'Pinterest', slug:'pinterest', cat:'video', wm:false },
  { id:'bilibili', name:'Bilibili', slug:'bilibili', cat:'video', wm:false },
  { id:'vimeo', name:'Vimeo', slug:'vimeo', cat:'video', wm:false },
  { id:'dailymotion', name:'Dailymotion', slug:'dailymotion', cat:'video', wm:false },
  { id:'tumblr', name:'Tumblr', slug:'tumblr', cat:'video', wm:false },
  { id:'twitch', name:'Twitch', slug:'twitch', cat:'video', wm:false },
  { id:'vk', name:'VK', slug:'vk', cat:'video', wm:false },
  { id:'ok', name:'OK.ru', slug:'ok', cat:'video', wm:false },
  { id:'rutube', name:'RuTube', slug:'rutube', cat:'video', wm:false },
  { id:'9gag', name:'9GAG', slug:'9gag', cat:'video', wm:false },
  { id:'ted', name:'TED', slug:'ted', cat:'video', wm:false },
  { id:'imgur', name:'Imgur', slug:'imgur', cat:'video', wm:false },
  { id:'streamable', name:'Streamable', slug:'streamable', cat:'video', wm:false },
  { id:'bitchute', name:'BitChute', slug:'bitchute', cat:'video', wm:false },
  { id:'coub', name:'Coub', slug:'coub', cat:'video', wm:false },
  { id:'likee', name:'Likee', slug:'likee', cat:'video', wm:false },
  { id:'sharechat', name:'ShareChat', slug:'sharechat', cat:'video', wm:false },
  { id:'espn', name:'ESPN', slug:'espn', cat:'video', wm:false },
  { id:'lemon8', name:'Lemon8', slug:'lemon8', cat:'video', wm:false },
  { id:'ifunny', name:'iFunny', slug:'ifunny', cat:'video', wm:false },
  { id:'weibo', name:'Weibo', slug:'weibo', cat:'video', wm:false },
];

const AUDIO_PLATFORMS = [
  { id:'bandcamp', name:'Bandcamp', slug:'bandcamp', cat:'audio' },
];

const LANGS = ['en','hi','es','fr','de','pt','ar','ja','ko','zh','ru','id','tr','it','nl','th','vi','pl','sv','da'];

// SEO titles/descriptions from keywords.ts (subset for key platforms)
const SEO_DATA = {
  tiktok: { title: 'TikTok Video Downloader — No Watermark, Free HD 2025', desc: 'Download TikTok videos without watermark free. Best TikTok downloader online — save TikTok to MP4 or MP3 in HD. No login, no app. Works on iPhone & Android.' },
  youtube: { title: 'YouTube Video Downloader — Free MP4 & MP3 Download Online 2025', desc: 'Free YouTube video downloader — save YouTube videos as MP4 or convert to MP3. Download YouTube Shorts, HD videos online. No software needed.' },
  reddit: { title: 'Reddit Video Downloader — Download Reddit Videos With Audio 2025', desc: 'Download Reddit videos with audio merged. Free Reddit video downloader — save any Reddit video post in HD quality. No login required.' },
  bilibili: { title: 'Bilibili Video Downloader — Download Bilibili Videos Free 2025', desc: 'Download Bilibili videos for international users. Free Bilibili video downloader in HD quality. No account needed.' },
  vimeo: { title: 'Vimeo Video Downloader — Download Vimeo Videos Free HD 2025', desc: 'Download public Vimeo videos for free in HD. Multiple quality options available. No Vimeo account needed.' },
  twitch: { title: 'Twitch Clip Downloader — Download Twitch Clips & VODs Free 2025', desc: 'Download Twitch clips and VODs. Save your favorite Twitch moments in HD quality. Free, no login required.' },
  pinterest: { title: 'Pinterest Video Downloader — Download Video Pins Free HD 2025', desc: 'Download Pinterest videos and video pins. Save video pins in HD quality to your device. Free, no login required.' },
};

// ── Helpers ──────────────────────────────────────────────────────
function getTitle(platform) {
  if (SEO_DATA[platform.id]) return SEO_DATA[platform.id].title;
  const type = platform.cat === 'audio' ? 'Audio' : 'Video';
  return `${platform.name} ${type} Downloader — Free HD Download 2025`;
}

function getDesc(platform) {
  if (SEO_DATA[platform.id]) return SEO_DATA[platform.id].desc;
  const type = platform.cat === 'audio' ? 'audio' : 'videos';
  return `Download ${platform.name} ${type} for free in HD quality. No login required. Works on iPhone, Android and PC.`;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function writeRoute(template, routePath, title, description, canonical) {
  let html = template;
  // Replace title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escHtml(title)} | SocialMediaVideoDownload.com</title>`);
  // Replace meta description
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escHtml(description)}">`);
  // Replace OG tags
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escHtml(title)}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${escHtml(description)}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${escHtml(title)}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${escHtml(description)}"`);
  // Add canonical
  if (!html.includes('<link rel="canonical"')) {
    html = html.replace('</head>', `  <link rel="canonical" href="${canonical}" />\n</head>`);
  }

  const dir = path.join(DIST, routePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// ── Main ────────────────────────────────────────────────────────
function main() {
  const templatePath = path.join(DIST, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found. Run build first.');
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf-8');
  let count = 0;

  // Static pages
  const staticPages = [
    { path: 'video-downloader', title: 'Video Downloader — Download Videos From 25+ Platforms Free', desc: 'Free video downloader for 25+ platforms including TikTok, Reddit, Vimeo, Twitch and more. HD quality, no watermark, no login required.' },
    { path: 'audio-downloader', title: 'Audio Downloader — Download Music & Audio Free', desc: 'Free audio downloader — download music and audio from Bandcamp and more. High quality MP3 downloads, no login required.' },
    { path: 'watermark-free-downloader', title: 'Watermark-Free Video Downloader — Download Without Watermark 2025', desc: 'Download TikTok and other videos without watermark. Free watermark-free video downloader in HD quality.' },
    { path: 'about', title: 'About SocialMediaVideoDownload', desc: 'Learn about SocialMediaVideoDownload.com — your free tool to download videos and audio from 25+ social media platforms.' },
    { path: 'privacy', title: 'Privacy Policy', desc: 'Privacy policy for SocialMediaVideoDownload.com. Learn how we handle your data.' },
    { path: 'terms', title: 'Terms of Service', desc: 'Terms of service for SocialMediaVideoDownload.com.' },
    { path: 'contact', title: 'Contact Us', desc: 'Contact the SocialMediaVideoDownload.com team.' },
    { path: 'blog', title: 'Blog — Video Download Tips & Guides', desc: 'Tips, guides and how-to articles about downloading videos from social media platforms.' },
    { path: 'sitemap', title: 'Sitemap', desc: 'Complete sitemap of SocialMediaVideoDownload.com.' },
  ];

  for (const p of staticPages) {
    writeRoute(template, p.path, p.title, p.desc, `${SITE}/${p.path}`);
    count++;
  }

  // Video platform pages: /download/:slug
  for (const p of VIDEO_PLATFORMS) {
    const title = getTitle(p);
    const desc = getDesc(p);
    writeRoute(template, `download/${p.slug}`, title, desc, `${SITE}/download/${p.slug}`);
    count++;
  }

  // Audio platform pages: /audio/:slug
  for (const p of AUDIO_PLATFORMS) {
    const title = getTitle(p);
    const desc = getDesc(p);
    writeRoute(template, `audio/${p.slug}`, title, desc, `${SITE}/audio/${p.slug}`);
    count++;
  }

  // pSEO language variants: /:lang/download/:slug and /:lang/audio/:slug
  for (const lang of LANGS) {
    for (const p of VIDEO_PLATFORMS) {
      const title = getTitle(p);
      const desc = getDesc(p);
      writeRoute(template, `${lang}/download/${p.slug}`, title, desc, `${SITE}/${lang}/download/${p.slug}`);
      count++;
    }
    for (const p of AUDIO_PLATFORMS) {
      const title = getTitle(p);
      const desc = getDesc(p);
      writeRoute(template, `${lang}/audio/${p.slug}`, title, desc, `${SITE}/${lang}/audio/${p.slug}`);
      count++;
    }
  }

  // Region pages
  const regions = [
    { path: 'download/china', title: 'Download Chinese Platform Videos — Bilibili, Weibo & More', desc: 'Download videos from Chinese platforms including Bilibili and Weibo. Free HD downloader.' },
    { path: 'download/india', title: 'Download Indian Platform Videos — ShareChat & More', desc: 'Download videos from Indian social media platforms. Free HD video downloader.' },
    { path: 'download/russia', title: 'Download Russian Platform Videos — VK, OK.ru, RuTube', desc: 'Download videos from Russian platforms including VK, OK.ru, and RuTube. Free HD downloader.' },
  ];

  for (const r of regions) {
    writeRoute(template, r.path, r.title, r.desc, `${SITE}/${r.path}`);
    count++;
  }

  console.log(`✅ Pre-rendered ${count} HTML files with correct meta tags.`);
}

main();
