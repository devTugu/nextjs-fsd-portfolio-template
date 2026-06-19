import { z } from 'zod';
import { localizedTextSchema } from '@/shared/lib/localized-content.schema';

export function createTeamSchema(messages: { required: string }) {
  return z.object({
    name: z.string().min(1, messages.required).max(120),
    role: localizedTextSchema,
    imageUrl: z.string().optional(),
    sortOrder: z.number().int().min(0),
    isPublished: z.boolean(),
  });
}

export type CreateTeamFormValues = z.infer<ReturnType<typeof createTeamSchema>>;
