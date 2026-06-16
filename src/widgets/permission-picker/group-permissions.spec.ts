import { describe, expect, it } from 'vitest';
import { groupPermissions } from './group-permissions';
import type { Permission } from '@/entities/permission';

const permission = (code: string): Permission => ({
  id: 1,
  code,
  description: null,
});

describe('groupPermissions', () => {
  it('groups permissions by module prefix', () => {
    const groups = groupPermissions([
      permission('USER_READ'),
      permission('USER_CREATE'),
      permission('PROJECT_READ'),
    ]);

    expect(groups.map((group) => group.key)).toEqual(['users', 'projects']);
    expect(groups[0]?.items).toHaveLength(2);
    expect(groups[1]?.items[0]?.code).toBe('PROJECT_READ');
  });

  it('omits empty groups', () => {
    const groups = groupPermissions([permission('SKILL_READ')]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.key).toBe('skills');
  });
});
