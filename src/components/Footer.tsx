import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { platforms } from '@/lib/platforms';
import { supportedLanguages } from '@/i18n';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 mt-20 border-t border-foreground/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <span className="font-orbitron font-bold text-lg bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">SMVD</span>
            <p className="text-sm text-muted-foreground mt-2">{t('footer_tagline')}</p>
            <p className="text-xs text-muted-foreground mt-4">Download videos from 12+ social media platforms for free.</p>
          </div>

          {/* Platforms */}
          <div>
            <h4 className="font-orbitron text-sm font-bold mb-3 text-foreground/80">{t('nav_platforms')}</h4>
            <div className="flex flex-col gap-1">
              {platforms.map(p => (
                <Link key={p.id} to={`/download/${p.id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {p.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-orbitron text-sm font-bold mb-3 text-foreground/80">Languages</h4>
            <div className="flex flex-col gap-1">
              {supportedLanguages.slice(0, 10).map(l => (
                <Link key={l.code} to={`/${l.code}/download/tiktok`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {l.flag} {l.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-orbitron text-sm font-bold mb-3 text-foreground/80">Legal</h4>
            <div className="flex flex-col gap-1">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
              <Link to="/sitemap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-foreground/5 text-center">
          <p className="text-xs text-muted-foreground">© 2025 SocialMediaVideoDownloader.com — {t('footer_tagline')}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">{t('footer_disclaimer', { defaultValue: 'Not affiliated with TikTok, Instagram, Twitter, Meta, or Bilibili' })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
