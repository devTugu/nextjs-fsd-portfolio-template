'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { PublishedStatusBadge } from '@/shared/ui/published-status-badge';
import type { SkillOutput } from '../types/skill';

export const skillColumns: ColumnDef<SkillOutput, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'proficiency', header: 'Level' },
  {
    accessorKey: 'isPublished',
    header: 'Status',
    cell: ({ row }) => (
      <PublishedStatusBadge isPublished={row.original.isPublished} />
    ),
  },
  { accessorKey: 'sortOrder', header: 'Order' },
];
