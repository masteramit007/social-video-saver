import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(100, 'Name must be 100 characters or fewer.'),
  email: z.string().trim().email('Please enter a valid email address.').max(255),
  message: z.string().trim().min(1, 'Please enter your message.').max(5000, 'Message must be 5,000 characters or fewer.'),
  website: z.string().max(0, 'Unable to submit this message.').default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;