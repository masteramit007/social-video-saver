import { createServerFn } from '@tanstack/react-start';
import { contactSchema } from './contact-schema';

// Public by design: visitors can submit, but never read or mutate existing messages.
export const submitContact = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: saved, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert({ name: data.name, email: data.email, message: data.message })
      .select('id')
      .single();
    if (error || !saved) throw new Error('Your message could not be saved. Please try again.');
    return { saved: true };
  });