import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ChevronDown, Search } from 'lucide-react';
import { VIDEO_PLATFORMS, AUDIO_PLATFORMS, getPopularVideoPlatforms, getWatermarkFreePlatforms, getVideoPlatformsByRegion } from '@/data/platforms';
import { REGIONS } from '@/data/regions';
import { supportedLanguages } from '@/i18n';

const musicIds = ['spotify','apple-music','soundcloud','deezer','tidal','bandcamp','audiomack'];
const podcastIds = ['apple-podcasts','castbox','audioboom','acast','spreaker','simplecast'];
const regionalAudioIds = ['jiosaavn','gaana','zingmp3','nhaccuatui'];

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocusIdx, setSearchFocusIdx] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const popularVideo = getPopularVideoPlatforms();
  const watermarkFree = getWatermarkFreePlatforms();
  const allVideo = VIDEO_PLATFORMS;
  const regionsWithCounts = REGIONS.map(r => ({ ...r, count: getVideoPlatformsByRegion(r.id).length }))
    .filter(r => r.count > 0);

  const musicPlatforms = AUDIO_PLATFORMS.filter(p => musicIds.includes(p.id));
  const podcastPlatforms = AUDIO_PLATFORMS.filter(p => podcastIds.includes(p.id));
  const regionalAudio = AUDIO_PLATFORMS.filter(p => regionalAudioIds.includes(p.id));

  // Searchable index: video + audio platforms + regions
  const searchIndex = useMemo(() => {
    const items: Array<{ name: string; type: string; href: string; color?: string; flag?: string }> = [];
    VIDEO_PLATFORMS.forEach(p => items.push({ name: p.name, type: 'Video', href: `/download/${p.slug}`, color: p.color }));
    AUDIO_PLATFORMS.forEach(p => items.push({ name: p.name, type: 'Audio', href: `/audio/${p.slug}`, color: p.color }));
    REGIONS.forEach(r => items.push({ name: r.name, type: 'Region', href: `/download/${r.id}`, flag: r.flag }));
    return items;
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .filter(i => i.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [searchQuery, searchIndex]);

  useEffect(() => { setSearchFocusIdx(0); }, [searchQuery]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSearchFocusIdx(i => Math.min(i + 1, searchResults.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSearchFocusIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && searchResults[searchFocusIdx]) {
      navigate(searchResults[searchFocusIdx].href);
      setSearchQuery(''); setSearchOpen(false); setMenuOpen(false);
    } else if (e.key === 'Escape') { setSearchOpen(false); }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-foreground/5' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-orbitron font-bold text-xl bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">SMVD</span>
          <span className="text-xs text-muted-foreground hidden lg:block">Video & Audio Downloader</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {/* VIDEO Dropdown */}
          <div className="relative" onMouseEnter={() => setVideoOpen(true)} onMouseLeave={() => setVideoOpen(false)}>
            <button className="px-3 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
              📹 Video <ChevronDown className="w-3 h-3" />
            </button>
            {videoOpen && (
              <div className="absolute top-full left-0 mt-1 glass p-5 w-[680px] grid grid-cols-3 gap-4 rounded-xl border border-foreground/10 max-h-[70vh] overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold text-neon-cyan mb-2 font-orbitron">Popular ({popularVideo.length})</h4>
                  {popularVideo.map(p => (
                    <Link key={p.id} to={`/download/${p.slug}`} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neon-cyan mb-2 font-orbitron">Watermark-Free</h4>
                  {watermarkFree.map(p => (
                    <Link key={p.id} to={`/download/${p.slug}`} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      {p.name}
                    </Link>
                  ))}
                  <Link to="/watermark-free-downloader" className="text-xs text-neon-cyan mt-2 block px-2">All Watermark-Free →</Link>

                  <h4 className="text-xs font-bold text-neon-cyan mb-2 mt-4 font-orbitron">By Region ({regionsWithCounts.length})</h4>
                  {regionsWithCounts.map(r => (
                    <Link key={r.id} to={`/download/${r.id}`} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-foreground/5">
                      {r.flag} {r.name} <span className="text-xs text-foreground/40">({r.count})</span>
                    </Link>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neon-cyan mb-2 font-orbitron">All Platforms ({allVideo.length})</h4>
                  {allVideo.map(p => (
                    <Link key={p.id} to={`/download/${p.slug}`} className="flex items-center gap-2 text-xs text-foreground/60 hover:text-foreground px-2 py-1 rounded-lg hover:bg-foreground/5 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </Link>
                  ))}
                  <Link to="/video-downloader" className="text-xs text-neon-cyan mt-2 block px-2">View All Page →</Link>
                </div>
              </div>
            )}
          </div>

          {/* AUDIO Dropdown */}
          <div className="relative" onMouseEnter={() => setAudioOpen(true)} onMouseLeave={() => setAudioOpen(false)}>
            <button className="px-3 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
              🎵 Audio <ChevronDown className="w-3 h-3" />
            </button>
            {audioOpen && (
              <div className="absolute top-full left-0 mt-1 glass p-5 min-w-[440px] grid grid-cols-3 gap-4 rounded-xl border border-foreground/10">
                <div>
                  <h4 className="text-xs font-bold text-neon-cyan mb-2 font-orbitron">Music</h4>
                  {musicPlatforms.map(p => (
                    <Link key={p.id} to={`/audio/${p.slug}`} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neon-cyan mb-2 font-orbitron">Podcasts</h4>
                  {podcastPlatforms.map(p => (
                    <Link key={p.id} to={`/audio/${p.slug}`} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neon-cyan mb-2 font-orbitron">Regional</h4>
                  {regionalAudio.map(p => (
                    <Link key={p.id} to={`/audio/${p.slug}`} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </Link>
                  ))}
                  <Link to="/audio-downloader" className="text-xs text-neon-cyan mt-2 block px-2">All Audio →</Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/blog" className="px-3 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors">{t('nav_blog')}</Link>
          <Link to="/about" className="px-3 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors">{t('nav_about')}</Link>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {/* Search bar */}
          <div ref={searchRef} className="relative">
            <div className="flex items-center gap-2 glass border border-foreground/10 rounded-full px-3 py-1.5 w-56 focus-within:border-neon-cyan/50 transition-colors">
              <Search className="w-3.5 h-3.5 text-foreground/50 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleSearchKey}
                placeholder="Search platforms..."
                className="bg-transparent text-sm text-foreground placeholder:text-foreground/40 outline-none w-full"
              />
            </div>
            {searchOpen && searchQuery.trim() && (
              <div className="absolute right-0 top-full mt-2 glass rounded-xl border border-foreground/10 w-72 max-h-80 overflow-y-auto p-2 z-50">
                {searchResults.length === 0 ? (
                  <div className="text-sm text-foreground/50 px-3 py-2">No matches</div>
                ) : searchResults.map((r, idx) => (
                  <Link
                    key={r.href}
                    to={r.href}
                    onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${idx === searchFocusIdx ? 'bg-foreground/10 text-foreground' : 'text-foreground/70 hover:bg-foreground/5'}`}
                  >
                    {r.flag ? <span>{r.flag}</span> : <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />}
                    <span className="flex-1">{r.name}</span>
                    <span className="text-xs text-foreground/40">{r.type}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground">
              <Globe className="w-4 h-4" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 glass p-2 max-h-64 overflow-y-auto min-w-[180px] rounded-xl border border-foreground/10">
                {supportedLanguages.map(l => (
                  <button key={l.code} onClick={() => changeLang(l.code)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors ${i18n.language === l.code ? 'text-neon-cyan' : 'text-foreground/70'}`}>
                    {l.flag} {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 glass z-40 p-6 flex flex-col gap-4 overflow-y-auto">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-lg text-foreground/80 hover:text-foreground">{t('nav_home')}</Link>
          
          <div className="text-sm font-orbitron text-neon-cyan font-bold mt-2">📹 Video Platforms ({allVideo.length})</div>
          <div className="grid grid-cols-2 gap-1 max-h-[40vh] overflow-y-auto pr-1">
            {allVideo.map(p => (
              <Link key={p.id} to={`/download/${p.slug}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground py-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                {p.name}
              </Link>
            ))}
          </div>
          <Link to="/video-downloader" onClick={() => setMenuOpen(false)} className="text-sm text-neon-cyan">All Video Platforms Page →</Link>

          <div className="text-sm font-orbitron text-neon-cyan font-bold mt-2">🎵 Audio Platforms</div>
          <div className="grid grid-cols-2 gap-1">
            {musicPlatforms.slice(0, 6).map(p => (
              <Link key={p.id} to={`/audio/${p.slug}`} onClick={() => setMenuOpen(false)} className="text-sm text-foreground/70 hover:text-foreground py-1">{p.name}</Link>
            ))}
          </div>
          <Link to="/audio-downloader" onClick={() => setMenuOpen(false)} className="text-sm text-neon-cyan">All Audio Platforms →</Link>

          <Link to="/blog" onClick={() => setMenuOpen(false)} className="text-lg text-foreground/80 hover:text-foreground mt-2">{t('nav_blog')}</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="text-lg text-foreground/80 hover:text-foreground">{t('nav_about')}</Link>

          <div className="mt-4 border-t border-foreground/10 pt-4">
            <div className="text-sm text-foreground/50 mb-2">Language</div>
            <div className="grid grid-cols-2 gap-1">
              {supportedLanguages.slice(0, 10).map(l => (
                <button key={l.code} onClick={() => { changeLang(l.code); setMenuOpen(false); }}
                  className="text-sm text-left text-foreground/70 hover:text-foreground py-1">
                  {l.flag} {l.name}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;
