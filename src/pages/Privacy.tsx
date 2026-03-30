import React from 'react';
import SEOHead from '@/components/SEOHead';

const Privacy: React.FC = () => (
  <>
    <SEOHead title="Privacy Policy" description="Privacy policy for SocialMediaVideoDownloader.com. Learn how we handle your data." canonical="https://socialmediavideodownloader.com/privacy" />
    <div className="relative z-10 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-orbitron text-3xl font-bold neon-text mb-8">Privacy Policy</h1>
        <div className="glass p-8 space-y-4 text-sm text-foreground/80 leading-relaxed">
          <p><strong>Last updated:</strong> January 1, 2026</p>
          <h2 className="font-orbitron text-lg font-bold neon-text-purple pt-4">Information We Collect</h2>
          <p>We do not collect personal information. We do not require registration, email addresses, or any personal data to use our service.</p>
          <h2 className="font-orbitron text-lg font-bold neon-text-purple pt-4">Video Data</h2>
          <p>We do not download, store, cache, or process any video files. Our service only extracts direct CDN URLs. Videos are downloaded directly by your browser from the platform's servers.</p>
          <h2 className="font-orbitron text-lg font-bold neon-text-purple pt-4">Cookies</h2>
          <p>We use minimal cookies for basic functionality such as language preference and cookie consent. No tracking cookies are used.</p>
          <h2 className="font-orbitron text-lg font-bold neon-text-purple pt-4">Analytics</h2>
          <p>We may use privacy-respecting analytics to understand general usage patterns. No personally identifiable information is collected.</p>
          <h2 className="font-orbitron text-lg font-bold neon-text-purple pt-4">Third-Party Services</h2>
          <p>We may display ads through Google AdSense, which has its own privacy policy. We recommend reviewing Google's privacy practices.</p>
          <h2 className="font-orbitron text-lg font-bold neon-text-purple pt-4">Contact</h2>
          <p>For privacy questions, please visit our <a href="/contact" className="text-neon-cyan hover:underline">contact page</a>.</p>
        </div>
      </div>
    </div>
  </>
);

export default Privacy;
