import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap, Shield, Smartphone, Download, Globe, Eye, Music, Headphones, Mic, Volume2 } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import DownloadWidget from '@/components/DownloadWidget';
import AdSlot from '@/components/AdSlot';
import { VIDEO_PLATFORMS, AUDIO_PLATFORMS, getPopularVideoPlatforms, getPopularAudioPlatforms } from '@/data/platforms';

const SITE = 'https://socialmediavideodownload.com';

const features = [
  { icon: Eye, titleKey: 'feature_no_watermark', descKey: 'feature_no_watermark_desc' },
  { icon: Zap, titleKey: 'feature_hd', descKey: 'feature_hd_desc' },
  { icon: Shield, titleKey: 'feature_no_login', descKey: 'feature_no_login_desc' },
  { icon: Download, titleKey: 'feature_fast', descKey: 'feature_fast_desc' },
  { icon: Globe, titleKey: 'feature_platforms', descKey: 'feature_platforms_desc' },
  { icon: Smartphone, titleKey: 'feature_mobile', descKey: 'feature_mobile_desc' },
  { icon: Music, title: 'MP3 Download', desc: 'Extract audio from any video in MP3 format' },
  { icon: Headphones, title: 'Podcast Saver', desc: 'Download podcast episodes for offline listening' },
  { icon: Mic, title: 'Music Download', desc: 'Save tracks from Spotify, SoundCloud, and more' },
  { icon: Volume2, title: 'Lossless Quality', desc: 'Best available audio quality extraction' },
];

const stats = [
  { value: `${VIDEO_PLATFORMS.length}+`, label: 'Video Platforms' },
  { value: `${AUDIO_PLATFORMS.length}`, label: 'Audio Platforms' },
  { value: 'No Login', label: 'Required' },
  { value: 'Always', label: 'Free' },
];

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');

  const popularVideo = getPopularVideoPlatforms();
  const popularAudio = getPopularAudioPlatforms();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Social Media Video Downloader',
        url: SITE,
        potentialAction: { '@type': 'SearchAction', target: `${SITE}/?url={url}`, 'query-input': 'required name=url' },
      },
      {
        '@type': 'Organization',
        name: 'SocialMediaVideoDownload.com',
        url: SITE,
        logo: `${SITE}/logo.png`,
      },
    ],
  };

  return (
    <>
      <SEOHead
        title="Download Videos & Music From Any Platform — Free"
        description="Download videos & audio from TikTok, Instagram, Twitter, Facebook, SoundCloud, Spotify and 70+ platforms. Free, fast, HD quality, no watermark."
        canonical={SITE}
        jsonLd={jsonLd}
      />

      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-28 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-orbitron text-3xl md:text-5xl lg:text-6xl font-bold neon-text leading-tight mb-2">
              Download Videos & Music From Any Platform — Free
            </h1>
            <p className="font-orbitron text-lg md:text-2xl text-neon-cyan/80 mb-4">
              Supports {VIDEO_PLATFORMS.length}+ video platforms and {AUDIO_PLATFORMS.length} audio platforms
            </p>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-8">
              Including TikTok, Instagram, Spotify, SoundCloud, Twitter, Facebook, Bilibili, Reddit, and many more
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {['trust_downloads', 'trust_countries', 'trust_no_reg', 'trust_free'].map(key => (
                <span key={key} className="glass px-4 py-2 text-xs text-foreground/70">{t(key)}</span>
              ))}
            </div>

            <DownloadWidget />

            {/* Platform tabs */}
            <div className="mt-10">
              <div className="flex justify-center gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all ${activeTab === 'video' ? 'neon-btn' : 'glass text-foreground/60 hover:text-foreground'}`}
                >
                  📹 Video Platforms
                </button>
                <button
                  onClick={() => setActiveTab('audio')}
                  className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all ${activeTab === 'audio' ? 'neon-btn' : 'glass text-foreground/60 hover:text-foreground'}`}
                >
                  🎵 Audio Platforms
                </button>
              </div>

              {activeTab === 'video' && (
                <div className="flex flex-wrap justify-center gap-3">
                  {popularVideo.map(p => (
                    <Link key={p.id} to={`/download/${p.slug}`}
                      className="glass px-3 py-2 text-xs font-bold transition-all duration-200 hover:scale-105"
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 20px ${p.color}40`)}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
                    >
                      {p.name}
                    </Link>
                  ))}
                  <Link to="/video-downloader" className="glass px-3 py-2 text-xs font-bold text-neon-cyan">All {VIDEO_PLATFORMS.length}+ →</Link>
                </div>
              )}

              {activeTab === 'audio' && (
                <div className="flex flex-wrap justify-center gap-3">
                  {popularAudio.map(p => (
                    <Link key={p.id} to={`/audio/${p.slug}`}
                      className="glass px-3 py-2 text-xs font-bold transition-all duration-200 hover:scale-105"
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 20px ${p.color}40`)}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
                    >
                      {p.name}
                    </Link>
                  ))}
                  <Link to="/audio-downloader" className="glass px-3 py-2 text-xs font-bold text-neon-cyan">All {AUDIO_PLATFORMS.length} →</Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <AdSlot format="responsive" />

        {/* How it works */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-center neon-text mb-10">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass p-6 text-center">
                  <div className="w-12 h-12 rounded-full neon-btn flex items-center justify-center mx-auto mb-4 text-lg font-bold">{i}</div>
                  <h3 className="font-orbitron text-sm font-bold mb-2">{t(`step${i}_title`)}</h3>
                  <p className="text-xs text-muted-foreground">{t(`step${i}_desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-center neon-text-purple mb-10">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <div key={i} className="glass glass-hover p-6 transition-all duration-300">
                  <f.icon className="w-8 h-8 text-neon-cyan mb-3" />
                  <h3 className="font-orbitron text-sm font-bold mb-1">{'titleKey' in f ? t(f.titleKey) : f.title}</h3>
                  <p className="text-xs text-muted-foreground">{'descKey' in f ? t(f.descKey) : f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AdSlot format="banner" />

        {/* Stats */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="glass p-6 text-center">
                  <div className="font-orbitron text-2xl md:text-3xl font-bold neon-text">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-center neon-text mb-10">FAQ</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <details key={i} className="glass p-4 group">
                  <summary className="font-orbitron text-sm font-bold cursor-pointer list-none flex items-center justify-between">
                    {t(`faq_q${i}`)}
                    <span className="text-neon-cyan transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-3">{t(`faq_a${i}`)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
