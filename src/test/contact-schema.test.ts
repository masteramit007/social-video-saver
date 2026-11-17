import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/lib/contact-schema';

const valid = { name: 'Test visitor', email: 'visitor@example.com', message: 'A question about downloads.', website: '' };

describe('Contact input validation', () => {
  it('trims a valid submission', () => {
    expect(contactSchema.parse({ ...valid, name: ' Test visitor ' }).name).toBe('Test visitor');
  });
  it.each(['name', 'email', 'message'])('rejects an empty %s', (field) => {
    expect(contactSchema.safeParse({ ...valid, [field]: '' }).success).toBe(false);
  });
  it('rejects an invalid email', () => {
    expect(contactSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });
  it.each([['name', 100], ['email', 255], ['message', 5000]] as const)('limits %s length', (field, limit) => {
    const atLimit = field === 'email' ? `${'a'.repeat(limit - 12)}@example.com` : 'a'.repeat(limit);
    expect(contactSchema.safeParse({ ...valid, [field]: atLimit }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, [field]: `a${atLimit}` }).success).toBe(false);
  });
  it('rejects filled spam-trap fields', () => {
    expect(contactSchema.safeParse({ ...valid, website: 'spam' }).success).toBe(false);
  });
});