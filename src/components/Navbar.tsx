import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { platforms } from '@/lib/platforms';
import { supportedLanguages } from '@/i18n';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [platformsOpen, setPlatformsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-foreground/5' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-orbitron font-bold text-xl bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">SMVD</span>
          <span className="text-xs text-muted-foreground hidden sm:block">Video Downloader</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-foreground/70 hover:text-foreground transition-colors">{t('nav_home')}</Link>
          
          <div className="relative" onMouseEnter={() => setPlatformsOpen(true)} onMouseLeave={() => setPlatformsOpen(false)}>
            <button className="text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
              {t('nav_platforms')} <ChevronDown className="w-3 h-3" />
            </button>
            {platformsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass p-4 grid grid-cols-3 gap-2 min-w-[360px]">
                {platforms.map(p => (
                  <Link key={p.id} to={`/download/${p.id}`} className="text-sm text-foreground/70 hover:text-foreground px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors whitespace-nowrap">
                    {p.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <Link to="/blog" className="text-sm text-foreground/70 hover:text-foreground transition-colors">{t('nav_blog')}</Link>
          <Link to="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors">{t('nav_about')}</Link>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground">
              <Globe className="w-4 h-4" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 glass p-2 max-h-64 overflow-y-auto min-w-[180px]">
                {supportedLanguages.map(l => (
                  <button key={l.code} onClick={() => changeLang(l.code)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors ${i18n.language === l.code ? 'text-neon-cyan' : 'text-foreground/70'}`}>
                    {l.flag} {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to="/" className="neon-btn px-4 py-2 text-sm">{t('nav_try')}</Link>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 glass z-40 p-6 flex flex-col gap-4 overflow-y-auto">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-lg text-foreground/80 hover:text-foreground">{t('nav_home')}</Link>
          <div className="text-lg text-foreground/50 font-orbitron text-sm mt-2">{t('nav_platforms')}</div>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map(p => (
              <Link key={p.id} to={`/download/${p.id}`} onClick={() => setMenuOpen(false)} className="text-sm text-foreground/70 hover:text-foreground py-1">
                {p.name}
              </Link>
            ))}
          </div>
          <Link to="/blog" onClick={() => setMenuOpen(false)} className="text-lg text-foreground/80 hover:text-foreground">{t('nav_blog')}</Link>
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
