'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { PublishedStatusBadge } from '@/shared/ui/published-status-badge';
import { Badge } from '@/shared/ui/badge';
import type { ExperienceOutput } from '../types/experience';

export const experienceColumns: ColumnDef<ExperienceOutput, unknown>[] = [
  { accessorKey: 'company', header: 'Company' },
  { accessorKey: 'role', header: 'Role' },
  {
    id: 'period',
    header: 'Period',
    cell: ({ row }) => {
      const end = row.original.isCurrent
        ? 'Present'
        : (row.original.endDate ?? '—');
      return (
        <span className="text-sm text-muted-foreground">
          {row.original.startDate} → {end}
        </span>
      );
    },
  },
  {
    accessorKey: 'isCurrent',
    header: 'Current',
    cell: ({ row }) =>
      row.original.isCurrent ? <Badge variant="outline">Current</Badge> : '—',
  },
  {
    accessorKey: 'isPublished',
    header: 'Status',
    cell: ({ row }) => (
      <PublishedStatusBadge isPublished={row.original.isPublished} />
    ),
  },
];
