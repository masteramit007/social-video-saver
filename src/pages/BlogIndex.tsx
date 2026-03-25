import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { VIDEO_PLATFORMS, AUDIO_PLATFORMS } from '@/data/platforms';

export const blogPosts = [
  { slug: 'tiktok-video-downloader-no-watermark-2025', title: 'How to Download TikTok Videos Without Watermark in 2025', date: '2025-01-15', readTime: '8 min', excerpt: 'Complete guide to using a TikTok video downloader without watermark. Learn how to download TikTok videos free, save TikTok to MP4, and use our TikTok downloader no watermark tool on iPhone and Android.', keywords: 'tiktok video downloader without watermark, tiktok downloader no watermark, download tiktok without watermark, tiktok to mp4, save tiktok video, tiktok video saver' },
  { slug: 'bilibili-video-downloader-international', title: 'Bilibili Video Downloader for International Users — Complete Guide', date: '2025-01-05', readTime: '8 min', excerpt: 'How to download Bilibili videos outside China with our free Bilibili video downloader. Bilibili downloader online for international users — no account needed, HD quality.', keywords: 'bilibili video downloader, download bilibili video, bilibili downloader online free, bilibili video download english, how to download bilibili video outside china' },
  { slug: 'reddit-video-downloader-with-audio', title: 'Reddit Video Downloader with Audio — Fix No Sound Issue 2025', date: '2025-01-01', readTime: '7 min', excerpt: 'Download Reddit videos with audio merged using our Reddit video downloader. Fix the Reddit video no sound issue — download Reddit videos with sound free.', keywords: 'reddit video downloader with audio, download reddit video with sound, reddit video no sound fix, save reddit video, reddit mp4 downloader' },
  { slug: 'best-social-media-video-downloaders-2025', title: 'Best Online Video Downloader 2025 — All in One Free Tool', date: '2024-12-28', readTime: '10 min', excerpt: `The best online video downloader in 2025. Free video downloader online supporting ${VIDEO_PLATFORMS.length}+ platforms — social media video downloader, all in one video downloader, universal tool.`, keywords: 'best online video downloader 2025, free video downloader online, social media video downloader, all in one video downloader' },
  { slug: 'download-videos-for-offline-watching', title: 'How to Download Social Media Videos for Offline Watching', date: '2024-12-25', readTime: '6 min', excerpt: 'Save videos from any platform to watch offline. Free video downloader online — download any video online from TikTok, Reddit, Vimeo, Bilibili and more.', keywords: 'download any video online, free video downloader online, video downloader online free' },
  { slug: 'vimeo-video-downloader-free', title: 'How to Download Vimeo Videos for Free Online 2025', date: '2024-12-20', readTime: '5 min', excerpt: 'Download Vimeo videos free online with our Vimeo downloader. Vimeo to MP4 — save public Vimeo videos without account.', keywords: 'vimeo downloader, download vimeo video, vimeo video downloader free online, vimeo to mp4' },
  { slug: 'social-media-video-formats-explained', title: 'MP4 vs WebM: Best Video Format to Download in 2025', date: '2024-12-18', readTime: '6 min', excerpt: 'Understanding video formats for downloading social media videos. MP4 downloader online — choose the best format for your device.', keywords: 'mp4 downloader online, video downloader online free, best video format' },
  { slug: 'how-to-download-videos-on-mobile', title: 'How to Download Social Media Videos on Mobile (iOS & Android)', date: '2024-12-15', readTime: '6 min', excerpt: 'Complete mobile guide for downloading videos on iPhone and Android. Free video downloader — no app installation needed, works in browser.', keywords: 'video downloader online free, download video on iphone, download video on android' },
  { slug: 'download-bilibili-videos-outside-china', title: 'Download Bilibili Videos Outside China: Complete Guide 2025', date: '2025-02-08', readTime: '8 min', excerpt: 'How to download Bilibili videos outside China. Bilibili downloader for international users — download Bilibili anime and videos without a Chinese account.', keywords: 'bilibili video downloader, how to download bilibili video outside china, bilibili downloader online free, download bilibili anime' },
  { slug: 'how-to-download-twitch-clips-vods-free', title: 'Twitch Clip Downloader — Download Twitch Clips & VODs Free 2025', date: '2025-02-03', readTime: '6 min', excerpt: 'Download Twitch clips and VODs free with our Twitch clip downloader. Save your favorite Twitch streaming moments in HD quality.', keywords: 'twitch clip downloader, download twitch clips, twitch vod downloader, twitch video downloader free, save twitch clip' },
  { slug: 'vk-video-downloader-russian-social-media', title: 'VK Video Downloader — Download VKontakte Videos Free 2025', date: '2025-02-01', readTime: '6 min', excerpt: 'Download VK videos free with our VK video downloader. VKontakte video downloader — save Russian social media videos in HD quality online.', keywords: 'vk video downloader, download vk video, vkontakte video downloader, save vk video' },
  { slug: '9gag-video-downloader-funny-videos-gifs', title: '9GAG Video Downloader — Download 9GAG Videos & GIFs Free 2025', date: '2025-01-18', readTime: '4 min', excerpt: 'Download 9GAG videos and GIFs free. 9GAG downloader online — save funny videos as MP4 for sharing and offline viewing.', keywords: '9gag video downloader, download 9gag video, 9gag gif downloader' },
];

const BlogIndex: React.FC = () => {
  return (
    <>
      <SEOHead title="Blog — Video & Audio Download Tips & Guides" description={`Tips, guides, and tutorials for downloading videos and audio from TikTok, Reddit, Vimeo, Bilibili, and ${VIDEO_PLATFORMS.length}+ platforms. Best online video downloader guides 2025.`} canonical="https://socialmediavideodownload.com/blog" />
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold neon-text text-center mb-10">Blog</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts.map((post, i) => (
              <React.Fragment key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="glass glass-hover p-5 transition-all duration-300 block">
                  <span className="text-xs text-muted-foreground">{post.date} · {post.readTime}</span>
                  <h2 className="font-orbitron text-sm font-bold mt-2 mb-2 leading-snug">{post.title}</h2>
                  <p className="text-xs text-muted-foreground">{post.excerpt}</p>
                  <span className="text-xs text-neon-cyan mt-3 block">Read more →</span>
                </Link>
                {i === 5 && <div className="md:col-span-2 lg:col-span-3"><div className="glass flex items-center justify-center h-[100px] opacity-40"><span className="text-muted-foreground text-sm">Ad Space</span></div></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogIndex;
