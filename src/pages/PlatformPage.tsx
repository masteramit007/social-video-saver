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
  const h2s = keywords?.h2s || [];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
        lang={currentLang}
        hreflangs={hreflangs}
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

          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="font-orbitron text-2xl md:text-4xl font-bold neon-text mb-3">
              {keywords?.h1 || `${platform.name} Video Downloader`}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">{seoDescription}</p>
          </div>

          <DownloadWidget forcePlatform={platform.id} />

          <AdSlot format="responsive" />

          {/* 1. Quick Steps */}
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

          {/* 2. THE NEW SEO CONTENT BLOCK (300+ Words) */}
          <section className="mt-16 glass p-8 border-l-4 border-neon-cyan">
            <h2 className="font-orbitron text-2xl font-bold neon-text mb-6">
              The Ultimate Guide to {platform.name} Video Saving in 2026
            </h2>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-4 text-sm leading-relaxed">
              <p>
                Are you looking for a reliable way to save content from <strong>{platform.name}</strong>? 
                Whether you're a content creator looking to archive your own work or a fan wanting to watch 
                videos offline, our {platform.name} downloader provides a seamless, high-speed solution. 
                In 2026, social media platforms have made it increasingly difficult to save media directly, 
                but our tool bypasses these restrictions to give you clean MP4 and MP3 files.
              </p>
              
              <h3 className="text-foreground font-bold text-lg mt-6">Why Choose Our {platform.name} Saver?</h3>
              <p>
                Unlike many other tools, we prioritize your privacy and device safety. Our 
                <strong> {platform.name} video downloader</strong> requires no software installation, no browser 
                extensions, and absolutely no registration. This means you can download {platform.name} videos 
                without exposing your personal data or login credentials. Our servers handle the heavy 
                processing, ensuring that you get the highest possible resolution available—ranging from 
                720p and 1080p up to 4K where supported.
              </p>

              <h3 className="text-foreground font-bold text-lg mt-6">Is it possible to download {platform.name} videos without watermarks?</h3>
              <p>
                {platform.supportsWatermarkFree 
                  ? `Yes! Our tool specifically supports watermark-free downloads for ${platform.name}. This is essential for users who want to repurpose content or enjoy a clean viewing experience without distracting logos covering the video.`
                  : `Currently, we fetch the highest quality stream directly from ${platform.name}. While some videos may contain platform-embedded logos, our tool ensures the video bit-rate remains uncompressed for the best visual quality.`
                }
              </p>

              <h3 className="text-foreground font-bold text-lg mt-6">Compatible with All Devices</h3>
              <p>
                Our web-based approach means this tool is a universal <strong>{platform.name} downloader for iPhone, 
                Android, Mac, and PC</strong>. If you are on mobile, simply use your browser (Safari or Chrome) 
                to paste the link and save the file directly to your camera roll or downloads folder. On desktop, 
                the process is even faster, allowing for instant "Save As" functionality.
              </p>
            </div>
          </section>

          {/* 3. Existing Device Section */}
          <section className="mt-12">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple mb-6">
              Download {platform.name} Videos on iPhone & Android
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">📱 iPhone / iOS</h3>
                <p className="text-xs text-muted-foreground">
                  Use Safari to paste the video URL. The {platform.name} video saves directly to your Files app.
                </p>
              </div>
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">🤖 Android</h3>
                <p className="text-xs text-muted-foreground">
                  Works in Chrome. Paste the {platform.name} link, tap Download, and save to your gallery.
                </p>
              </div>
              <div className="glass p-4">
                <h3 className="font-orbitron text-sm font-bold mb-2">💻 Desktop</h3>
                <p className="text-xs text-muted-foreground">
                  No software required. Just paste and download {platform.name} in HD on PC or Mac.
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

          {/* Language Variants */}
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
        </div>
      </div>
    </>
  );
};

export default PlatformPage;