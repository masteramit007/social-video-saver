export interface PlatformInfo {
  id: string;
  name: string;
  color: string;
  regex: RegExp;
  description: string;
  category: 'video' | 'audio' | 'social';
  howTo: string[];
  features: string[];
  faq: { q: string; a: string }[];
}

// ─── VIDEO & SOCIAL PLATFORMS ────────────────────────────────────────────────

export const platforms: PlatformInfo[] = [
  // ── Watermark-free downloads ──
  {
    id: 'tiktok', name: 'TikTok', color: '#ff0050', category: 'video',
    regex: /tiktok\.com/,
    description: 'Download TikTok videos without watermark in HD quality. Save any TikTok to your device instantly.',
    howTo: ['Open TikTok app and find the video', 'Tap Share → Copy Link', 'Paste the link above and click Download', 'Choose quality and save'],
    features: ['Removes TikTok watermark automatically', 'Original audio preserved', 'HD quality up to 1080p', 'Download TikTok Stories'],
    faq: [
      { q: 'Can I download TikTok without watermark?', a: 'Yes! Our tool automatically removes the TikTok watermark and delivers a clean HD video.' },
      { q: 'Can I download TikTok audio only?', a: 'Yes, we provide MP3 download option for extracting audio from TikTok videos.' },
      { q: 'Do private TikTok videos work?', a: 'No, only publicly available TikTok videos can be downloaded.' },
      { q: 'Is the video quality the same as original?', a: 'Yes, we provide the original quality as uploaded by the creator.' },
      { q: 'Can I download TikTok slideshows?', a: 'Yes, slideshow videos are downloaded as regular video files.' },
    ],
  },
  {
    id: 'douyin', name: 'Douyin', color: '#161823', category: 'video',
    regex: /douyin\.com/,
    description: 'Download Douyin (Chinese TikTok) videos without watermark in HD. Save Douyin clips instantly.',
    howTo: ['Open Douyin and find the video', 'Tap Share → Copy Link', 'Paste the link and click Download', 'Save watermark-free video'],
    features: ['Watermark-free downloads', 'HD quality', 'Fast extraction', 'No account needed'],
    faq: [
      { q: 'Is Douyin the same as TikTok?', a: 'Douyin is the Chinese version of TikTok. Both are supported separately.' },
      { q: 'Can I download without watermark?', a: 'Yes, watermarks are automatically removed.' },
      { q: 'Do I need a Douyin account?', a: 'No, only public videos can be downloaded without an account.' },
    ],
  },
  {
    id: 'capcut', name: 'CapCut', color: '#00e5ff', category: 'video',
    regex: /capcut\.com/,
    description: 'Download CapCut template videos and creations. Save shared CapCut videos to your device.',
    howTo: ['Open the CapCut shared link', 'Copy the URL', 'Paste here and click Download', 'Save the video'],
    features: ['Template video downloads', 'HD quality', 'Watermark-free', 'Fast extraction'],
    faq: [
      { q: 'Can I download CapCut templates?', a: 'Yes, shared CapCut template videos can be downloaded.' },
      { q: 'Is the watermark removed?', a: 'Yes, CapCut watermarks are removed automatically.' },
    ],
  },
  {
    id: 'xiaohongshu', name: 'Xiaohongshu', color: '#fe2c55', category: 'video',
    regex: /xiaohongshu\.com|xhslink\.com/,
    description: 'Download Xiaohongshu (RED) videos without watermark. Save Little Red Book content in HD.',
    howTo: ['Open the Xiaohongshu post', 'Copy the share link', 'Paste and click Download', 'Save the video'],
    features: ['Watermark-free', 'HD quality', 'Fast downloads', 'No login required'],
    faq: [
      { q: 'What is Xiaohongshu?', a: 'Xiaohongshu (Little Red Book / RED) is a popular Chinese social media platform.' },
      { q: 'Can I download images too?', a: 'This tool focuses on video downloads from Xiaohongshu.' },
    ],
  },

  // ── Major social/video platforms ──
  {
    id: 'instagram', name: 'Instagram', color: '#e1306c', category: 'video',
    regex: /instagram\.com/,
    description: 'Download Instagram Reels, Stories, and IGTV videos in HD. Save any Instagram video to your device.',
    howTo: ['Open Instagram and find the Reel or video', 'Tap ⋯ → Copy Link', 'Paste the link above and click Download', 'Save the video'],
    features: ['Download Reels in HD', 'Save Instagram Stories', 'IGTV video support', 'Multiple quality options'],
    faq: [
      { q: 'Can I download Instagram Reels?', a: 'Yes! Paste any Instagram Reel URL to download it in HD quality.' },
      { q: 'Can I download Instagram Stories?', a: 'Yes, public Stories can be downloaded using the story URL.' },
      { q: 'Do private accounts work?', a: 'No, only content from public accounts can be downloaded.' },
      { q: 'What about Instagram carousels?', a: 'Video carousels are supported. Each video slide can be downloaded separately.' },
      { q: 'Is there a limit on downloads?', a: 'We have a fair use limit of 15 downloads per minute to prevent abuse.' },
    ],
  },
  {
    id: 'twitter', name: 'Twitter / X', color: '#1da1f2', category: 'video',
    regex: /twitter\.com|x\.com/,
    description: 'Download Twitter/X videos and GIFs in HD. Save any tweet video to your device.',
    howTo: ['Find the tweet with the video', 'Click Share → Copy Link', 'Paste the link and click Download', 'Choose quality and save'],
    features: ['Download tweet videos in HD', 'Save Twitter GIFs as MP4', 'Multiple quality options', 'Works with X.com links'],
    faq: [
      { q: 'Can I download Twitter GIFs?', a: 'Yes! Twitter GIFs are actually MP4 videos and can be downloaded directly.' },
      { q: 'Does it work with X.com links?', a: 'Yes, both twitter.com and x.com links are fully supported.' },
      { q: 'What quality options are available?', a: 'Twitter typically offers 480p and 720p quality options.' },
    ],
  },
  {
    id: 'facebook', name: 'Facebook', color: '#1877f2', category: 'video',
    regex: /facebook\.com|fb\.watch/,
    description: 'Download Facebook videos in HD quality. Save videos from public Facebook posts and pages.',
    howTo: ['Find the video on Facebook', 'Right-click → Copy video URL', 'Paste the URL and click Download', 'Save to your device'],
    features: ['Public video downloads', 'HD quality support', 'fb.watch short links supported', 'Download from Pages and Groups'],
    faq: [
      { q: 'Can I download private Facebook videos?', a: 'No, only publicly shared videos can be downloaded.' },
      { q: 'Do Facebook Reels work?', a: 'Yes, Facebook Reels can be downloaded using the share link.' },
      { q: 'Can I use fb.watch links?', a: 'Yes, both full Facebook URLs and fb.watch short links work.' },
    ],
  },
  {
    id: 'youtube', name: 'YouTube', color: '#ff0000', category: 'video',
    regex: /youtube\.com|youtu\.be/,
    description: 'YouTube video downloading requires a browser extension due to technical restrictions.',
    howTo: ['Install Video DownloadHelper extension', 'Navigate to the YouTube video', 'Click the extension icon', 'Choose quality and download'],
    features: ['Extension Required', 'Video DownloadHelper recommended', 'Works on Chrome and Firefox', 'Supports all YouTube formats'],
    faq: [
      { q: 'Why can\'t you download YouTube videos?', a: 'YouTube actively blocks server-side downloading. Browser extensions work directly in your browser to bypass this.' },
      { q: 'Is Video DownloadHelper safe?', a: 'Yes, it\'s a well-known, trusted extension available on Chrome Web Store and Firefox Add-ons.' },
      { q: 'Is downloading YouTube videos legal?', a: 'Downloading for personal use may be allowed but violates YouTube ToS. Use at your own discretion.' },
    ],
  },
  {
    id: 'pinterest', name: 'Pinterest', color: '#e60023', category: 'video',
    regex: /pinterest\.com/,
    description: 'Download Pinterest videos and pins. Save video pins in HD quality to your device.',
    howTo: ['Find the video pin on Pinterest', 'Click Share → Copy Link', 'Paste the URL and click Download', 'Save the video'],
    features: ['Video pin downloads', 'HD quality', 'Fast and free', 'No login required'],
    faq: [
      { q: 'Can I download Pinterest images?', a: 'This tool is for videos. For images, right-click and save directly.' },
      { q: 'Do Story Pins work?', a: 'Video Story Pins can be downloaded if publicly available.' },
    ],
  },
  {
    id: 'linkedin', name: 'LinkedIn', color: '#0a66c2', category: 'video',
    regex: /linkedin\.com/,
    description: 'Download LinkedIn videos from posts and articles. Save professional content in HD.',
    howTo: ['Find the LinkedIn post with video', 'Copy the post URL', 'Paste and click Download', 'Save the video'],
    features: ['Post video downloads', 'HD quality', 'Professional content', 'No login required'],
    faq: [
      { q: 'Can I download LinkedIn Learning videos?', a: 'No, only public post videos are supported.' },
      { q: 'Do I need a LinkedIn account?', a: 'No account is needed for public post videos.' },
    ],
  },
  {
    id: 'reddit', name: 'Reddit', color: '#ff4500', category: 'video',
    regex: /reddit\.com/,
    description: 'Download Reddit videos with audio merged. Save any Reddit video post in HD.',
    howTo: ['Find the Reddit post with a video', 'Copy the post URL', 'Paste and click Download', 'Save with audio included'],
    features: ['Audio and video merged', 'HD quality', 'Works with all subreddits', 'No Reddit account needed'],
    faq: [
      { q: 'Why do Reddit videos have no audio?', a: 'Reddit stores audio and video separately. Our tool merges them for you.' },
      { q: 'Can I download Reddit GIFs?', a: 'Yes, Reddit GIFs (which are actually videos) can be downloaded.' },
    ],
  },
  {
    id: 'tumblr', name: 'Tumblr', color: '#35465c', category: 'video',
    regex: /tumblr\.com/,
    description: 'Download Tumblr videos from posts. Save Tumblr video content in HD quality.',
    howTo: ['Open the Tumblr post with video', 'Copy the post URL', 'Paste and click Download', 'Save the video'],
    features: ['Post video downloads', 'HD quality', 'Fast extraction', 'No account needed'],
    faq: [
      { q: 'Can I download Tumblr GIFs?', a: 'Video posts are supported. GIFs can be saved directly from the browser.' },
    ],
  },
  {
    id: 'threads', name: 'Threads', color: '#000000', category: 'video',
    regex: /threads\.net/,
    description: 'Download Threads videos by Meta. Save video posts from Threads in HD quality.',
    howTo: ['Open the Threads post', 'Copy the post link', 'Paste and click Download', 'Save the video'],
    features: ['Video post downloads', 'HD quality', 'Fast and free', 'No login needed'],
    faq: [
      { q: 'Is Threads downloading supported?', a: 'Yes, public video posts from Threads can be downloaded.' },
    ],
  },
  {
    id: 'bluesky', name: 'Bluesky', color: '#0085ff', category: 'social',
    regex: /bsky\.app|bsky\.social/,
    description: 'Download Bluesky videos from posts. Save Bluesky video content to your device.',
    howTo: ['Find the Bluesky post with video', 'Copy the post URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'Fast extraction', 'No account needed'],
    faq: [
      { q: 'Can I download from Bluesky?', a: 'Yes, public video posts on Bluesky are supported.' },
    ],
  },
  {
    id: 'snapchat', name: 'Snapchat', color: '#fffc00', category: 'video',
    regex: /snapchat\.com/,
    description: 'Download Snapchat Spotlight and public story videos. Save Snapchat content to your device.',
    howTo: ['Open the Snapchat Spotlight or public story', 'Copy the share link', 'Paste and click Download', 'Save the video'],
    features: ['Spotlight video downloads', 'Public stories supported', 'HD quality', 'Fast extraction'],
    faq: [
      { q: 'Can I download private snaps?', a: 'No, only publicly shared Spotlight and story content can be downloaded.' },
      { q: 'Do disappearing messages work?', a: 'No, only publicly accessible content is supported.' },
    ],
  },
  {
    id: 'vimeo', name: 'Vimeo', color: '#1ab7ea', category: 'video',
    regex: /vimeo\.com/,
    description: 'Download Vimeo videos for free in HD. Save any public Vimeo video to your device.',
    howTo: ['Open the Vimeo video page', 'Copy the URL', 'Paste here and click Download', 'Choose quality and save'],
    features: ['HD quality up to 1080p', 'Multiple format options', 'Fast direct downloads', 'No Vimeo account needed'],
    faq: [
      { q: 'Can I download private Vimeo videos?', a: 'No, only publicly accessible Vimeo videos can be downloaded.' },
      { q: 'What about password-protected videos?', a: 'Password-protected videos are not supported.' },
    ],
  },
  {
    id: 'bilibili', name: 'Bilibili', color: '#fb7299', category: 'video',
    regex: /bilibili\.com/,
    description: 'Download Bilibili videos for international users. Save any Bilibili video in HD quality.',
    howTo: ['Open the Bilibili video page', 'Copy the URL from your browser address bar', 'Paste the URL and click Download', 'Save the video file'],
    features: ['International access supported', 'HD quality downloads', 'No Bilibili account needed', 'Fast CDN delivery'],
    faq: [
      { q: 'Can I download Bilibili videos outside China?', a: 'Yes! Our tool works internationally for publicly available Bilibili videos.' },
      { q: 'Do I need a Bilibili account?', a: 'No account is needed to download public videos.' },
    ],
  },
  {
    id: 'dailymotion', name: 'Dailymotion', color: '#0066dc', category: 'video',
    regex: /dailymotion\.com/,
    description: 'Download Dailymotion videos in multiple qualities. Free and fast Dailymotion video downloader.',
    howTo: ['Open the Dailymotion video', 'Copy the video URL', 'Paste here and click Download', 'Choose quality and save'],
    features: ['Multiple quality options', 'Fast downloads', 'No registration needed', 'Direct CDN links'],
    faq: [
      { q: 'What qualities are available?', a: 'Dailymotion videos are typically available in 480p and 720p.' },
    ],
  },
  {
    id: 'rumble', name: 'Rumble', color: '#85c742', category: 'video',
    regex: /rumble\.com/,
    description: 'Download Rumble videos for free in HD quality. Fast and reliable Rumble video downloader.',
    howTo: ['Open the Rumble video page', 'Copy the URL from your browser', 'Paste the link and click Download', 'Save the video'],
    features: ['HD quality downloads', 'Fast extraction', 'No account needed', 'Free to use'],
    faq: [
      { q: 'Do live streams work?', a: 'Only completed/archived videos can be downloaded, not live streams.' },
    ],
  },

  // ── Streaming & live platforms ──
  {
    id: 'twitch', name: 'Twitch', color: '#9146ff', category: 'video',
    regex: /twitch\.tv/,
    description: 'Download Twitch clips and VODs. Save your favorite Twitch moments in HD.',
    howTo: ['Open the Twitch clip or VOD', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Clip downloads', 'VOD support', 'HD quality', 'Fast extraction'],
    faq: [
      { q: 'Can I download live streams?', a: 'Only clips and completed VODs can be downloaded.' },
      { q: 'Do subscriber-only VODs work?', a: 'No, only publicly accessible content is supported.' },
    ],
  },
  {
    id: 'kick', name: 'Kick', color: '#53fc18', category: 'video',
    regex: /kick\.com/,
    description: 'Download Kick clips and VODs. Save Kick streaming content in HD quality.',
    howTo: ['Open the Kick clip', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Clip downloads', 'HD quality', 'Fast extraction', 'Free to use'],
    faq: [
      { q: 'Can I download Kick live streams?', a: 'Only clips and archived content can be downloaded.' },
    ],
  },
  {
    id: 'afreecatv', name: 'AfreecaTV', color: '#0056a6', category: 'video',
    regex: /afreecatv\.com/,
    description: 'Download AfreecaTV videos and clips. Save Korean streaming content in HD.',
    howTo: ['Open the AfreecaTV video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'Korean streaming platform', 'Fast extraction'],
    faq: [
      { q: 'What is AfreecaTV?', a: 'AfreecaTV is a popular Korean live streaming platform.' },
    ],
  },
  {
    id: 'chzzk', name: 'CHZZK', color: '#00e676', category: 'video',
    regex: /chzzk\.naver\.com/,
    description: 'Download CHZZK videos from Naver streaming platform. Save clips in HD quality.',
    howTo: ['Open the CHZZK clip', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Clip downloads', 'HD quality', 'Naver streaming', 'Fast extraction'],
    faq: [
      { q: 'What is CHZZK?', a: 'CHZZK is Naver\'s live streaming platform, popular in South Korea.' },
    ],
  },
  {
    id: 'dlive', name: 'DLive', color: '#ffd300', category: 'video',
    regex: /dlive\.tv/,
    description: 'Download DLive clips and past broadcasts. Save blockchain streaming content.',
    howTo: ['Open the DLive video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Clip downloads', 'HD quality', 'Blockchain streaming', 'Free to use'],
    faq: [
      { q: 'What is DLive?', a: 'DLive is a blockchain-based live streaming platform.' },
    ],
  },

  // ── Video hosting & sharing ──
  {
    id: 'streamable', name: 'Streamable', color: '#0a84ff', category: 'video',
    regex: /streamable\.com/,
    description: 'Download Streamable videos in HD. Save short video clips from Streamable.',
    howTo: ['Open the Streamable video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['HD quality', 'Fast downloads', 'Short video clips', 'No account needed'],
    faq: [
      { q: 'Is Streamable downloading free?', a: 'Yes, completely free for public videos.' },
    ],
  },
  {
    id: 'imgur', name: 'Imgur', color: '#1bb76e', category: 'video',
    regex: /imgur\.com/,
    description: 'Download Imgur videos and GIFs. Save Imgur video content to your device.',
    howTo: ['Open the Imgur post', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'GIF to MP4', 'Fast extraction', 'No login needed'],
    faq: [
      { q: 'Can I download Imgur GIFs?', a: 'Yes, Imgur GIFs are served as MP4 videos and can be downloaded.' },
    ],
  },
  {
    id: '9gag', name: '9GAG', color: '#000000', category: 'video',
    regex: /9gag\.com/,
    description: 'Download 9GAG videos and GIFs. Save funny 9GAG content to your device.',
    howTo: ['Open the 9GAG post', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'GIF support', 'Fast extraction', 'Free to use'],
    faq: [
      { q: 'Can I download 9GAG GIFs?', a: 'Yes, video GIFs from 9GAG can be downloaded.' },
    ],
  },
  {
    id: 'ifunny', name: 'iFunny', color: '#ffcc00', category: 'video',
    regex: /ifunny\.co/,
    description: 'Download iFunny videos. Save funny video content from iFunny to your device.',
    howTo: ['Open the iFunny post', 'Copy the link', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'Fast extraction', 'Free to use'],
    faq: [
      { q: 'Can I download iFunny content?', a: 'Yes, public video posts from iFunny are supported.' },
    ],
  },
  {
    id: 'coub', name: 'Coub', color: '#2e8ece', category: 'video',
    regex: /coub\.com/,
    description: 'Download Coub videos. Save looping video clips from Coub.',
    howTo: ['Open the Coub', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Loop video downloads', 'HD quality', 'Fast extraction', 'Free'],
    faq: [
      { q: 'What is Coub?', a: 'Coub is a platform for short looping videos with custom audio.' },
    ],
  },

  // ── Educational & media ──
  {
    id: 'ted', name: 'TED', color: '#e62b1e', category: 'video',
    regex: /ted\.com/,
    description: 'Download TED Talk videos. Save inspiring talks and presentations in HD.',
    howTo: ['Open the TED Talk page', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['TED Talk downloads', 'HD quality', 'Educational content', 'Subtitles available'],
    faq: [
      { q: 'Can I download TED Talks?', a: 'Yes, public TED Talk videos can be downloaded in HD.' },
    ],
  },
  {
    id: 'espn', name: 'ESPN', color: '#c8102e', category: 'video',
    regex: /espn\.com/,
    description: 'Download ESPN video clips. Save sports highlights and clips from ESPN.',
    howTo: ['Open the ESPN video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Sports clips', 'HD quality', 'Highlight downloads', 'Fast extraction'],
    faq: [
      { q: 'Can I download full ESPN games?', a: 'Only publicly available clips and highlights are supported.' },
    ],
  },
  {
    id: 'imdb', name: 'IMDb', color: '#f5c518', category: 'video',
    regex: /imdb\.com/,
    description: 'Download IMDb trailers and video clips. Save movie trailers from IMDb.',
    howTo: ['Open the IMDb video/trailer page', 'Copy the URL', 'Paste and click Download', 'Save the trailer'],
    features: ['Trailer downloads', 'HD quality', 'Movie clips', 'Fast extraction'],
    faq: [
      { q: 'Can I download full movies from IMDb?', a: 'No, only trailers and public clips are supported.' },
    ],
  },

  // ── Regional & international ──
  {
    id: 'vk', name: 'VK', color: '#4680c2', category: 'video',
    regex: /vk\.com|vkvideo\.ru/,
    description: 'Download VK videos. Save video content from VKontakte in HD quality.',
    howTo: ['Open the VK video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['HD quality', 'Fast downloads', 'Russian platform', 'No login needed'],
    faq: [
      { q: 'Do I need a VK account?', a: 'No, public videos can be downloaded without an account.' },
    ],
  },
  {
    id: 'okru', name: 'OK.ru', color: '#ee8208', category: 'video',
    regex: /ok\.ru/,
    description: 'Download OK.ru (Odnoklassniki) videos. Save videos from the Russian social network.',
    howTo: ['Open the OK.ru video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'Fast extraction', 'Free to use'],
    faq: [
      { q: 'What is OK.ru?', a: 'OK.ru (Odnoklassniki) is a popular Russian social network.' },
    ],
  },
  {
    id: 'rutube', name: 'RuTube', color: '#1d1d1d', category: 'video',
    regex: /rutube\.ru/,
    description: 'Download RuTube videos in HD. Save content from Russia\'s video platform.',
    howTo: ['Open the RuTube video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['HD quality', 'Fast extraction', 'Russian video platform', 'No account needed'],
    faq: [
      { q: 'What is RuTube?', a: 'RuTube is a Russian video hosting platform similar to YouTube.' },
    ],
  },
  {
    id: 'weibo', name: 'Weibo', color: '#e6162d', category: 'video',
    regex: /weibo\.com|weibo\.cn/,
    description: 'Download Weibo videos. Save video content from the Chinese social media platform.',
    howTo: ['Open the Weibo post with video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'Chinese platform', 'Fast extraction'],
    faq: [
      { q: 'What is Weibo?', a: 'Weibo is one of China\'s largest social media platforms, similar to Twitter.' },
    ],
  },
  {
    id: 'kuaishou', name: 'Kuaishou', color: '#ff4906', category: 'video',
    regex: /kuaishou\.com|kwai\.com/,
    description: 'Download Kuaishou videos. Save short video content from the Chinese platform.',
    howTo: ['Open the Kuaishou video', 'Copy the share link', 'Paste and click Download', 'Save the video'],
    features: ['Short video downloads', 'HD quality', 'Watermark-free', 'Fast extraction'],
    faq: [
      { q: 'What is Kuaishou?', a: 'Kuaishou (Kwai) is a popular Chinese short video platform.' },
    ],
  },
  {
    id: 'ixigua', name: 'Ixigua', color: '#ff6347', category: 'video',
    regex: /ixigua\.com/,
    description: 'Download Ixigua videos. Save content from ByteDance\'s video platform.',
    howTo: ['Open the Ixigua video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'ByteDance platform', 'Fast extraction'],
    faq: [
      { q: 'What is Ixigua?', a: 'Ixigua is a video platform owned by ByteDance (TikTok\'s parent company).' },
    ],
  },
  {
    id: 'qq', name: 'QQ Video', color: '#12b7f5', category: 'video',
    regex: /qq\.com/,
    description: 'Download QQ videos. Save video content from Tencent\'s QQ platform.',
    howTo: ['Open the QQ video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'Tencent platform', 'Fast extraction'],
    faq: [
      { q: 'What is QQ Video?', a: 'QQ Video is Tencent\'s video sharing platform popular in China.' },
    ],
  },
  {
    id: 'meipai', name: 'Meipai', color: '#ff4081', category: 'video',
    regex: /meipai\.com/,
    description: 'Download Meipai videos. Save short video content from the Chinese platform.',
    howTo: ['Open the Meipai video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Short video downloads', 'HD quality', 'Beauty filters preserved', 'Fast extraction'],
    faq: [
      { q: 'What is Meipai?', a: 'Meipai is a Chinese short video app known for beauty filters.' },
    ],
  },
  {
    id: 'sina', name: 'Sina Video', color: '#e6162d', category: 'video',
    regex: /video\.sina\.com/,
    description: 'Download Sina videos. Save content from Sina\'s video platform.',
    howTo: ['Open the Sina video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'Chinese media platform', 'Fast extraction'],
    faq: [
      { q: 'What is Sina Video?', a: 'Sina Video is a Chinese video platform operated by Sina Corporation.' },
    ],
  },
  {
    id: 'sohu', name: 'Sohu Video', color: '#f59b00', category: 'video',
    regex: /sohu\.com/,
    description: 'Download Sohu videos. Save content from the Chinese media platform.',
    howTo: ['Open the Sohu video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'Chinese media', 'Fast extraction'],
    faq: [
      { q: 'What is Sohu?', a: 'Sohu is a major Chinese internet portal with video content.' },
    ],
  },
  {
    id: 'hipi', name: 'Hipi', color: '#ff2d55', category: 'video',
    regex: /hipi\.co\.in/,
    description: 'Download Hipi videos without watermark. Save Indian short videos in HD.',
    howTo: ['Open the Hipi video', 'Copy the share link', 'Paste and click Download', 'Save the video'],
    features: ['Watermark-free', 'HD quality', 'Indian short videos', 'Fast extraction'],
    faq: [
      { q: 'What is Hipi?', a: 'Hipi is an Indian short video platform by ZEE5.' },
    ],
  },
  {
    id: 'sharechat', name: 'ShareChat', color: '#ffdd00', category: 'video',
    regex: /sharechat\.com/,
    description: 'Download ShareChat videos. Save Indian social media videos in HD quality.',
    howTo: ['Open the ShareChat video', 'Copy the share link', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'Indian platform', 'Multiple languages'],
    faq: [
      { q: 'What is ShareChat?', a: 'ShareChat is an Indian social media platform supporting multiple regional languages.' },
    ],
  },
  {
    id: 'likee', name: 'Likee', color: '#00e1ad', category: 'video',
    regex: /likee\.video|l\.likee\.video/,
    description: 'Download Likee videos. Save short video content from Likee in HD.',
    howTo: ['Open the Likee video', 'Copy the share link', 'Paste and click Download', 'Save the video'],
    features: ['Short video downloads', 'HD quality', 'Effects preserved', 'Fast extraction'],
    faq: [
      { q: 'What is Likee?', a: 'Likee is a short video creation and sharing platform with special effects.' },
    ],
  },
  {
    id: 'lemon8', name: 'Lemon8', color: '#ffe135', category: 'video',
    regex: /lemon8-app\.com/,
    description: 'Download Lemon8 videos. Save lifestyle content from ByteDance\'s platform.',
    howTo: ['Open the Lemon8 post', 'Copy the share link', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'Lifestyle content', 'ByteDance platform'],
    faq: [
      { q: 'What is Lemon8?', a: 'Lemon8 is a lifestyle content platform by ByteDance.' },
    ],
  },

  // ── Messaging & misc ──
  {
    id: 'telegram', name: 'Telegram', color: '#26a5e4', category: 'video',
    regex: /t\.me|telegram\.me/,
    description: 'Download Telegram public channel videos. Save video messages from public channels.',
    howTo: ['Open the Telegram public channel post', 'Copy the post link', 'Paste and click Download', 'Save the video'],
    features: ['Public channel videos', 'HD quality', 'Fast extraction', 'No login needed'],
    faq: [
      { q: 'Can I download private messages?', a: 'No, only videos from public Telegram channels are supported.' },
    ],
  },
  {
    id: 'bitchute', name: 'BitChute', color: '#ef4136', category: 'video',
    regex: /bitchute\.com/,
    description: 'Download BitChute videos. Save peer-to-peer video content in HD.',
    howTo: ['Open the BitChute video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'P2P platform', 'Free to use'],
    faq: [
      { q: 'What is BitChute?', a: 'BitChute is a peer-to-peer video sharing platform.' },
    ],
  },
  {
    id: 'dtube', name: 'DTube', color: '#e8425a', category: 'video',
    regex: /d\.tube/,
    description: 'Download DTube videos. Save decentralized video content from DTube.',
    howTo: ['Open the DTube video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Decentralized video', 'HD quality', 'Blockchain platform', 'Free to use'],
    faq: [
      { q: 'What is DTube?', a: 'DTube is a decentralized video platform built on blockchain.' },
    ],
  },
  {
    id: 'boxcast', name: 'BoxCast', color: '#1a73e8', category: 'video',
    regex: /boxcast\.tv/,
    description: 'Download BoxCast videos. Save live event recordings from BoxCast.',
    howTo: ['Open the BoxCast video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Event recordings', 'HD quality', 'Live event platform', 'Fast extraction'],
    faq: [
      { q: 'What is BoxCast?', a: 'BoxCast is a live streaming platform for events, churches, and organizations.' },
    ],
  },
  {
    id: 'izlesene', name: 'Izlesene', color: '#f7a800', category: 'video',
    regex: /izlesene\.com/,
    description: 'Download Izlesene videos. Save content from the Turkish video platform.',
    howTo: ['Open the Izlesene video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Video downloads', 'HD quality', 'Turkish platform', 'Fast extraction'],
    faq: [
      { q: 'What is Izlesene?', a: 'Izlesene is a Turkish video sharing platform.' },
    ],
  },
  {
    id: 'puhutv', name: 'PuhuTV', color: '#00b4d8', category: 'video',
    regex: /puhutv\.com/,
    description: 'Download PuhuTV videos. Save Turkish streaming content in HD.',
    howTo: ['Open the PuhuTV video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Turkish content', 'HD quality', 'Free streaming', 'Fast extraction'],
    faq: [
      { q: 'What is PuhuTV?', a: 'PuhuTV is a free Turkish streaming platform.' },
    ],
  },
  {
    id: 'febspot', name: 'Febspot', color: '#ff6b35', category: 'video',
    regex: /febspot\.com/,
    description: 'Download Febspot videos. Save viral video content from Febspot.',
    howTo: ['Open the Febspot video', 'Copy the URL', 'Paste and click Download', 'Save the video'],
    features: ['Viral videos', 'HD quality', 'Fast extraction', 'Free to use'],
    faq: [
      { q: 'What is Febspot?', a: 'Febspot is a viral video content platform.' },
    ],
  },
  {
    id: 'getstickerpack', name: 'GetStickerPack', color: '#25d366', category: 'video',
    regex: /getstickerpack\.com/,
    description: 'Download sticker packs and animated stickers as video from GetStickerPack.',
    howTo: ['Open the sticker pack page', 'Copy the URL', 'Paste and click Download', 'Save the content'],
    features: ['Animated stickers', 'Sticker packs', 'Fast extraction', 'Free to use'],
    faq: [
      { q: 'Can I download animated stickers?', a: 'Yes, animated stickers can be downloaded as video files.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ── AUDIO & PODCAST PLATFORMS ──
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'soundcloud', name: 'SoundCloud', color: '#ff5500', category: 'audio',
    regex: /soundcloud\.com/,
    description: 'Download SoundCloud tracks and playlists. Save music from SoundCloud in high quality MP3.',
    howTo: ['Open the SoundCloud track', 'Copy the URL from the address bar', 'Paste and click Download', 'Save the audio file'],
    features: ['MP3 downloads', 'High quality audio', 'Track & playlist support', 'Free to use'],
    faq: [
      { q: 'Can I download SoundCloud playlists?', a: 'Individual tracks from playlists can be downloaded.' },
      { q: 'What audio quality is available?', a: 'We provide the best available quality, typically 128kbps or 320kbps MP3.' },
      { q: 'Do private tracks work?', a: 'No, only publicly available tracks can be downloaded.' },
    ],
  },
  {
    id: 'spotify', name: 'Spotify', color: '#1db954', category: 'audio',
    regex: /open\.spotify\.com/,
    description: 'Download Spotify tracks and podcasts. Save Spotify audio content for offline listening.',
    howTo: ['Open Spotify and find the track', 'Click Share → Copy Link', 'Paste the link and click Download', 'Save the audio file'],
    features: ['Track downloads', 'Podcast support', 'High quality audio', 'Fast extraction'],
    faq: [
      { q: 'Can I download Spotify playlists?', a: 'Individual tracks can be downloaded one at a time.' },
      { q: 'What quality is available?', a: 'Audio quality depends on the source, typically up to 320kbps.' },
      { q: 'Is this legal?', a: 'Downloading for personal use. Respect artist rights and consider supporting creators.' },
    ],
  },
  {
    id: 'apple-music', name: 'Apple Music', color: '#fc3c44', category: 'audio',
    regex: /music\.apple\.com/,
    description: 'Download Apple Music tracks. Save songs from Apple Music for offline listening.',
    howTo: ['Open Apple Music and find the song', 'Click Share → Copy Link', 'Paste and click Download', 'Save the audio file'],
    features: ['Track downloads', 'High quality audio', 'Album support', 'Fast extraction'],
    faq: [
      { q: 'Can I download full albums?', a: 'Individual tracks can be downloaded one at a time.' },
    ],
  },
  {
    id: 'tidal', name: 'Tidal', color: '#000000', category: 'audio',
    regex: /tidal\.com|listen\.tidal\.com/,
    description: 'Download Tidal tracks. Save high-fidelity audio from Tidal.',
    howTo: ['Open Tidal and find the track', 'Copy the share link', 'Paste and click Download', 'Save the audio file'],
    features: ['Hi-Fi audio', 'Track downloads', 'High quality', 'Fast extraction'],
    faq: [
      { q: 'What quality is available?', a: 'Quality depends on the extraction, typically high bitrate audio.' },
    ],
  },
  {
    id: 'deezer', name: 'Deezer', color: '#a238ff', category: 'audio',
    regex: /deezer\.com/,
    description: 'Download Deezer tracks. Save music from Deezer for offline listening.',
    howTo: ['Open Deezer and find the track', 'Copy the share link', 'Paste and click Download', 'Save the audio file'],
    features: ['Track downloads', 'High quality audio', 'Fast extraction', 'Free to use'],
    faq: [
      { q: 'Can I download Deezer playlists?', a: 'Individual tracks can be downloaded one at a time.' },
    ],
  },
  {
    id: 'bandcamp', name: 'Bandcamp', color: '#1da0c3', category: 'audio',
    regex: /bandcamp\.com/,
    description: 'Download Bandcamp tracks. Save independent music from Bandcamp.',
    howTo: ['Open the Bandcamp track page', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Independent music', 'High quality', 'Artist support', 'Free tracks available'],
    faq: [
      { q: 'Can I download paid tracks?', a: 'Only free/preview tracks and name-your-price releases are supported.' },
    ],
  },
  {
    id: 'mixcloud', name: 'Mixcloud', color: '#5000ff', category: 'audio',
    regex: /mixcloud\.com/,
    description: 'Download Mixcloud DJ mixes and radio shows. Save audio content from Mixcloud.',
    howTo: ['Open the Mixcloud show', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['DJ mix downloads', 'Radio shows', 'High quality', 'Free to use'],
    faq: [
      { q: 'Can I download DJ mixes?', a: 'Yes, public mixes on Mixcloud can be downloaded.' },
    ],
  },
  {
    id: 'audiomack', name: 'Audiomack', color: '#ffa200', category: 'audio',
    regex: /audiomack\.com/,
    description: 'Download Audiomack tracks. Save free music from the Audiomack platform.',
    howTo: ['Open the Audiomack track', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Free music downloads', 'High quality', 'Hip-hop & R&B', 'Fast extraction'],
    faq: [
      { q: 'Is Audiomack music free?', a: 'Yes, Audiomack offers free streaming and many tracks are available for download.' },
    ],
  },
  {
    id: 'audius', name: 'Audius', color: '#cc0fe0', category: 'audio',
    regex: /audius\.co/,
    description: 'Download Audius tracks. Save decentralized music from the Audius platform.',
    howTo: ['Open the Audius track', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Decentralized music', 'Free downloads', 'High quality', 'Artist direct'],
    faq: [
      { q: 'What is Audius?', a: 'Audius is a decentralized, community-owned music streaming platform.' },
    ],
  },
  {
    id: 'zingmp3', name: 'ZingMP3', color: '#6e00ff', category: 'audio',
    regex: /zingmp3\.vn|mp3\.zing\.vn/,
    description: 'Download ZingMP3 tracks. Save music from Vietnam\'s popular music platform.',
    howTo: ['Open the ZingMP3 track', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Vietnamese music', 'High quality', 'Fast extraction', 'Free to use'],
    faq: [
      { q: 'What is ZingMP3?', a: 'ZingMP3 is Vietnam\'s most popular music streaming platform.' },
    ],
  },
  {
    id: 'nhaccuatui', name: 'NhacCuaTui', color: '#2ec4b6', category: 'audio',
    regex: /nhaccuatui\.com/,
    description: 'Download NhacCuaTui tracks. Save music from the Vietnamese music platform.',
    howTo: ['Open the NhacCuaTui track', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Vietnamese music', 'High quality', 'Fast extraction', 'Free to use'],
    faq: [
      { q: 'What is NhacCuaTui?', a: 'NhacCuaTui is a popular Vietnamese music and lyrics platform.' },
    ],
  },
  {
    id: 'gaana', name: 'Gaana', color: '#e72c30', category: 'audio',
    regex: /gaana\.com/,
    description: 'Download Gaana tracks. Save Bollywood and Indian music from Gaana.',
    howTo: ['Open the Gaana track', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Bollywood music', 'Regional music', 'High quality', 'Fast extraction'],
    faq: [
      { q: 'What is Gaana?', a: 'Gaana is one of India\'s largest music streaming platforms.' },
    ],
  },
  {
    id: 'jiosaavn', name: 'JioSaavn', color: '#2bc5b4', category: 'audio',
    regex: /jiosaavn\.com|saavn\.com/,
    description: 'Download JioSaavn tracks. Save Indian music from the JioSaavn platform.',
    howTo: ['Open the JioSaavn track', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Indian music', 'Bollywood songs', 'High quality', 'Fast extraction'],
    faq: [
      { q: 'What is JioSaavn?', a: 'JioSaavn is a major Indian music streaming service.' },
    ],
  },
  {
    id: 'jamendo', name: 'Jamendo', color: '#3bc4c7', category: 'audio',
    regex: /jamendo\.com/,
    description: 'Download Jamendo tracks. Save royalty-free and Creative Commons music.',
    howTo: ['Open the Jamendo track', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Royalty-free music', 'Creative Commons', 'High quality', 'Free to use'],
    faq: [
      { q: 'Is Jamendo music free?', a: 'Many tracks on Jamendo are available under Creative Commons licenses.' },
    ],
  },
  {
    id: 'hearthisat', name: 'HearThis.at', color: '#ff4500', category: 'audio',
    regex: /hearthis\.at/,
    description: 'Download HearThis.at tracks. Save DJ mixes and electronic music.',
    howTo: ['Open the HearThis.at track', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['DJ mixes', 'Electronic music', 'High quality', 'Free downloads'],
    faq: [
      { q: 'What is HearThis.at?', a: 'HearThis.at is a platform for DJs and music producers to share tracks.' },
    ],
  },
  {
    id: 'castbox', name: 'Castbox', color: '#f55b23', category: 'audio',
    regex: /castbox\.fm/,
    description: 'Download Castbox podcast episodes. Save podcasts for offline listening.',
    howTo: ['Open the Castbox episode', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Podcast downloads', 'Episode support', 'High quality', 'Free to use'],
    faq: [
      { q: 'Can I download podcast episodes?', a: 'Yes, publicly available podcast episodes on Castbox can be downloaded.' },
    ],
  },
  {
    id: 'apple-podcasts', name: 'Apple Podcasts', color: '#872ec4', category: 'audio',
    regex: /podcasts\.apple\.com/,
    description: 'Download Apple Podcast episodes. Save podcasts from Apple Podcasts for offline listening.',
    howTo: ['Open Apple Podcasts and find the episode', 'Click Share → Copy Link', 'Paste and click Download', 'Save the audio file'],
    features: ['Podcast episodes', 'High quality audio', 'Wide selection', 'Fast downloads'],
    faq: [
      { q: 'Can I download any Apple Podcast?', a: 'Most publicly available podcast episodes can be downloaded.' },
    ],
  },
  {
    id: 'audioboom', name: 'Audioboom', color: '#004c8c', category: 'audio',
    regex: /audioboom\.com/,
    description: 'Download Audioboom podcast episodes. Save professional podcast content.',
    howTo: ['Open the Audioboom episode', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Professional podcasts', 'High quality', 'Fast extraction', 'Free to use'],
    faq: [
      { q: 'What is Audioboom?', a: 'Audioboom is a professional podcast hosting and distribution platform.' },
    ],
  },
  {
    id: 'acast', name: 'Acast', color: '#10243e', category: 'audio',
    regex: /acast\.com|shows\.acast\.com/,
    description: 'Download Acast podcast episodes. Save podcasts from the Acast network.',
    howTo: ['Open the Acast episode', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Podcast downloads', 'Network shows', 'High quality', 'Free to use'],
    faq: [
      { q: 'What is Acast?', a: 'Acast is a podcast hosting and monetization platform.' },
    ],
  },
  {
    id: 'simplecast', name: 'Simplecast', color: '#3d3d3d', category: 'audio',
    regex: /simplecast\.com/,
    description: 'Download Simplecast podcast episodes. Save podcast content for offline listening.',
    howTo: ['Open the Simplecast episode', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Podcast episodes', 'High quality', 'Fast extraction', 'Free to use'],
    faq: [
      { q: 'What is Simplecast?', a: 'Simplecast is a podcast hosting and analytics platform.' },
    ],
  },
  {
    id: 'spreaker', name: 'Spreaker', color: '#f5c400', category: 'audio',
    regex: /spreaker\.com/,
    description: 'Download Spreaker podcast episodes. Save live and on-demand podcasts.',
    howTo: ['Open the Spreaker episode', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Live podcasts', 'On-demand episodes', 'High quality', 'Free to use'],
    faq: [
      { q: 'What is Spreaker?', a: 'Spreaker is a podcast creation and live broadcasting platform.' },
    ],
  },
];

export function detectPlatform(url: string): PlatformInfo | null {
  for (const p of platforms) {
    if (p.regex.test(url)) return p;
  }
  return null;
}

export function getPlatformsByCategory(category: 'video' | 'audio' | 'social') {
  return platforms.filter(p => p.category === category);
}
