import { z } from 'zod';

export function createContactSchema(messages: {
  nameRequired: string;
  emailInvalid: string;
  messageMin: string;
}) {
  return z.object({
    name: z.string().trim().min(1, messages.nameRequired).max(120),
    email: z.string().trim().email(messages.emailInvalid),
    subject: z.string().trim().max(200).optional(),
    message: z.string().trim().min(10, messages.messageMin).max(5000),
    website: z.string().max(0).optional(),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;
