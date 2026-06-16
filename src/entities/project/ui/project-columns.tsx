'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { PublishedStatusBadge } from '@/shared/ui/published-status-badge';
import { Badge } from '@/shared/ui/badge';
import type { ProjectOutput } from '../types/project';

export const projectColumns: ColumnDef<ProjectOutput, unknown>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'slug', header: 'Slug' },
  {
    accessorKey: 'isPublished',
    header: 'Status',
    cell: ({ row }) => (
      <PublishedStatusBadge isPublished={row.original.isPublished} />
    ),
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
    cell: ({ row }) =>
      row.original.isFeatured ? (
        <Badge variant="outline">Featured</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  { accessorKey: 'sortOrder', header: 'Order' },
];
