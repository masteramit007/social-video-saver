import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import DownloadWidget from '@/components/DownloadWidget';
import { getVideoPlatformsByRegion } from '@/data/platforms';
import { REGION_BY_ID, REGIONS } from '@/data/regions';

const SITE = 'https://socialmediavideodownload.com';

const RegionPage: React.FC = () => {
  const params = useParams<{ region?: string; platform?: string }>();
  const region = params.region || params.platform;
  const meta = region ? REGION_BY_ID[region] : null;

  if (!meta) return <div className="relative z-10 pt-24 text-center text-foreground">Region not found</div>;

  const platforms = getVideoPlatformsByRegion(region!);
  const otherRegions = REGIONS.filter(r => r.id !== meta.id);

  return (
    <>
      <SEOHead
        title={meta.title}
        description={meta.description}
        canonical={`${SITE}/download/${region}`}
      />

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/video-downloader" className="hover:text-foreground">Video Downloader</Link>
            <span>/</span>
            <span>{meta.flag} {meta.name}</span>
          </div>

          <div className="text-center mb-10">
            <span className="text-4xl mb-4 block">{meta.flag}</span>
            <h1 className="font-orbitron text-2xl md:text-4xl font-bold neon-text mb-3">{meta.name} Video Downloaders</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{meta.description}</p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <DownloadWidget />
          </div>

          {platforms.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>No platforms listed yet for this region. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map(p => (
                <Link key={p.id} to={`/download/${p.slug}`}
                  className="glass glass-hover p-6 transition-all duration-300 block"
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${p.color}40`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
                      {p.name[0]}
                    </div>
                    <div>
                      <h3 className="font-orbitron text-sm font-bold">{p.name}</h3>
                      {p.supportsWatermarkFree && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold">Watermark-Free ✓</span>}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                  <span className="text-xs text-neon-cyan block mt-2">Download →</span>
                </Link>
              ))}
            </div>
          )}

          {/* Cross-link to other regions for SEO + UX */}
          <div className="mt-16 pt-8 border-t border-foreground/5">
            <h2 className="font-orbitron text-sm font-bold mb-4 text-foreground/80">Explore Other Regions</h2>
            <div className="flex flex-wrap gap-2">
              {otherRegions.map(r => (
                <Link key={r.id} to={`/download/${r.id}`}
                  className="text-sm glass px-3 py-1.5 rounded-full hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors">
                  {r.flag} {r.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegionPage;
