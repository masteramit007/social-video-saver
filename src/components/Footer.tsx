import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { VIDEO_PLATFORMS, AUDIO_PLATFORMS, getPopularVideoPlatforms, getPopularAudioPlatforms } from '@/data/platforms';
import { supportedLanguages } from '@/i18n';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const topVideo = getPopularVideoPlatforms().slice(0, 10);
  const topAudio = getPopularAudioPlatforms().slice(0, 10);

  return (
    <footer className="relative z-10 mt-20 border-t border-foreground/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About */}
          <div>
            <span className="font-orbitron font-bold text-lg bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">SMVD</span>
            <p className="text-sm text-muted-foreground mt-2">{t('footer_tagline')}</p>
            <p className="text-xs text-muted-foreground mt-4">Download videos & audio from {VIDEO_PLATFORMS.length}+ platforms for free.</p>
          </div>

          {/* Video Downloaders */}
          <div>
            <h4 className="font-orbitron text-sm font-bold mb-3 text-foreground/80">📹 Video Downloaders</h4>
            <div className="flex flex-col gap-1">
              {topVideo.map(p => (
                <Link key={p.id} to={`/download/${p.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {p.name}
                </Link>
              ))}
              <Link to="/video-downloader" className="text-xs text-neon-cyan mt-1">View all {VIDEO_PLATFORMS.length}+ video platforms →</Link>
            </div>
          </div>

          {/* Audio Downloaders */}
          <div>
            <h4 className="font-orbitron text-sm font-bold mb-3 text-foreground/80">🎵 Audio Downloaders</h4>
            <div className="flex flex-col gap-1">
              {topAudio.map(p => (
                <Link key={p.id} to={`/audio/${p.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {p.name}
                </Link>
              ))}
              <Link to="/audio-downloader" className="text-xs text-neon-cyan mt-1">View all {AUDIO_PLATFORMS.length} audio platforms →</Link>
            </div>
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
