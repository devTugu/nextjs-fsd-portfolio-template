import { z } from 'zod';
import { localizedTextSchema } from '@/shared/lib/localized-content.schema';

export function createLeadershipSchema(messages: {
  required: string;
  invalidUrl: string;
}) {
  return z.object({
    name: z.string().min(1, messages.required).max(120),
    title: localizedTextSchema,
    quote: localizedTextSchema,
    imageUrl: z.string().optional(),
    sortOrder: z.number().int().min(0),
    isPublished: z.boolean(),
  });
}

export type CreateLeadershipFormValues = z.infer<
  ReturnType<typeof createLeadershipSchema>
>;
