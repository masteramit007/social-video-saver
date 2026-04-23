import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { VIDEO_PLATFORMS, AUDIO_PLATFORMS, getVideoPlatformsByRegion } from '@/data/platforms';
import { REGIONS } from '@/data/regions';
import { supportedLanguages } from '@/i18n';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const allVideo = VIDEO_PLATFORMS;
  const allAudio = AUDIO_PLATFORMS;

  return (
    <footer className="relative z-10 mt-20 border-t border-foreground/5">
      <div className="container mx-auto px-4 py-12">
        {/* Full platform grid — every supported platform, fully indexable */}
        <div className="mb-10">
          <h3 className="font-orbitron text-sm font-bold mb-4 text-foreground/80">📹 All {allVideo.length} Video Platforms We Support</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-1.5">
            {allVideo.map(p => (
              <Link key={p.id} to={`/download/${p.slug}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                {p.name}
              </Link>
            ))}
          </div>

          {allAudio.length > 0 && (
            <>
              <h3 className="font-orbitron text-sm font-bold mb-4 mt-8 text-foreground/80">🎵 Audio Platforms ({allAudio.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-1.5">
                {allAudio.map(p => (
                  <Link key={p.id} to={`/audio/${p.slug}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-foreground/5">
          {/* About */}
          <div>
            <span className="font-orbitron font-bold text-lg bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">SMVD</span>
            <p className="text-sm text-muted-foreground mt-2">{t('footer_tagline')}</p>
            <p className="text-xs text-muted-foreground mt-4">Download videos & audio from {VIDEO_PLATFORMS.length}+ platforms for free.</p>
          </div>

          {/* By Region */}
          <div>
            <h4 className="font-orbitron text-sm font-bold mb-3 text-foreground/80">By Region</h4>
            <div className="flex flex-col gap-1">
              <Link to="/download/china" className="text-sm text-muted-foreground hover:text-foreground transition-colors">🇨🇳 China Platforms</Link>
              <Link to="/download/india" className="text-sm text-muted-foreground hover:text-foreground transition-colors">🇮🇳 India Platforms</Link>
              <Link to="/download/russia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">🇷🇺 Russia Platforms</Link>
              <Link to="/watermark-free-downloader" className="text-sm text-muted-foreground hover:text-foreground transition-colors">🌍 Watermark-Free Tools</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-orbitron text-sm font-bold mb-3 text-foreground/80">Resources</h4>
            <div className="flex flex-col gap-1">
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
              <Link to="/sitemap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sitemap</Link>
              <a href="/rss.xml" className="text-sm text-muted-foreground hover:text-foreground transition-colors">RSS Feed</a>
              {supportedLanguages.slice(0, 5).map(l => (
                <Link key={l.code} to={`/${l.code}/download/tiktok`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {l.flag} {l.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-foreground/5 text-center">
          <p className="text-xs text-muted-foreground">© 2026 SocialMediaVideoDownload.com</p>
          <p className="text-xs text-muted-foreground/80 mt-1">Supports {VIDEO_PLATFORMS.length}+ video platforms and {AUDIO_PLATFORMS.length} audio platforms</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Not affiliated with any social media platform</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
