import React, { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Mail, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactSchema } from '@/lib/contact-schema';
import { submitContact } from '@/lib/contact.functions';

const Contact: React.FC = () => {
  const sendContact = useServerFn(submitContact);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(form)));
    setStatus('idle');
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check your message.');
      setStatus('error');
      return;
    }
    setPending(true);
    try {
      const response = await sendContact({ data: parsed.data });
      if (!response.saved) throw new Error('Message not saved');
      form.reset();
      setStatus('success');
    } catch {
      setError('Your message could not be saved. Please try again.');
      setStatus('error');
    } finally {
      setPending(false);
    }
  };

  return (
  <>
    <div className="relative z-10 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-xl">
        <h1 className="font-orbitron text-3xl font-bold neon-text mb-8 text-center">Contact Us</h1>
        <div className="glass p-8">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-neon-cyan" />
            <span className="text-sm">contact@socialmediavideodownloader.com</span>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit} aria-busy={pending}>
            <div>
              <label htmlFor="contact-name" className="block text-sm mb-2">Your Name</label>
              <input id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder="Your Name" className="glass-input w-full px-4 py-3 text-sm" />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm mb-2">Your Email</label>
              <input id="contact-email" name="email" autoComplete="email" required maxLength={255} placeholder="Your Email" type="email" className="glass-input w-full px-4 py-3 text-sm" />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm mb-2">Your Message</label>
              <textarea id="contact-message" name="message" required maxLength={5000} placeholder="Your Message" rows={5} className="glass-input w-full px-4 py-3 text-sm resize-none" />
            </div>
            <input name="website" aria-label="Leave this field empty" autoComplete="off" tabIndex={-1} hidden />
            <Button type="submit" disabled={pending} className="neon-btn w-full min-h-11 py-3 text-sm">
              {pending && <LoaderCircle className="animate-spin" aria-hidden="true" />}
              {pending ? 'Sending…' : 'Send Message'}
            </Button>
            <div aria-live="polite" aria-atomic="true">
              {status === 'success' && <p className="text-sm text-foreground" role="status">Your message has been received. Thank you for getting in touch.</p>}
              {status === 'error' && <p className="text-sm text-neon-pink" role="alert">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
  );
};

export default Contact;
