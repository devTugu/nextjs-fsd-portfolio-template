import { z } from 'zod';

const projectImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().optional(),
});

const baseProjectFields = {
  title: z.string().min(2, 'Title is required').max(200),
  slug: z.string().max(120).optional().or(z.literal('')),
  shortDescription: z.string().min(1, 'Required').max(500),
  description: z.string().min(1, 'Required'),
  thumbnailUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  images: z.array(projectImageSchema).optional(),
  techStack: z.array(z.string()).min(1, 'Add at least one technology'),
  liveUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  repoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  sortOrder: z.number().int().min(0),
};

export const createProjectSchema = z.object(baseProjectFields);

export const updateProjectSchema = z.object({
  title: baseProjectFields.title.optional(),
  slug: baseProjectFields.slug,
  shortDescription: baseProjectFields.shortDescription.optional(),
  description: baseProjectFields.description.optional(),
  thumbnailUrl: z
    .string()
    .url('Invalid URL')
    .nullable()
    .optional()
    .or(z.literal('')),
  images: baseProjectFields.images,
  techStack: z.array(z.string()).optional(),
  liveUrl: z
    .string()
    .url('Invalid URL')
    .nullable()
    .optional()
    .or(z.literal('')),
  repoUrl: z
    .string()
    .url('Invalid URL')
    .nullable()
    .optional()
    .or(z.literal('')),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;
