import type { Permission } from '@/entities/permission';

export interface PermissionGroup {
  key: string;
  title: string;
  items: Permission[];
}

const GROUP_DEFINITIONS = [
  { key: 'users', title: 'Users', prefix: 'USER_' },
  { key: 'roles', title: 'Roles', prefix: 'ROLE_' },
  { key: 'permissions', title: 'Permissions', prefix: 'PERMISSION_' },
  { key: 'projects', title: 'Projects', prefix: 'PROJECT_' },
  { key: 'skills', title: 'Skills', prefix: 'SKILL_' },
  { key: 'experiences', title: 'Experiences', prefix: 'EXPERIENCE_' },
  { key: 'siteSettings', title: 'Site Settings', prefix: 'SITE_SETTING_' },
  { key: 'contact', title: 'Contact', prefix: 'CONTACT_' },
] as const;

export function groupPermissions(items: Permission[]): PermissionGroup[] {
  const buckets = new Map<string, Permission[]>(
    GROUP_DEFINITIONS.map((group) => [group.key, []])
  );

  for (const item of items) {
    const group = GROUP_DEFINITIONS.find((definition) =>
      item.code.startsWith(definition.prefix)
    );
    if (!group) continue;
    buckets.get(group.key)?.push(item);
  }

  return GROUP_DEFINITIONS.map((group) => ({
    key: group.key,
    title: group.title,
    items: buckets.get(group.key) ?? [],
  })).filter((group) => group.items.length > 0);
}

export function filterPermissions(
  items: Permission[],
  query: string
): Permission[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter(
    (item) =>
      item.code.toLowerCase().includes(normalized) ||
      (item.description?.toLowerCase().includes(normalized) ?? false)
  );
}
