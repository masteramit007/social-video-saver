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

export const platforms: PlatformInfo[] = [
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
    id: 'bandcamp', name: 'Bandcamp', color: '#1da0c3', category: 'audio',
    regex: /bandcamp\.com/,
    description: 'Download Bandcamp tracks. Save independent music from Bandcamp.',
    howTo: ['Open the Bandcamp track page', 'Copy the URL', 'Paste and click Download', 'Save the audio file'],
    features: ['Independent music', 'High quality', 'Artist support', 'Free tracks available'],
    faq: [
      { q: 'Can I download paid tracks?', a: 'Only free/preview tracks and name-your-price releases are supported.' },
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
