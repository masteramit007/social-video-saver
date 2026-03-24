import React from 'react';
import SEOHead from '@/components/SEOHead';
import { Mail } from 'lucide-react';

const Contact: React.FC = () => (
  <>
    <SEOHead title="Contact Us" description="Get in touch with the SocialMediaVideoDownloader.com team." canonical="https://socialmediavideodownloader.com/contact" />
    <div className="relative z-10 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-xl">
        <h1 className="font-orbitron text-3xl font-bold neon-text mb-8 text-center">Contact Us</h1>
        <div className="glass p-8">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-neon-cyan" />
            <span className="text-sm">contact@socialmediavideodownloader.com</span>
          </div>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Your Name" className="glass-input w-full px-4 py-3 text-sm" />
            <input placeholder="Your Email" type="email" className="glass-input w-full px-4 py-3 text-sm" />
            <textarea placeholder="Your Message" rows={5} className="glass-input w-full px-4 py-3 text-sm resize-none" />
            <button type="submit" className="neon-btn w-full py-3 text-sm">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  </>
);

export default Contact;
