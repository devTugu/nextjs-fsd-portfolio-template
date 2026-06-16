import { describe, expect, it } from 'vitest';
import { createProjectSchema } from './project.schema';

const validProject = {
  title: 'Portfolio Site',
  slug: 'portfolio-site',
  shortDescription: 'A personal portfolio',
  description: 'Full description of the portfolio project.',
  thumbnailUrl: 'https://example.com/thumb.png',
  images: [{ url: 'https://example.com/image.png', alt: 'Preview' }],
  techStack: ['Next.js', 'TypeScript'],
  liveUrl: 'https://example.com',
  repoUrl: 'https://github.com/example/repo',
  isFeatured: true,
  isPublished: true,
  sortOrder: 0,
};

describe('createProjectSchema', () => {
  it('accepts valid project input', () => {
    const result = createProjectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('rejects empty tech stack', () => {
    const result = createProjectSchema.safeParse({
      ...validProject,
      techStack: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid thumbnail URL', () => {
    const result = createProjectSchema.safeParse({
      ...validProject,
      thumbnailUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('allows empty optional URL fields', () => {
    const result = createProjectSchema.safeParse({
      ...validProject,
      thumbnailUrl: '',
      liveUrl: '',
      repoUrl: '',
    });
    expect(result.success).toBe(true);
  });
});
