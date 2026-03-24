import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import DownloadWidget from '@/components/DownloadWidget';
import AdSlot from '@/components/AdSlot';
import { platforms } from '@/lib/platforms';
import { supportedLanguages } from '@/i18n';

const SITE = 'https://socialmediavideodownloader.com';

const PlatformPage: React.FC = () => {
  const { platform: platformId, lang } = useParams<{ platform: string; lang?: string }>();
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    if (lang && supportedLanguages.some(l => l.code === lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const platform = platforms.find(p => p.id === platformId);
  if (!platform) return <div className="relative z-10 pt-24 text-center text-foreground">Platform not found</div>;

  const currentLang = lang || 'en';
  const canonical = lang ? `${SITE}/${lang}/download/${platformId}` : `${SITE}/download/${platformId}`;
  const hreflangs = supportedLanguages.map(l => ({
    lang: l.code,
    url: `${SITE}/${l.code}/download/${platformId}`,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `${platform.name} Video Downloader`,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
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
          { '@type': 'ListItem', position: 2, name: `${platform.name} Downloader`, item: canonical },
        ],
      },
    ],
  };

  const isYouTube = platform.id === 'youtube';
  const related = platforms.filter(p => p.id !== platformId && p.id !== 'youtube').slice(0, 3);

  return (
    <>
      <SEOHead
        title={`${platform.name} Video Downloader — Free, No Watermark, HD`}
        description={platform.description}
        canonical={canonical}
        lang={currentLang}
        hreflangs={hreflangs}
        jsonLd={jsonLd}
      />

      <div className="relative z-10 pt-24 pb-16 px-4" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">{t('nav_home')}</Link>
            <span>/</span>
            <span>{platform.name} Downloader</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${platform.color}20`, color: platform.color }}>
                {platform.name[0]}
              </div>
              {isYouTube && <span className="px-2 py-1 text-xs rounded-full bg-neon-pink/20 text-neon-pink font-bold">{t('badge_extension')}</span>}
            </div>
            <h1 className="font-orbitron text-2xl md:text-4xl font-bold neon-text mb-3">
              {platform.name} Video Downloader
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">{platform.description}</p>
          </div>

          {/* Widget */}
          <DownloadWidget forcePlatform={platformId} />

          <AdSlot format="responsive" />

          {/* How to download */}
          <section className="mt-16">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple mb-6">{t('how_to_download')} {platform.name} Videos</h2>
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
            <h2 className="font-orbitron text-xl font-bold neon-text mb-6">{t('features')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {platform.features.map((f, i) => (
                <div key={i} className="glass p-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color }} />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </section>

          <AdSlot format="rectangle" />

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple mb-6">FAQ</h2>
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

          {/* Related */}
          <section className="mt-12">
            <h2 className="font-orbitron text-lg font-bold mb-4">{t('related_platforms')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map(p => (
                <Link key={p.id} to={`/download/${p.id}`} className="glass glass-hover p-4 transition-all duration-300">
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
        </div>
      </div>
    </>
  );
};

export default PlatformPage;
