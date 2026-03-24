import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import DownloadWidget from '@/components/DownloadWidget';
import AdSlot from '@/components/AdSlot';
import { AUDIO_PLATFORMS } from '@/data/platforms';

const SITE = 'https://socialmediavideodownload.com';

const filters = ['All', 'Music', 'Podcasts', 'India', 'Vietnam'];

const musicIds = ['soundcloud','spotify','apple-music','deezer','tidal','mixcloud','bandcamp','audiomack','audius','jiosaavn','gaana','zingmp3','nhaccuatui','hearthis','jamendo'];
const podcastIds = ['apple-podcasts','castbox','audioboom','acast','simplecast','spreaker'];

const AudioCategory: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const filtered = AUDIO_PLATFORMS.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Music') return musicIds.includes(p.id);
    if (filter === 'Podcasts') return podcastIds.includes(p.id);
    if (filter === 'India') return p.region === 'india';
    if (filter === 'Vietnam') return p.region === 'vietnam';
    return true;
  });

  const faq = [
    { q: 'How do I download music from streaming platforms?', a: 'Copy the song or track URL from any supported music platform, paste it into our download widget, and click Download. We support 21+ audio platforms.' },
    { q: 'Can I download Spotify songs for free?', a: 'Yes, public Spotify tracks can be downloaded using our tool without a Premium subscription.' },
    { q: 'What audio quality is available?', a: 'We provide the best available quality, typically MP3 320kbps, MP3 128kbps, or M4A format.' },
    { q: 'Can I download podcast episodes?', a: 'Yes! We support Apple Podcasts, Castbox, Audioboom, Acast, Simplecast, and Spreaker.' },
    { q: 'Is downloading music legal?', a: 'Downloading for personal use may be permitted in some jurisdictions. Please respect copyright and support artists.' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', name: 'Audio Downloader — Download Music & Podcasts Free', url: `${SITE}/audio-downloader` },
      { '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  return (
    <>
      <SEOHead
        title="Audio Downloader — Download Music & Podcasts Free"
        description="Free online audio downloader for SoundCloud, Spotify, Apple Music, JioSaavn, Gaana, Deezer and 20+ music and podcast platforms."
        canonical={`${SITE}/audio-downloader`}
        jsonLd={jsonLd}
      />

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold neon-text mb-3">
              🎵 Audio Downloader
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Free online audio downloader for SoundCloud, Spotify, Apple Music, JioSaavn, Gaana, Deezer and 20+ music and podcast platforms.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <DownloadWidget />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${filter === f ? 'neon-btn' : 'glass text-foreground/60 hover:text-foreground'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="glass p-4 text-center mb-8">
            <span className="font-orbitron text-2xl font-bold neon-text">{filtered.length}</span>
            <span className="text-sm text-muted-foreground ml-2">Audio Platforms {filter !== 'All' ? `(${filter})` : 'Supported'}</span>
          </div>

          <AdSlot format="responsive" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-8">
            {filtered.map(p => (
              <Link key={p.id} to={`/audio/${p.slug}`}
                className="glass glass-hover p-4 transition-all duration-300 block"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${p.color}40`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                    🎵
                  </div>
                  <h3 className="font-orbitron text-xs font-bold truncate">{p.name}</h3>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2">{p.description}</p>
                <span className="text-[10px] text-neon-cyan block mt-1">Download →</span>
              </Link>
            ))}
          </div>

          <section className="mt-16 max-w-3xl mx-auto">
            <h2 className="font-orbitron text-xl font-bold neon-text mb-6 text-center">How Audio Downloading Works</h2>
            <div className="glass p-6 space-y-4">
              <p className="text-sm text-foreground/80">Our audio downloader uses the same multi-layer extraction system as our video downloader. When you paste a music or podcast URL, our backend:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/80">
                <li>Identifies the audio platform automatically</li>
                <li>Extracts the direct audio stream URL via our API</li>
                <li>Provides download options in MP3, M4A, or FLAC format</li>
                <li>Your browser downloads directly — we never store your files</li>
              </ol>
            </div>
          </section>

          <section className="mt-12 max-w-3xl mx-auto">
            <h2 className="font-orbitron text-xl font-bold neon-text-purple text-center mb-6">FAQ</h2>
            <div className="space-y-3">
              {faq.map((f, i) => (
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
        </div>
      </div>
    </>
  );
};

export default AudioCategory;
