'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { Badge } from '@/shared/ui/badge';
import type { NewsPostOutput } from '../types/news-post';

export function useNewsPostColumns() {
  const t = useTranslations('table');
  const tStatus = useTranslations('status');

  return useMemo<ColumnDef<NewsPostOutput, unknown>[]>(
    () => [
      {
        accessorKey: 'title',
        header: t('title'),
        cell: ({ row }) => pickLocalized(row.original.title, 'en'),
      },
      { accessorKey: 'slug', header: t('slug') },
      { accessorKey: 'category', header: t('category') },
      {
        accessorKey: 'isPublished',
        header: t('status'),
        cell: ({ row }) => (
          <Badge variant={row.original.isPublished ? 'default' : 'secondary'}>
            {row.original.isPublished ? tStatus('published') : tStatus('draft')}
          </Badge>
        ),
      },
      { accessorKey: 'sortOrder', header: t('order') },
    ],
    [t, tStatus],
  );
}
