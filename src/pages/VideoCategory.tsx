import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import DownloadWidget from '@/components/DownloadWidget';
import AdSlot from '@/components/AdSlot';
import { VIDEO_PLATFORMS, getWatermarkFreePlatforms } from '@/data/platforms';

const SITE = 'https://socialmediavideodownload.com';

const filters = ['All', 'Popular', 'Watermark-Free', 'China', 'India', 'Russia', 'Korea', 'Global'];

const VideoCategory: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const filtered = VIDEO_PLATFORMS.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Popular') return p.popular;
    if (filter === 'Watermark-Free') return p.supportsWatermarkFree;
    if (filter === 'China') return p.region === 'china';
    if (filter === 'India') return p.region === 'india';
    if (filter === 'Russia') return p.region === 'russia';
    if (filter === 'Korea') return p.region === 'korea';
    if (filter === 'Global') return p.region === 'global';
    return true;
  });

  const faq = [
    { q: 'How do I download videos from social media?', a: 'Simply copy the video URL from any supported platform, paste it into our download widget, and click Download. We support 50+ video platforms.' },
    { q: 'Is it free to download videos?', a: 'Yes, our video downloader is completely free. No registration, no hidden fees, no subscriptions required.' },
    { q: 'Can I download videos without watermark?', a: 'Yes! TikTok, Douyin, CapCut, and Xiaohongshu videos can be downloaded without watermarks automatically.' },
    { q: 'What video quality is available?', a: 'We provide the highest available quality, typically up to 1080p HD, depending on the original upload.' },
    { q: 'Do I need to install any software?', a: 'No installation needed. Our tool works entirely in your web browser on any device.' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', name: 'Video Downloader — Download from 50+ Platforms Free', url: `${SITE}/video-downloader` },
      { '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  return (
    <>
      <SEOHead
        title="Video Downloader — Download from 50+ Platforms Free"
        description="Free online video downloader supporting 50+ platforms including TikTok, Instagram, Twitter, Facebook, YouTube, Bilibili, Reddit, Twitch and many more."
        canonical={`${SITE}/video-downloader`}
        jsonLd={jsonLd}
      />

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold neon-text mb-3">
              📹 Video Downloader
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Free online video downloader supporting 50+ platforms including TikTok, Instagram, Twitter, Facebook, YouTube, Bilibili, Reddit, Twitch and many more.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <DownloadWidget />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${filter === f ? 'neon-btn' : 'glass text-foreground/60 hover:text-foreground'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="glass p-4 text-center mb-8">
            <span className="font-orbitron text-2xl font-bold neon-text">{filtered.length}</span>
            <span className="text-sm text-muted-foreground ml-2">Platforms {filter !== 'All' ? `(${filter})` : 'Supported'}</span>
          </div>

          <AdSlot format="responsive" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-8">
            {filtered.map(p => (
              <Link key={p.id} to={`/download/${p.slug}`}
                className="glass glass-hover p-4 transition-all duration-300 block"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${p.color}40`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                    {p.name[0]}
                  </div>
                  <h3 className="font-orbitron text-xs font-bold truncate">{p.name}</h3>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {p.supportsWatermarkFree && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold">No Watermark</span>}
                  {p.id === 'youtube' && <span className="text-[9px] px-1 py-0.5 rounded bg-neon-pink/20 text-neon-pink shrink-0">Ext.</span>}
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2">{p.description}</p>
                <span className="text-[10px] text-neon-cyan block mt-1">Download →</span>
              </Link>
            ))}
          </div>

          <section className="mt-16 max-w-3xl mx-auto">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple text-center mb-6">FAQ</h2>
            <div className="space-y-3">
              {faq.map((f, i) => (
                <details key={i} className="glass p-4 group">
                  <summary className="font-orbitron text-sm font-bold cursor-pointer list-none flex items-center justify-between">
                    {f.q}
                    <span className="text-neon-cyan transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-3">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default VideoCategory;
