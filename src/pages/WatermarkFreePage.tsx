import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import DownloadWidget from '@/components/DownloadWidget';
import AdSlot from '@/components/AdSlot';
import { getWatermarkFreePlatforms } from '@/data/platforms';

const SITE = 'https://socialmediavideodownload.com';

const WatermarkFreePage: React.FC = () => {
  const platforms = getWatermarkFreePlatforms();

  const faq = [
    { q: 'What does watermark-free mean?', a: 'Watermark-free means the downloaded video will not have any platform logo or username overlay on the video. You get a clean, original-quality video file.' },
    { q: 'Which platforms support watermark-free downloads?', a: 'Currently TikTok, Douyin, CapCut, and Xiaohongshu videos can be downloaded without watermarks.' },
    { q: 'How does watermark removal work?', a: 'We don\'t actually "remove" watermarks. Instead, we extract the original video file from the platform\'s CDN before the watermark is applied, giving you the clean source file.' },
    { q: 'Is the quality affected?', a: 'No! Since we extract the original file, you get the exact same quality as uploaded by the creator, without any quality loss.' },
    { q: 'Is watermark removal legal?', a: 'Downloading for personal use is generally permitted. However, always respect creators\' rights and don\'t redistribute content commercially.' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', name: 'Watermark-Free Video Downloader', url: `${SITE}/watermark-free-downloader` },
      { '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  return (
    <>
      <SEOHead
        title="Watermark-Free Video Downloader — TikTok, Douyin, CapCut"
        description="Download TikTok, Douyin, CapCut and Xiaohongshu videos without watermark. Free, instant, no login required."
        canonical={`${SITE}/watermark-free-downloader`}
        jsonLd={jsonLd}
      />

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 text-sm rounded-full bg-green-500/20 text-green-400 font-bold mb-4">✓ No Watermark</span>
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold neon-text mb-3">
              Watermark-Free Video Downloader
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download TikTok, Douyin, CapCut and Xiaohongshu videos without watermark. Free, instant, no login required.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <DownloadWidget />
          </div>

          <section className="mb-12">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple text-center mb-6">Why Do Platforms Add Watermarks?</h2>
            <div className="glass p-6 space-y-4">
              <p className="text-sm text-foreground/80">Social media platforms add watermarks (logos and usernames) to downloaded videos for brand promotion and content attribution. While this serves a purpose, many users prefer clean videos for personal archives, presentations, or creative projects.</p>
              <p className="text-sm text-foreground/80">Our tool extracts the original source video before the watermark layer is applied, giving you a pristine copy of the content.</p>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {platforms.map(p => (
              <Link key={p.id} to={`/download/${p.slug}`}
                className="glass glass-hover p-6 transition-all duration-300 block"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${p.color}40`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                    {p.name[0]}
                  </div>
                  <div>
                    <h3 className="font-orbitron text-sm font-bold">{p.name}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold">Watermark-Free ✓</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                <span className="text-xs text-neon-cyan block mt-3">Download Now →</span>
              </Link>
            ))}
          </div>

          <AdSlot format="responsive" />

          <section className="mt-12">
            <h2 className="font-orbitron text-xl font-bold neon-text text-center mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Copy the Link', desc: 'Copy the video URL from TikTok, Douyin, CapCut, or Xiaohongshu' },
                { step: '2', title: 'Paste & Download', desc: 'Paste the link into our downloader and click the Download button' },
                { step: '3', title: 'Save Clean Video', desc: 'Download the watermark-free video in HD quality to your device' },
              ].map(s => (
                <div key={s.step} className="glass p-6 text-center">
                  <div className="w-12 h-12 rounded-full neon-btn flex items-center justify-center mx-auto mb-4 text-lg font-bold">{s.step}</div>
                  <h3 className="font-orbitron text-sm font-bold mb-2">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 max-w-3xl mx-auto">
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

export default WatermarkFreePage;
