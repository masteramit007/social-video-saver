export interface PlatformInfo {
  id: string;
  name: string;
  color: string;
  regex: RegExp;
  description: string;
  howTo: string[];
  features: string[];
  faq: { q: string; a: string }[];
}

export const platforms: PlatformInfo[] = [
  {
    id: 'tiktok', name: 'TikTok', color: '#ff0050',
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
    id: 'instagram', name: 'Instagram', color: '#e1306c',
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
    id: 'twitter', name: 'Twitter / X', color: '#1da1f2',
    regex: /twitter\.com|x\.com/,
    description: 'Download Twitter/X videos and GIFs in HD. Save any tweet video to your device.',
    howTo: ['Find the tweet with the video', 'Click Share → Copy Link', 'Paste the link and click Download', 'Choose quality and save'],
    features: ['Download tweet videos in HD', 'Save Twitter GIFs as MP4', 'Multiple quality options', 'Works with X.com links'],
    faq: [
      { q: 'Can I download Twitter GIFs?', a: 'Yes! Twitter GIFs are actually MP4 videos and can be downloaded directly.' },
      { q: 'Does it work with X.com links?', a: 'Yes, both twitter.com and x.com links are fully supported.' },
      { q: 'Can I download from Twitter Spaces?', a: 'Audio from Twitter Spaces is not currently supported.' },
      { q: 'What quality options are available?', a: 'Twitter typically offers 480p and 720p quality options.' },
      { q: 'Can I download videos from threads?', a: 'Yes, paste the specific tweet URL containing the video.' },
    ],
  },
  {
    id: 'facebook', name: 'Facebook', color: '#1877f2',
    regex: /facebook\.com|fb\.watch/,
    description: 'Download Facebook videos in HD quality. Save videos from public Facebook posts and pages.',
    howTo: ['Find the video on Facebook', 'Right-click → Copy video URL (or use Share → Copy Link)', 'Paste the URL and click Download', 'Save to your device'],
    features: ['Public video downloads', 'HD quality support', 'fb.watch short links supported', 'Download from Pages and Groups'],
    faq: [
      { q: 'Can I download private Facebook videos?', a: 'No, only publicly shared videos can be downloaded.' },
      { q: 'Do Facebook Reels work?', a: 'Yes, Facebook Reels can be downloaded using the share link.' },
      { q: 'What about Facebook Watch videos?', a: 'Yes, Facebook Watch videos are supported.' },
      { q: 'Can I use fb.watch links?', a: 'Yes, both full Facebook URLs and fb.watch short links work.' },
      { q: 'Why is the quality low?', a: 'Quality depends on the original upload. We always provide the best available quality.' },
    ],
  },
  {
    id: 'bilibili', name: 'Bilibili', color: '#fb7299',
    regex: /bilibili\.com/,
    description: 'Download Bilibili videos for international users. Save any Bilibili video in HD quality.',
    howTo: ['Open the Bilibili video page', 'Copy the URL from your browser address bar', 'Paste the URL and click Download', 'Save the video file'],
    features: ['International access supported', 'HD quality downloads', 'No Bilibili account needed', 'Fast CDN delivery'],
    faq: [
      { q: 'Can I download Bilibili videos outside China?', a: 'Yes! Our tool works internationally for publicly available Bilibili videos.' },
      { q: 'What quality is available?', a: 'We typically provide 720p quality for Bilibili videos.' },
      { q: 'Do I need a Bilibili account?', a: 'No account is needed to download public videos.' },
      { q: 'Are subtitles included?', a: 'Subtitles are not included in the download as they are rendered separately by Bilibili.' },
      { q: 'Can I download Bilibili audio?', a: 'Audio-only downloads are available for some videos.' },
    ],
  },
  {
    id: 'dailymotion', name: 'Dailymotion', color: '#0066dc',
    regex: /dailymotion\.com/,
    description: 'Download Dailymotion videos in multiple qualities. Free and fast Dailymotion video downloader.',
    howTo: ['Open the Dailymotion video', 'Copy the video URL', 'Paste here and click Download', 'Choose quality and save'],
    features: ['Multiple quality options', 'Fast downloads', 'No registration needed', 'Direct CDN links'],
    faq: [
      { q: 'What qualities are available?', a: 'Dailymotion videos are typically available in 480p and 720p.' },
      { q: 'Is it free?', a: 'Yes, completely free with no limits.' },
      { q: 'Can I download private videos?', a: 'No, only public Dailymotion videos can be downloaded.' },
      { q: 'How fast is the download?', a: 'Downloads happen directly from Dailymotion CDN at maximum speed.' },
      { q: 'Do embedded videos work?', a: 'You need the direct Dailymotion URL, not an embedded player link.' },
    ],
  },
  {
    id: 'reddit', name: 'Reddit', color: '#ff4500',
    regex: /reddit\.com/,
    description: 'Download Reddit videos with audio merged. Save any Reddit video post in HD.',
    howTo: ['Find the Reddit post with a video', 'Copy the post URL from the address bar', 'Paste and click Download', 'Save with audio included'],
    features: ['Audio and video merged', 'HD quality', 'Works with all subreddits', 'No Reddit account needed'],
    faq: [
      { q: 'Why do Reddit videos have no audio?', a: 'Reddit stores audio and video separately. Our tool merges them for you.' },
      { q: 'Can I download Reddit GIFs?', a: 'Yes, Reddit GIFs (which are actually videos) can be downloaded.' },
      { q: 'Do NSFW posts work?', a: 'Public NSFW posts may work but are not guaranteed.' },
      { q: 'What about cross-posted videos?', a: 'Use the original post URL for best results.' },
      { q: 'Can I download Reddit Shorts?', a: 'Yes, Reddit short-form videos are supported.' },
    ],
  },
  {
    id: 'rumble', name: 'Rumble', color: '#85c742',
    regex: /rumble\.com/,
    description: 'Download Rumble videos for free in HD quality. Fast and reliable Rumble video downloader.',
    howTo: ['Open the Rumble video page', 'Copy the URL from your browser', 'Paste the link and click Download', 'Save the video'],
    features: ['HD quality downloads', 'Fast extraction', 'No account needed', 'Free to use'],
    faq: [
      { q: 'Is Rumble downloading free?', a: 'Yes, completely free.' },
      { q: 'What quality is available?', a: 'We provide the best available quality, usually up to 720p or 1080p.' },
      { q: 'Do live streams work?', a: 'Only completed/archived videos can be downloaded, not live streams.' },
      { q: 'Is this legal?', a: 'Downloading for personal use is generally permitted. Respect content creator rights.' },
      { q: 'Can I download Rumble Shorts?', a: 'Yes, short-form Rumble videos are supported.' },
    ],
  },
  {
    id: 'vimeo', name: 'Vimeo', color: '#1ab7ea',
    regex: /vimeo\.com/,
    description: 'Download Vimeo videos for free in HD. Save any public Vimeo video to your device.',
    howTo: ['Open the Vimeo video page', 'Copy the URL', 'Paste here and click Download', 'Choose quality and save'],
    features: ['HD quality up to 1080p', 'Multiple format options', 'Fast direct downloads', 'No Vimeo account needed'],
    faq: [
      { q: 'Can I download private Vimeo videos?', a: 'No, only publicly accessible Vimeo videos can be downloaded.' },
      { q: 'What about password-protected videos?', a: 'Password-protected videos are not supported.' },
      { q: 'Is the quality good?', a: 'Vimeo is known for high quality. We provide the best available resolution.' },
      { q: 'Can I download Vimeo audio?', a: 'Audio-only download may be available depending on the video.' },
      { q: 'Do Vimeo Staff Picks work?', a: 'Yes, any publicly viewable Vimeo video works.' },
    ],
  },
  {
    id: 'pinterest', name: 'Pinterest', color: '#e60023',
    regex: /pinterest\.com/,
    description: 'Download Pinterest videos and pins. Save video pins in HD quality to your device.',
    howTo: ['Find the video pin on Pinterest', 'Click Share → Copy Link', 'Paste the URL and click Download', 'Save the video'],
    features: ['Video pin downloads', 'HD quality', 'Fast and free', 'No login required'],
    faq: [
      { q: 'Can I download Pinterest images?', a: 'This tool is for videos. For images, right-click and save directly.' },
      { q: 'Do Story Pins work?', a: 'Video Story Pins can be downloaded if publicly available.' },
      { q: 'What quality is available?', a: 'We provide the original upload quality.' },
      { q: 'Is it free?', a: 'Yes, completely free.' },
      { q: 'Do I need a Pinterest account?', a: 'No account is needed.' },
    ],
  },
  {
    id: 'snapchat', name: 'Snapchat', color: '#fffc00',
    regex: /snapchat\.com/,
    description: 'Download Snapchat Spotlight and public story videos. Save Snapchat content to your device.',
    howTo: ['Open the Snapchat Spotlight or public story', 'Copy the share link', 'Paste and click Download', 'Save the video'],
    features: ['Spotlight video downloads', 'Public stories supported', 'HD quality', 'Fast extraction'],
    faq: [
      { q: 'Can I download private snaps?', a: 'No, only publicly shared Spotlight and story content can be downloaded.' },
      { q: 'Do disappearing messages work?', a: 'No, only publicly accessible content is supported.' },
      { q: 'What about Snapchat Memories?', a: 'Memories are private and cannot be downloaded externally.' },
      { q: 'Is this safe?', a: 'Yes, we only extract publicly available content links.' },
      { q: 'Can I download Snapchat ads?', a: 'No, ad content is not supported.' },
    ],
  },
  {
    id: 'youtube', name: 'YouTube', color: '#ff0000',
    regex: /youtube\.com|youtu\.be/,
    description: 'YouTube video downloading requires a browser extension due to technical restrictions.',
    howTo: ['Install Video DownloadHelper extension', 'Navigate to the YouTube video', 'Click the extension icon', 'Choose quality and download'],
    features: ['Extension Required', 'Video DownloadHelper recommended', 'Works on Chrome and Firefox', 'Supports all YouTube formats'],
    faq: [
      { q: 'Why can\'t you download YouTube videos?', a: 'YouTube actively blocks server-side downloading. Browser extensions work directly in your browser to bypass this.' },
      { q: 'Is Video DownloadHelper safe?', a: 'Yes, it\'s a well-known, trusted extension available on Chrome Web Store and Firefox Add-ons.' },
      { q: 'Are there alternatives?', a: 'You can also try 4K Video Downloader (desktop app) or youtube-dl (command line).' },
      { q: 'Is downloading YouTube videos legal?', a: 'Downloading for personal use may be allowed but violates YouTube ToS. Use at your own discretion.' },
      { q: 'Can I download YouTube Shorts?', a: 'Yes, the browser extension works with YouTube Shorts as well.' },
    ],
  },
];

export function detectPlatform(url: string): PlatformInfo | null {
  for (const p of platforms) {
    if (p.regex.test(url)) return p;
  }
  return null;
}
