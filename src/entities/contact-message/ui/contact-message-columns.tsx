'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/ui/badge';
import { useFormatDateTime } from '@/shared/i18n/use-format-date';
import type { ContactMessageOutput } from '../types/contact-message';

const statusVariant = {
  NEW: 'default',
  READ: 'secondary',
  ARCHIVED: 'outline',
} as const;

export function useContactMessageColumns() {
  const t = useTranslations('table');
  const tStatus = useTranslations('status');
  const formatDateTime = useFormatDateTime();

  return useMemo<ColumnDef<ContactMessageOutput, unknown>[]>(
    () => [
      { accessorKey: 'name', header: t('name') },
      { accessorKey: 'email', header: t('email') },
      {
        accessorKey: 'subject',
        header: t('subject'),
        cell: ({ row }) => row.original.subject ?? '—',
      },
      {
        accessorKey: 'status',
        header: t('status'),
        cell: ({ row }) => {
          const statusKey = row.original.status.toLowerCase() as
            | 'new'
            | 'read'
            | 'archived';
          return (
            <Badge variant={statusVariant[row.original.status]}>
              {tStatus(statusKey)}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: t('received'),
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
    ],
    [t, tStatus, formatDateTime],
  );
}
