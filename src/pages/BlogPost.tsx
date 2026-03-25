import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import AdSlot from '@/components/AdSlot';
import { blogPosts } from '@/pages/BlogIndex';

const blogContent: Record<string, string> = {
  'tiktok-video-downloader-no-watermark-2025': `
TikTok has become one of the most popular social media platforms in the world, with billions of videos shared daily. Many users want to save their favorite TikTok videos for offline viewing, but the official app adds a watermark to every download.

## Why Remove the TikTok Watermark?

The TikTok watermark includes the app logo and the creator's username overlaid on the video. While this helps attribute the content, it can be distracting when you want to save a clean copy for personal use.

## How Our Tool Works

Our TikTok video downloader uses advanced extraction technology to fetch the original video file directly from TikTok's CDN servers. This means you get the exact same quality as the original upload, without any watermark overlay.

### Step-by-Step Guide

1. **Open TikTok** — Find the video you want to download
2. **Copy the Link** — Tap the Share button, then "Copy Link"
3. **Paste the URL** — Visit our site and paste the TikTok link
4. **Download** — Click "Download Now" and choose your quality

## Quality Options

We typically offer multiple quality options:
- **1080p HD** — Best quality, larger file size
- **720p** — Great balance of quality and size
- **Audio Only (MP3)** — Extract just the audio

## Is It Safe?

Yes! Our tool never stores your videos or personal data. We simply extract the direct CDN link and your browser downloads directly from TikTok's servers. We never touch the video bytes.

## Tips for Best Results

- Make sure the video is publicly available
- Use the share link directly from the TikTok app
- If a link doesn't work, try copying it again
- Private or deleted videos cannot be downloaded

## Frequently Asked Questions

**Can I download TikTok slideshows?** Yes, slideshow content is converted to video format and can be downloaded normally.

**Does it work with TikTok Stories?** Some TikTok Stories can be downloaded if they have a shareable link.

**Is this legal?** Downloading for personal use is generally permitted, but always respect the creator's rights and don't redistribute content commercially.
  `,
};

// Generate generic content for other posts
const getContent = (slug: string): string => {
  if (blogContent[slug]) return blogContent[slug];
  const post = blogPosts.find(p => p.slug === slug);
  return `
${post?.excerpt || ''}

## Overview

This comprehensive guide covers everything you need to know about this topic. Our team has tested multiple methods and tools to bring you the most reliable and up-to-date information.

## How It Works

Our video downloading tool uses a multi-layer extraction system that tries multiple methods to ensure the highest success rate. When you paste a URL, our backend:

1. Identifies the platform automatically
2. Tries our primary extraction method
3. Falls back to alternative methods if needed
4. Returns a direct CDN link for your browser to download

## Step-by-Step Instructions

1. Find the video you want to download on the social media platform
2. Copy the video's share link or URL
3. Paste it into our downloader input field
4. Click "Download Now"
5. Choose your preferred quality
6. Save the file to your device

## Tips for Best Results

- Always use the official share link from the app
- Make sure the video is publicly accessible
- If one link doesn't work, try copying it again
- Clear your browser cache if you experience issues

## Quality Options

We provide multiple quality options when available, including HD (1080p), Standard (720p), and sometimes audio-only (MP3) formats.

## Privacy & Safety

We take your privacy seriously. Our tool never stores your videos, doesn't require any personal information, and doesn't track your downloads. The video downloads happen directly between your browser and the platform's CDN servers.

## Conclusion

Downloading social media videos doesn't have to be complicated. Our free tool makes it simple, fast, and safe. Try it today and save your favorite videos for offline viewing.
  `;
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const content = slug ? getContent(slug) : '';
  const related = blogPosts.filter(p => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div className="relative z-10 pt-24 text-center">
        <h1 className="font-orbitron text-2xl">Post not found</h1>
        <Link to="/blog" className="text-neon-cyan text-sm mt-4 inline-block">← Back to Blog</Link>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'SMVD Team' },
  };

  // Convert markdown-like content to simple HTML
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) return <h2 key={i} className="font-orbitron text-lg font-bold neon-text-purple mt-8 mb-3">{trimmed.slice(3)}</h2>;
      if (trimmed.startsWith('### ')) return <h3 key={i} className="font-orbitron text-base font-bold mt-6 mb-2">{trimmed.slice(4)}</h3>;
      if (trimmed.startsWith('- **')) {
        const match = trimmed.match(/- \*\*(.+?)\*\* — (.+)/);
        if (match) return <li key={i} className="text-sm text-foreground/80 mb-1"><strong>{match[1]}</strong> — {match[2]}</li>;
      }
      if (trimmed.startsWith('- ')) return <li key={i} className="text-sm text-foreground/80 mb-1 ml-4">{trimmed.slice(2)}</li>;
      if (/^\d+\. /.test(trimmed)) return <li key={i} className="text-sm text-foreground/80 mb-1 ml-4 list-decimal">{trimmed.replace(/^\d+\. /, '')}</li>;
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) return <p key={i} className="text-sm font-bold mt-4 mb-1">{trimmed.slice(2, -2)}</p>;
      if (trimmed === '') return <br key={i} />;
      return <p key={i} className="text-sm text-foreground/80 leading-relaxed mb-2">{trimmed}</p>;
    });
  };

  return (
    <>
      <SEOHead title={post.title} description={post.excerpt} canonical={\`https://socialmediavideodownloader.com/blog/\${slug}\`} jsonLd={jsonLd} />
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-foreground">Blog</Link>
            <span>/</span>
            <span className="truncate">{post.title.slice(0, 40)}…</span>
          </div>

          {/* Header */}
          <h1 className="font-orbitron text-2xl md:text-3xl font-bold neon-text mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-8">
            <span>By SMVD Team</span>
            <span>{post.date}</span>
            <span>{post.readTime} read</span>
          </div>

          <AdSlot format="responsive" />

          {/* Content */}
          <article className="mt-6">
            {renderContent(content)}
          </article>

          <AdSlot format="responsive" />

          {/* Share */}
          <div className="mt-10 glass p-4 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Share:</span>
            {['WhatsApp', 'Reddit', 'Copy Link'].map(s => (
              <button key={s} className="glass px-3 py-1.5 text-xs text-foreground/60 hover:text-foreground transition-colors">{s}</button>
            ))}
          </div>

          {/* Related */}
          <div className="mt-12">
            <h3 className="font-orbitron text-lg font-bold mb-4">Related Posts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map(p => (
                <Link key={p.slug} to={\`/blog/\${p.slug}\`} className="glass glass-hover p-4 transition-all duration-300">
                  <span className="text-xs text-muted-foreground">{p.date}</span>
                  <h4 className="font-orbitron text-xs font-bold mt-1">{p.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
