import { z } from 'zod';

export const createSkillSchema = z.object({
  name: z.string().min(1, 'Required').max(100),
  category: z.string().min(1, 'Required').max(50),
  proficiency: z.number().int().min(1).max(5),
  icon: z.string().url('Invalid URL').optional().or(z.literal('')),
  isPublished: z.boolean(),
  sortOrder: z.number().int().min(0),
});

export const updateSkillSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(50).optional(),
  proficiency: z.number().int().min(1).max(5).optional(),
  icon: z.string().url('Invalid URL').nullable().optional().or(z.literal('')),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateSkillFormValues = z.infer<typeof createSkillSchema>;
export type UpdateSkillFormValues = z.infer<typeof updateSkillSchema>;
