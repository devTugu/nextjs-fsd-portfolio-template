import { z } from 'zod';
import { localizedTextSchema } from '@/shared/lib/localized-content.schema';

export function createBrandSchema(messages: {
  required: string;
  invalidUrl: string;
}) {
  return z.object({
    slug: z.string().max(120).optional(),
    type: z.enum(['RESTAURANT', 'EVENT']),
    name: localizedTextSchema,
    description: localizedTextSchema,
    logoUrl: z.string().url(messages.invalidUrl).or(z.literal('')).optional(),
    coverImageUrl: z.string().url(messages.invalidUrl).or(z.literal('')).optional(),
    address: localizedTextSchema.optional(),
    phone: z.string().optional(),
    mapEmbed: z.string().optional(),
    sortOrder: z.number().int().min(0),
    isPublished: z.boolean(),
  });
}

export type CreateBrandFormValues = z.infer<ReturnType<typeof createBrandSchema>>;
