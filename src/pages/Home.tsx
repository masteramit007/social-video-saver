import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap, Shield, Smartphone, Download, Globe, Eye } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import DownloadWidget from '@/components/DownloadWidget';
import AdSlot from '@/components/AdSlot';
import { platforms, getPlatformsByCategory } from '@/lib/platforms';

const features = [
  { icon: Eye, titleKey: 'feature_no_watermark', descKey: 'feature_no_watermark_desc' },
  { icon: Zap, titleKey: 'feature_hd', descKey: 'feature_hd_desc' },
  { icon: Shield, titleKey: 'feature_no_login', descKey: 'feature_no_login_desc' },
  { icon: Download, titleKey: 'feature_fast', descKey: 'feature_fast_desc' },
  { icon: Globe, titleKey: 'feature_platforms', descKey: 'feature_platforms_desc' },
  { icon: Smartphone, titleKey: 'feature_mobile', descKey: 'feature_mobile_desc' },
];

const stats = [
  { value: '10,000,000+', labelKey: 'stat_downloads' },
  { value: '190+', labelKey: 'stat_countries' },
  { value: '12+', labelKey: 'stat_platforms' },
  { value: '99.9%', labelKey: 'stat_uptime' },
];

const Home: React.FC = () => {
  const { t } = useTranslation();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Social Media Video Downloader',
        url: 'https://socialmediavideodownloader.com',
        potentialAction: { '@type': 'SearchAction', target: 'https://socialmediavideodownloader.com/?url={url}', 'query-input': 'required name=url' },
      },
      {
        '@type': 'Organization',
        name: 'SocialMediaVideoDownloader.com',
        url: 'https://socialmediavideodownloader.com',
        logo: 'https://socialmediavideodownloader.com/logo.png',
      },
    ],
  };

  return (
    <>
      <SEOHead
        title="Download Any Social Media Video — Free, Fast, No Watermark"
        description="Download videos from TikTok, Instagram, Twitter, Facebook, Bilibili, Reddit and 10+ platforms. Free, fast, HD quality, no watermark."
        canonical="https://socialmediavideodownloader.com"
        jsonLd={jsonLd}
      />

      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-28 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-orbitron text-3xl md:text-5xl lg:text-6xl font-bold neon-text leading-tight mb-2">
              {t('hero_title')}
            </h1>
            <p className="font-orbitron text-lg md:text-2xl text-neon-cyan/80 mb-4">{t('hero_subtitle')}</p>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-8">{t('hero_desc')}</p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {['trust_downloads', 'trust_countries', 'trust_no_reg', 'trust_free'].map(key => (
                <span key={key} className="glass px-4 py-2 text-xs text-foreground/70">{t(key)}</span>
              ))}
            </div>

            <DownloadWidget />

            {/* Platform icons */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {platforms.filter(p => p.id !== 'youtube').map(p => (
                <Link key={p.id} to={`/download/${p.id}`}
                  className="glass px-3 py-2 text-xs font-bold transition-all duration-200 hover:scale-105"
                  style={{ '--hover-color': p.color } as React.CSSProperties}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 20px ${p.color}40`)}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AdSlot format="responsive" />

        {/* Platform Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-center neon-text-purple mb-10">Supported Platforms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {platforms.map(p => (
                <Link key={p.id} to={`/download/${p.id}`}
                  className="glass glass-hover p-5 transition-all duration-300 block"
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${p.color}40`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                      {p.name[0]}
                    </div>
                    <h3 className="font-orbitron text-sm font-bold">{p.name}</h3>
                    {p.id === 'youtube' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-pink/20 text-neon-pink">Ext.</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.description.slice(0, 80)}…</p>
                  <span className="text-xs text-neon-cyan mt-2 block">Download →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <div key={i} className="glass glass-hover p-6 transition-all duration-300">
                  <f.icon className="w-8 h-8 text-neon-cyan mb-3" />
                  <h3 className="font-orbitron text-sm font-bold mb-1">{t(f.titleKey)}</h3>
                  <p className="text-xs text-muted-foreground">{t(f.descKey)}</p>
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
                  <div className="text-xs text-muted-foreground mt-1">{t(s.labelKey)}</div>
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
