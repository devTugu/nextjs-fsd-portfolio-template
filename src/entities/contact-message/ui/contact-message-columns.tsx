'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import type { ContactMessageOutput } from '../types/contact-message';

const statusVariant = {
  NEW: 'default',
  READ: 'secondary',
  ARCHIVED: 'outline',
} as const;

export const contactMessageColumns: ColumnDef<ContactMessageOutput, unknown>[] =
  [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => row.original.subject ?? '—',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status]}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Received',
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
    },
  ];
