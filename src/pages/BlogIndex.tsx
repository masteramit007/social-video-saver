import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';

export const blogPosts = [
  { slug: 'tiktok-video-downloader-no-watermark-2025', title: 'How to Download TikTok Videos Without Watermark in 2025', date: '2025-01-15', readTime: '5 min', excerpt: 'Learn the easiest ways to download TikTok videos without the watermark in full HD quality.' },
  { slug: 'instagram-reels-downloader-guide', title: 'Instagram Reels Downloader: Save Any Reel in HD', date: '2025-01-10', readTime: '4 min', excerpt: 'Complete guide to downloading Instagram Reels, Stories, and IGTV videos in HD quality.' },
  { slug: 'twitter-video-downloader-iphone-android', title: 'How to Download Twitter Videos on iPhone and Android', date: '2025-01-08', readTime: '5 min', excerpt: 'Step-by-step guide for downloading Twitter and X videos on mobile devices.' },
  { slug: 'bilibili-video-downloader-international', title: 'Bilibili Video Downloader for International Users', date: '2025-01-05', readTime: '4 min', excerpt: 'How to download Bilibili videos from anywhere in the world without a Chinese account.' },
  { slug: 'facebook-video-downloader-private-public', title: 'Download Facebook Videos: Public and Private Guide', date: '2025-01-03', readTime: '6 min', excerpt: 'Everything you need to know about downloading Facebook videos from public pages and groups.' },
  { slug: 'reddit-video-downloader-with-audio', title: 'Reddit Video Downloader: Download with Audio Merged', date: '2025-01-01', readTime: '4 min', excerpt: 'Why Reddit videos have no audio and how our tool automatically merges audio and video.' },
  { slug: 'best-social-media-video-downloaders-2025', title: '10 Best Social Media Video Downloaders in 2025', date: '2024-12-28', readTime: '8 min', excerpt: 'Comprehensive comparison of the top video downloading tools available in 2025.' },
  { slug: 'download-videos-for-offline-watching', title: 'How to Save Social Media Videos for Offline Watching', date: '2024-12-25', readTime: '5 min', excerpt: 'Save videos from any platform to watch offline on planes, trains, or anywhere without internet.' },
  { slug: 'rumble-video-downloader-guide', title: 'Rumble Video Downloader: Complete Guide 2025', date: '2024-12-22', readTime: '4 min', excerpt: 'Download any Rumble video in HD quality for free with our step-by-step guide.' },
  { slug: 'vimeo-video-downloader-free', title: 'How to Download Vimeo Videos for Free', date: '2024-12-20', readTime: '4 min', excerpt: 'The easiest way to download public Vimeo videos in high quality without any software.' },
  { slug: 'social-media-video-formats-explained', title: 'MP4 vs WebM: Best Video Format to Download', date: '2024-12-18', readTime: '6 min', excerpt: 'Understanding video formats and which one to choose when downloading social media videos.' },
  { slug: 'how-to-download-videos-on-mobile', title: 'How to Download Social Media Videos on Mobile (iOS & Android)', date: '2024-12-15', readTime: '5 min', excerpt: 'Complete mobile guide for downloading videos on iPhone and Android without any app.' },
  // New blog posts
  { slug: 'how-to-download-soundcloud-tracks-free-2025', title: 'How to Download SoundCloud Tracks Free in 2025', date: '2025-02-15', readTime: '5 min', excerpt: 'Complete guide to downloading SoundCloud tracks and playlists in high quality MP3 format for free.' },
  { slug: 'spotify-music-downloader-what-works', title: 'Spotify Music Downloader: What Actually Works', date: '2025-02-12', readTime: '6 min', excerpt: 'An honest look at Spotify downloading methods that actually work in 2025, without premium.' },
  { slug: 'tiktok-vs-douyin-download-without-watermark', title: 'TikTok vs Douyin: How to Download Both Without Watermark', date: '2025-02-10', readTime: '5 min', excerpt: 'The differences between TikTok and Douyin, and how to download watermark-free videos from both platforms.' },
  { slug: 'download-bilibili-videos-outside-china', title: 'Download Bilibili Videos Outside China: Complete Guide', date: '2025-02-08', readTime: '7 min', excerpt: 'How to access and download Bilibili videos from anywhere in the world, including geo-restricted content.' },
  { slug: 'best-indian-music-downloaders-jiosaavn-gaana', title: 'Best Indian Music Downloaders: JioSaavn and Gaana Guide', date: '2025-02-05', readTime: '5 min', excerpt: 'Download Bollywood and Indian regional music from JioSaavn and Gaana for free in high quality.' },
  { slug: 'how-to-download-twitch-clips-vods-free', title: 'How to Download Twitch Clips and VODs Free', date: '2025-02-03', readTime: '4 min', excerpt: 'Save your favorite Twitch clips and VODs for offline viewing with our free downloader tool.' },
  { slug: 'vk-video-downloader-russian-social-media', title: 'VK Video Downloader: Download Russian Social Media Videos', date: '2025-02-01', readTime: '4 min', excerpt: 'Download videos from VK (VKontakte), Russia\'s largest social network, in HD quality.' },
  { slug: 'download-telegram-videos-step-by-step', title: 'Download Telegram Videos: Step by Step Guide', date: '2025-01-28', readTime: '4 min', excerpt: 'How to download videos from public Telegram channels and groups using our free tool.' },
  { slug: 'linkedin-video-downloader-professional-videos', title: 'LinkedIn Video Downloader: Save Professional Videos', date: '2025-01-25', readTime: '4 min', excerpt: 'Download LinkedIn post videos for offline viewing. Save professional and educational content easily.' },
  { slug: 'bluesky-video-downloader-twitter-alternative', title: 'Bluesky Video Downloader: The New Twitter Alternative', date: '2025-01-22', readTime: '4 min', excerpt: 'How to download videos from Bluesky, the decentralized Twitter/X alternative growing rapidly.' },
  { slug: 'how-to-download-podcast-episodes-any-platform', title: 'How to Download Podcast Episodes from Any Platform', date: '2025-01-20', readTime: '5 min', excerpt: 'Download podcast episodes from Apple Podcasts, Castbox, Spreaker and more for offline listening.' },
  { slug: '9gag-video-downloader-funny-videos-gifs', title: '9GAG Video Downloader: Save Funny Videos and GIFs', date: '2025-01-18', readTime: '3 min', excerpt: 'Download 9GAG videos and GIFs to your device for sharing and offline viewing.' },
];

const BlogIndex: React.FC = () => {
  return (
    <>
      <SEOHead title="Blog — Video & Audio Download Tips & Guides" description="Tips, guides, and tutorials for downloading videos and audio from TikTok, Instagram, Spotify, SoundCloud, and 70+ platforms." canonical="https://socialmediavideodownload.com/blog" />
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
