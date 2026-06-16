import { z } from 'zod';

const dateField = z.string().min(1, 'Date is required');

export const createExperienceSchema = z
  .object({
    company: z.string().min(1, 'Required').max(200),
    role: z.string().min(1, 'Required').max(200),
    location: z.string().max(200).optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    startDate: dateField,
    endDate: z.string().optional().or(z.literal('')),
    isCurrent: z.boolean(),
    isPublished: z.boolean(),
    sortOrder: z.number().int().min(0),
  })
  .superRefine((values, ctx) => {
    if (values.isCurrent && values.endDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'End date must be empty when current role is enabled',
        path: ['endDate'],
      });
    }
    if (!values.isCurrent && values.endDate && values.endDate < values.startDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'End date must be on or after start date',
        path: ['endDate'],
      });
    }
  });

export const updateExperienceSchema = z
  .object({
    company: z.string().min(1).max(200).optional(),
    role: z.string().min(1).max(200).optional(),
    location: z.string().max(200).nullable().optional().or(z.literal('')),
    description: z.string().nullable().optional().or(z.literal('')),
    startDate: dateField.optional(),
    endDate: z.string().nullable().optional().or(z.literal('')),
    isCurrent: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.isCurrent && values.endDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'End date must be empty when current role is enabled',
        path: ['endDate'],
      });
    }
    if (
      values.startDate &&
      values.endDate &&
      !values.isCurrent &&
      values.endDate < values.startDate
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'End date must be on or after start date',
        path: ['endDate'],
      });
    }
  });

export type CreateExperienceFormValues = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceFormValues = z.infer<typeof updateExperienceSchema>;
