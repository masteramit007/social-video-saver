import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import DownloadWidget from '@/components/DownloadWidget';
import AdSlot from '@/components/AdSlot';
import { AUDIO_PLATFORMS } from '@/data/platforms';
import { PSEO_LANGUAGES } from '@/data/pseoConfig';
import { PLATFORM_KEYWORDS, getPlatformSchemaDescription } from '@/data/keywords';
import { supportedLanguages } from '@/i18n';

const SITE = 'https://socialmediavideodownload.com';

const AudioPlatformPage: React.FC = () => {
  const { platform: platformId, lang } = useParams<{ platform: string; lang?: string }>();
  const { i18n, t } = useTranslation();

  React.useEffect(() => {
    if (lang && supportedLanguages.some(l => l.code === lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const platform = AUDIO_PLATFORMS.find(p => p.slug === platformId);
  if (!platform) return <div className="relative z-10 pt-24 text-center text-foreground">Platform not found</div>;

  const currentLang = lang || 'en';
  const canonical = lang ? `${SITE}/${lang}/audio/${platformId}` : `${SITE}/audio/${platformId}`;
  const hreflangs = [
    ...PSEO_LANGUAGES.map(l => ({ lang: l.code, url: `${SITE}/${l.code}/audio/${platformId}` })),
    { lang: 'x-default', url: `${SITE}/audio/${platformId}` },
  ];

  const keywords = PLATFORM_KEYWORDS[platform.id];
  const seoTitle = keywords?.seoTitle || `${platform.name} Downloader — Download Music & Podcasts Free 2026`;
  const seoDescription = keywords?.seoDescription || platform.description;
  const schemaDesc = getPlatformSchemaDescription(platform.id);
  const h2s = keywords?.h2s || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `${platform.name} Downloader`,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        description: schemaDesc || platform.description,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', ratingCount: '8432' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: platform.faq.map(f => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Audio Downloader', item: `${SITE}/audio-downloader` },
          { '@type': 'ListItem', position: 3, name: `${platform.name} Downloader`, item: canonical },
        ],
      },
    ],
  };

  const related = AUDIO_PLATFORMS.filter(p => p.id !== platformId).slice(0, 3);

  const blogLinks: Record<string, string> = {
    soundcloud: '/blog/how-to-download-soundcloud-tracks-free-2026',
    spotify: '/blog/spotify-music-downloader-what-works',
    jiosaavn: '/blog/best-indian-music-downloaders-jiosaavn-gaana',
    gaana: '/blog/best-indian-music-downloaders-jiosaavn-gaana',
  };

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
        lang={currentLang}
        hreflangs={hreflangs}
        jsonLd={jsonLd}
      />

      <div className="relative z-10 pt-24 pb-16 px-4" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">{t('nav_home')}</Link>
            <span>/</span>
            <Link to="/audio-downloader" className="hover:text-foreground transition-colors">Audio Downloader</Link>
            <span>/</span>
            <span>{platform.name}</span>
          </nav>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${platform.color}20`, color: platform.color }}>
                🎵
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 font-bold">🎵 Audio</span>
            </div>
            <h1 className="font-orbitron text-2xl md:text-4xl font-bold neon-text mb-3">
              {keywords?.h1 || `${platform.name} Downloader`}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">{seoDescription}</p>
          </div>

          <DownloadWidget />

          <AdSlot format="responsive" />

          <section className="mt-16">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple mb-6">
              {h2s[0] || `How to Download from ${platform.name}`}
            </h2>
            <div className="space-y-3">
              {platform.howTo.map((step, i) => (
                <div key={i} className="glass p-4 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full neon-btn flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <p className="text-sm text-foreground/80 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-orbitron text-xl font-bold neon-text mb-6">
              {h2s[2] || `${platform.name} Downloader Features`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {platform.features.map((f, i) => (
                <div key={i} className="glass p-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color }} />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Device section */}
          <section className="mt-12">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple mb-6">
              Download {platform.name} Music on All Devices
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">📱 iPhone</h3>
                <p className="text-xs text-muted-foreground">Open Safari, paste the {platform.name} track URL, and download. Save MP3 files directly to your iPhone Files app.</p>
              </div>
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">🤖 Android</h3>
                <p className="text-xs text-muted-foreground">Works in Chrome on Android. Paste the link, download, and find your MP3 in the Downloads folder.</p>
              </div>
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">💻 Desktop</h3>
                <p className="text-xs text-muted-foreground">No software needed. Our {platform.name} downloader works in any desktop browser — Chrome, Firefox, Safari, Edge.</p>
              </div>
            </div>
          </section>

          <AdSlot format="rectangle" />

          <section className="mt-12">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple mb-6">
              {h2s[3] || `Frequently Asked Questions — ${platform.name} Downloader`}
            </h2>
            <div className="space-y-3">
              {platform.faq.map((f, i) => (
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

          <section className="mt-12">
            <h2 className="font-orbitron text-lg font-bold mb-4">More Audio Platforms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map(p => (
                <Link key={p.id} to={`/audio/${p.slug}`} className="glass glass-hover p-4 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                      🎵
                    </div>
                    <span className="font-orbitron text-sm font-bold">{p.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.description.slice(0, 60)}…</p>
                </Link>
              ))}
            </div>
          </section>

          {blogLinks[platform.id] && (
            <div className="mt-6 glass p-4">
              <Link to={blogLinks[platform.id]} className="text-sm text-neon-cyan hover:underline">
                📖 Read our complete guide →
              </Link>
            </div>
          )}

          {/* Language variants */}
          <section className="mt-8">
            <h3 className="font-orbitron text-sm font-bold mb-3 text-muted-foreground">Available in other languages:</h3>
            <div className="flex flex-wrap gap-2">
              {PSEO_LANGUAGES.filter(l => l.code !== currentLang).slice(0, 10).map(l => (
                <Link key={l.code} to={`/${l.code}/audio/${platform.slug}`}
                  className="glass px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  {l.native}
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-8 text-center">
            <Link to="/audio-downloader" className="text-sm text-neon-cyan hover:underline">← View all audio platforms</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioPlatformPage;
