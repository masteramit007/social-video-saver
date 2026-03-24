import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import DownloadWidget from '@/components/DownloadWidget';
import AdSlot from '@/components/AdSlot';
import { VIDEO_PLATFORMS, AUDIO_PLATFORMS } from '@/data/platforms';
import { PSEO_LANGUAGES } from '@/data/pseoConfig';
import { getPlatformSeoTitle, getPlatformSeoDescription, getPlatformSchemaDescription, PLATFORM_KEYWORDS } from '@/data/keywords';
import { supportedLanguages } from '@/i18n';

const SITE = 'https://socialmediavideodownload.com';

const PSEOPage: React.FC = () => {
  const { platform: platformId, lang } = useParams<{ platform: string; lang: string }>();
  const { i18n, t } = useTranslation();

  React.useEffect(() => {
    if (lang && supportedLanguages.some(l => l.code === lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const isAudioRoute = window.location.pathname.includes('/audio/');
  const allPlatforms = isAudioRoute ? AUDIO_PLATFORMS : VIDEO_PLATFORMS;
  const platform = allPlatforms.find(p => p.slug === platformId || p.id === platformId);

  if (!platform) return <div className="relative z-10 pt-24 text-center text-foreground">Platform not found</div>;

  const currentLang = lang || 'en';
  const langConfig = PSEO_LANGUAGES.find(l => l.code === currentLang);
  const type = platform.category === 'audio' ? 'audio' : 'video';
  const basePath = type === 'audio' ? 'audio' : 'download';
  const canonical = `${SITE}/${currentLang}/${basePath}/${platform.slug}`;
  const englishCanonical = `${SITE}/${basePath}/${platform.slug}`;

  const hreflangs = PSEO_LANGUAGES.map(l => ({
    lang: l.code,
    url: `${SITE}/${l.code}/${basePath}/${platform.slug}`,
  }));
  hreflangs.push({ lang: 'x-default', url: englishCanonical });

  const seoTitle = getPlatformSeoTitle(platform.id, currentLang) || `${platform.name} Downloader — Free ${type === 'audio' ? 'MP3' : 'HD'} 2025`;
  const seoDescription = getPlatformSeoDescription(platform.id, currentLang, type, platform.name);
  const schemaDesc = getPlatformSchemaDescription(platform.id);
  const keywords = PLATFORM_KEYWORDS[platform.id];
  const isWmFree = 'supportsWatermarkFree' in platform && platform.supportsWatermarkFree;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `${platform.name} ${type === 'audio' ? '' : 'Video '}Downloader`,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        description: schemaDesc || platform.description,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '12543' },
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
          { '@type': 'ListItem', position: 2, name: type === 'audio' ? 'Audio Downloader' : 'Video Downloader', item: `${SITE}/${type === 'audio' ? 'audio' : 'video'}-downloader` },
          { '@type': 'ListItem', position: 3, name: `${platform.name} Downloader`, item: canonical },
        ],
      },
    ],
  };

  const related = allPlatforms.filter(p => p.id !== platform.id).slice(0, 3);
  const categoryLink = type === 'audio' ? '/audio-downloader' : '/video-downloader';
  const h2s = keywords?.h2s || [];

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

      <div className="relative z-10 pt-24 pb-16 px-4" dir={langConfig?.dir || 'ltr'}>
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">{t('nav_home')}</Link>
            <span>/</span>
            <Link to={categoryLink} className="hover:text-foreground transition-colors">
              {type === 'audio' ? 'Audio Downloader' : 'Video Downloader'}
            </Link>
            <span>/</span>
            <span>{platform.name}</span>
          </nav>

          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${platform.color}20`, color: platform.color }}>
                {type === 'audio' ? '🎵' : platform.name[0]}
              </div>
              {isWmFree && <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 font-bold">No Watermark ✓</span>}
              <span className={`px-2 py-1 text-xs rounded-full font-bold ${type === 'audio' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                {type === 'audio' ? '🎵 Audio' : '📹 Video'}
              </span>
            </div>
            <h1 className="font-orbitron text-2xl md:text-4xl font-bold neon-text mb-3">
              {keywords?.h1 || `${platform.name} ${type === 'audio' ? '' : 'Video '}Downloader`}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {platform.description} Free, no login required. Works on iPhone, Android and PC in 2025.
            </p>
          </div>

          <DownloadWidget forcePlatform={platform.id} />

          <AdSlot format="responsive" />

          {/* How to Download */}
          <section className="mt-16">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple mb-6">
              {h2s[0] || `How to Download ${platform.name} ${type === 'audio' ? 'Music' : 'Videos'}`}
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

          {/* Features */}
          <section className="mt-12">
            <h2 className="font-orbitron text-xl font-bold neon-text mb-6">
              {h2s[3] || `${platform.name} Download Features`}
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
              {h2s[2] || `Download ${platform.name} on iPhone & Android`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">📱 iPhone</h3>
                <p className="text-xs text-muted-foreground">Open Safari, paste the {platform.name} URL, tap Download. The file saves to your Files app automatically. No app installation needed.</p>
              </div>
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">🤖 Android</h3>
                <p className="text-xs text-muted-foreground">Works in Chrome and all Android browsers. Paste the link, tap Download, and the file saves to your Downloads folder instantly.</p>
              </div>
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">💻 PC / Mac</h3>
                <p className="text-xs text-muted-foreground">Fully browser-based — no software to install. Works on Windows, Mac, Linux, and Chromebooks. Just paste the URL and download.</p>
              </div>
            </div>
          </section>

          <AdSlot format="rectangle" />

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple mb-6">
              {h2s[4] || `Frequently Asked Questions — ${platform.name} Downloader`}
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

          {/* Related platforms */}
          <section className="mt-12">
            <h2 className="font-orbitron text-lg font-bold mb-4">Also Download From</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map(p => (
                <Link key={p.id} to={`/${basePath}/${p.slug}`} className="glass glass-hover p-4 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                      {type === 'audio' ? '🎵' : p.name[0]}
                    </div>
                    <span className="font-orbitron text-sm font-bold">{p.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.description.slice(0, 60)}…</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Language variants */}
          <section className="mt-8">
            <h3 className="font-orbitron text-sm font-bold mb-3 text-muted-foreground">Available in other languages:</h3>
            <div className="flex flex-wrap gap-2">
              {PSEO_LANGUAGES.filter(l => l.code !== currentLang).slice(0, 10).map(l => (
                <Link key={l.code} to={`/${l.code}/${basePath}/${platform.slug}`}
                  className="glass px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  {l.native}
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-8 text-center">
            <Link to={categoryLink} className="text-sm text-neon-cyan hover:underline">
              ← View all {type === 'audio' ? 'audio' : 'video'} platforms
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PSEOPage;
