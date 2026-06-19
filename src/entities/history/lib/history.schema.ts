import { z } from 'zod';
import { localizedTextSchema } from '@/shared/lib/localized-content.schema';

export function createHistorySchema() {
  return z.object({
    year: z.number().int().min(1900).max(2100),
    title: localizedTextSchema,
    description: localizedTextSchema,
    imageUrl: z.string().optional(),
    sortOrder: z.number().int().min(0),
    isPublished: z.boolean(),
  });
}

export type CreateHistoryFormValues = z.infer<ReturnType<typeof createHistorySchema>>;
