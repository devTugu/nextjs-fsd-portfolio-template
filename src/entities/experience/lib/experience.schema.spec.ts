import { describe, expect, it } from 'vitest';
import { createExperienceSchema } from './experience.schema';

const baseExperience = {
  company: 'Acme Corp',
  role: 'Software Engineer',
  location: 'Remote',
  description: 'Built web applications.',
  startDate: '2022-01-01',
  endDate: '',
  isCurrent: false,
  isPublished: true,
  sortOrder: 0,
};

describe('createExperienceSchema', () => {
  it('accepts valid experience input', () => {
    const result = createExperienceSchema.safeParse({
      ...baseExperience,
      endDate: '2024-06-01',
    });
    expect(result.success).toBe(true);
  });

  it('rejects end date before start date when not current', () => {
    const result = createExperienceSchema.safeParse({
      ...baseExperience,
      startDate: '2024-01-01',
      endDate: '2023-12-31',
      isCurrent: false,
    });
    expect(result.success).toBe(false);
  });

  it('rejects end date when current role is enabled', () => {
    const result = createExperienceSchema.safeParse({
      ...baseExperience,
      isCurrent: true,
      endDate: '2024-06-01',
    });
    expect(result.success).toBe(false);
  });

  it('allows current role without end date', () => {
    const result = createExperienceSchema.safeParse({
      ...baseExperience,
      isCurrent: true,
      endDate: '',
    });
    expect(result.success).toBe(true);
  });
});
