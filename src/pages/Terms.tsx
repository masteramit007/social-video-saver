import React from 'react';
import SEOHead from '@/components/SEOHead';

const Terms: React.FC = () => (
  <>
    <SEOHead title="Terms of Service" description="Terms of service for SocialMediaVideoDownloader.com." canonical="https://socialmediavideodownloader.com/terms" />
    <div className="relative z-10 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-orbitron text-3xl font-bold neon-text mb-8">Terms of Service</h1>
        <div className="glass p-8 space-y-4 text-sm text-foreground/80 leading-relaxed">
          <p><strong>Last updated:</strong> January 1, 2025</p>
          <h2 className="font-orbitron text-lg font-bold neon-text-purple pt-4">Acceptance of Terms</h2>
          <p>By using SocialMediaVideoDownloader.com, you agree to these terms. If you do not agree, please do not use our service.</p>
          <h2 className="font-orbitron text-lg font-bold neon-text-purple pt-4">Service Description</h2>
          <p>We provide a free tool to extract direct video links from social media platforms. We do not host, store, or distribute any video content.</p>
          <h2 className="font-orbitron text-lg font-bold neon-text-purple pt-4">User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>You must only download content you have the right to access</li>
            <li>You must not use downloaded content for commercial purposes without permission</li>
            <li>You must respect intellectual property rights of content creators</li>
            <li>You must not attempt to abuse or overload our service</li>
          </ul>
          <h2 className="font-orbitron text-lg font-bold neon-text-purple pt-4">Limitation of Liability</h2>
          <p>Our service is provided "as is" without warranties. We are not responsible for the content you download or how you use it.</p>
          <h2 className="font-orbitron text-lg font-bold neon-text-purple pt-4">DMCA</h2>
          <p>If you are a copyright holder and believe content is being infringed, please contact us via our contact page.</p>
        </div>
      </div>
    </div>
  </>
);

export default Terms;
