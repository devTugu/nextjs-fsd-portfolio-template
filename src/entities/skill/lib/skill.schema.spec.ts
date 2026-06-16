import { describe, expect, it } from 'vitest';
import { createSkillSchema } from './skill.schema';

describe('createSkillSchema', () => {
  it('accepts valid skill input', () => {
    const result = createSkillSchema.safeParse({
      name: 'TypeScript',
      category: 'Language',
      proficiency: 5,
      icon: '',
      isPublished: true,
      sortOrder: 0,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid proficiency', () => {
    const result = createSkillSchema.safeParse({
      name: 'TypeScript',
      category: 'Language',
      proficiency: 6,
      isPublished: true,
      sortOrder: 0,
    });
    expect(result.success).toBe(false);
  });
});
