import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { platforms } from '@/lib/platforms';
import { blogPosts } from '@/pages/BlogIndex';

const SitemapPage: React.FC = () => (
  <>
    <SEOHead title="Sitemap" description="Complete sitemap of SocialMediaVideoDownloader.com" canonical="https://socialmediavideodownloader.com/sitemap" />
    <div className="relative z-10 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-orbitron text-3xl font-bold neon-text mb-8">Sitemap</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-6">
            <h2 className="font-orbitron text-sm font-bold mb-3">Main Pages</h2>
            <div className="space-y-1">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground block">Home</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground block">About</Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground block">Blog</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground block">Contact</Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground block">Privacy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground block">Terms</Link>
            </div>
          </div>
          <div className="glass p-6">
            <h2 className="font-orbitron text-sm font-bold mb-3">Platform Downloaders</h2>
            <div className="space-y-1">
              {platforms.map(p => (
                <Link key={p.id} to={`/download/${p.id}`} className="text-sm text-muted-foreground hover:text-foreground block">{p.name} Downloader</Link>
              ))}
            </div>
          </div>
          <div className="glass p-6 md:col-span-2">
            <h2 className="font-orbitron text-sm font-bold mb-3">Blog Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {blogPosts.map(p => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="text-sm text-muted-foreground hover:text-foreground block truncate">{p.title}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default SitemapPage;
