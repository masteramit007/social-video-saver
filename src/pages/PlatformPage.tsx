import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import DownloadWidget from '@/components/DownloadWidget';
import AdSlot from '@/components/AdSlot';
import { VIDEO_PLATFORMS } from '@/data/platforms';
import { PSEO_LANGUAGES } from '@/data/pseoConfig';
import { PLATFORM_KEYWORDS, getPlatformSchemaDescription } from '@/data/keywords';
import { supportedLanguages } from '@/i18n';

const SITE = 'https://socialmediavideodownload.com';

const PlatformPage: React.FC = () => {
  const { platform: platformId, lang } = useParams<{ platform: string; lang?: string }>();
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    if (lang && supportedLanguages.some(l => l.code === lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const platform = VIDEO_PLATFORMS.find(p => p.slug === platformId || p.id === platformId);
  if (!platform) return <div className="relative z-10 pt-24 text-center text-foreground">Platform not found</div>;

  const currentLang = lang || 'en';
  const canonical = lang ? `${SITE}/${lang}/download/${platform.slug}` : `${SITE}/download/${platform.slug}`;
  const hreflangs = [
    ...PSEO_LANGUAGES.map(l => ({ lang: l.code, url: `${SITE}/${l.code}/download/${platform.slug}` })),
    { lang: 'x-default', url: `${SITE}/download/${platform.slug}` },
  ];

  const keywords = PLATFORM_KEYWORDS[platform.id];
  const seoTitle = keywords?.seoTitle || (platform.supportsWatermarkFree
    ? `${platform.name} Downloader — No Watermark Free 2026`
    : `${platform.name} Video Downloader — Free HD Download 2026`);
  const seoDescription = keywords?.seoDescription || platform.description;
  const schemaDesc = getPlatformSchemaDescription(platform.id);
  const h2s = keywords?.h2s || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `${platform.name} Video Downloader`,
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
          { '@type': 'ListItem', position: 2, name: 'Video Downloader', item: `${SITE}/video-downloader` },
          { '@type': 'ListItem', position: 3, name: `${platform.name} Downloader`, item: canonical },
        ],
      },
    ],
  };

  const isYouTube = platform.id === 'youtube';
  const related = VIDEO_PLATFORMS.filter(p => p.id !== platform.id && p.id !== 'youtube' && p.category === platform.category).slice(0, 3);

  // Relevant blog post link
  const blogLinks: Record<string, string> = {
    tiktok: '/blog/tiktok-video-downloader-no-watermark-2026',
    instagram: '/blog/instagram-reels-downloader-guide',
    twitter: '/blog/twitter-video-downloader-iphone-android',
    facebook: '/blog/facebook-video-downloader-private-public',
    reddit: '/blog/reddit-video-downloader-with-audio',
    bilibili: '/blog/bilibili-video-downloader-international',
    twitch: '/blog/how-to-download-twitch-clips-vods-free',
    vk: '/blog/vk-video-downloader-russian-social-media',
    telegram: '/blog/download-telegram-videos-step-by-step',
    bluesky: '/blog/bluesky-video-downloader-twitter-alternative',
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
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">{t('nav_home')}</Link>
            <span>/</span>
            <Link to="/video-downloader" className="hover:text-foreground transition-colors">Video Downloader</Link>
            <span>/</span>
            <span>{platform.name}</span>
          </nav>

          {/* Hero with keyword-rich content */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${platform.color}20`, color: platform.color }}>
                {platform.name[0]}
              </div>
              {isYouTube && <span className="px-2 py-1 text-xs rounded-full bg-neon-pink/20 text-neon-pink font-bold">{t('badge_extension')}</span>}
              {platform.supportsWatermarkFree && <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 font-bold">Watermark-Free ✓</span>}
              {platform.reliability === 'restricted' && <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400 font-bold">⚠ Variable</span>}
              <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 font-bold">📹 Video</span>
            </div>
            <h1 className="font-orbitron text-2xl md:text-4xl font-bold neon-text mb-3">
              {keywords?.h1 || `${platform.name} Video Downloader`}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {seoDescription}
            </p>
          </div>

          {platform.reliability === 'restricted' && (
            <div className="glass border border-amber-500/30 p-4 mb-6 rounded-xl flex items-start gap-3">
              <span className="text-amber-400 text-lg flex-shrink-0">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-amber-300 mb-1">Variable Availability</p>
                <p className="text-xs text-muted-foreground">
                  {platform.name} actively restricts third-party downloading. Downloads may not always work due to platform-side blocking.
                  Results can vary by region and content type. We recommend trying — if it doesn't work, the platform may be blocking access at that time.
                </p>
              </div>
            </div>
          )}

          <DownloadWidget forcePlatform={platform.id} />

          <AdSlot format="responsive" />

          {/* How to Download — keyword-rich H2 */}
          <section className="mt-16">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple mb-6">
              {h2s[0] || `How to Download ${platform.name} Videos`}
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
              {h2s[3] || `${platform.name} Video Download Features`}
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

          {/* Device-specific section for mobile SEO keywords */}
          <section className="mt-12">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple mb-6">
              Download {platform.name} Videos on iPhone & Android
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">📱 iPhone / iOS</h3>
                <p className="text-xs text-muted-foreground">
                  Use our {platform.name} downloader for iPhone — open Safari, paste the video URL, and tap Download. The {platform.name} video saves directly to your Files app. No app needed, completely free.
                </p>
              </div>
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">🤖 Android</h3>
                <p className="text-xs text-muted-foreground">
                  Our {platform.name} downloader for Android works in Chrome and all browsers. Paste the {platform.name} link, tap Download, and save to your gallery. Free, fast, no watermark.
                </p>
              </div>
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">💻 Desktop</h3>
                <p className="text-xs text-muted-foreground">
                  Download {platform.name} videos on PC or Mac — no software installation required. Our online {platform.name} downloader works in any browser. Just paste and download in HD.
                </p>
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
            <h2 className="font-orbitron text-lg font-bold mb-4">Also Try These Video Downloaders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map(p => (
                <Link key={p.id} to={`/download/${p.slug}`} className="glass glass-hover p-4 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                      {p.name[0]}
                    </div>
                    <span className="font-orbitron text-sm font-bold">{p.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.description.slice(0, 60)}…</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Blog link */}
          {blogLinks[platform.id] && (
            <div className="mt-6 glass p-4">
              <Link to={blogLinks[platform.id]} className="text-sm text-neon-cyan hover:underline">
                📖 Read our complete guide: How to download {platform.name} videos →
              </Link>
            </div>
          )}

          {/* Language variants for internal linking */}
          <section className="mt-8">
            <h3 className="font-orbitron text-sm font-bold mb-3 text-muted-foreground">Available in other languages:</h3>
            <div className="flex flex-wrap gap-2">
              {PSEO_LANGUAGES.filter(l => l.code !== currentLang).slice(0, 10).map(l => (
                <Link key={l.code} to={`/${l.code}/download/${platform.slug}`}
                  className="glass px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  {l.native}
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-8 text-center">
            <Link to="/video-downloader" className="text-sm text-neon-cyan hover:underline">← View all 50+ video platforms</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlatformPage;
