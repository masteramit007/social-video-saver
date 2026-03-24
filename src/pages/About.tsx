import React from 'react';
import SEOHead from '@/components/SEOHead';

const About: React.FC = () => (
  <>
    <SEOHead title="About Us" description="Learn about SocialMediaVideoDownloader.com — the free, fast, and reliable video downloader for 12+ social media platforms." canonical="https://socialmediavideodownloader.com/about" />
    <div className="relative z-10 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-orbitron text-3xl font-bold neon-text mb-8">About Us</h1>
        <div className="glass p-8 space-y-4">
          <p className="text-sm text-foreground/80 leading-relaxed">SocialMediaVideoDownloader.com is a free online tool that lets you download videos from 12+ social media platforms including TikTok, Instagram, Twitter/X, Facebook, Bilibili, Reddit, and more.</p>
          <p className="text-sm text-foreground/80 leading-relaxed">Our mission is to provide the fastest, most reliable video downloading experience without any registration, fees, or watermarks. We believe everyone should be able to save their favorite content for offline viewing.</p>
          <h2 className="font-orbitron text-xl font-bold neon-text-purple pt-4">How It Works</h2>
          <p className="text-sm text-foreground/80 leading-relaxed">When you paste a video URL, our backend extracts the direct CDN link from the platform. Your browser then downloads the video directly from the platform's servers. We never store, cache, or process the actual video files — ensuring maximum speed and privacy.</p>
          <h2 className="font-orbitron text-xl font-bold neon-text-purple pt-4">Our Values</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-foreground/80">
            <li><strong>Privacy First</strong> — We don't track users or store any video data</li>
            <li><strong>Always Free</strong> — No hidden fees, subscriptions, or premium tiers</li>
            <li><strong>No Registration</strong> — Use instantly without creating an account</li>
            <li><strong>Reliable</strong> — Multi-layer extraction system for maximum uptime</li>
          </ul>
        </div>
      </div>
    </div>
  </>
);

export default About;
