'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useAdminContentLocale } from '@/shared/i18n/admin-content-locale-context';
import { pickLocalized } from '@/shared/lib/pick-localized';
import type { HistoryEntryOutput } from '../types/history';

export function useHistoryColumns(): ColumnDef<HistoryEntryOutput, unknown>[] {
  const t = useTranslations('entities.history');
  const { locale } = useAdminContentLocale();

  return useMemo(
    () => [
      { accessorKey: 'year', header: t('year') },
      {
        accessorKey: 'title',
        header: t('title'),
        cell: ({ row }) => pickLocalized(row.original.title, locale),
      },
      { accessorKey: 'sortOrder', header: t('sortOrder') },
      {
        accessorKey: 'isPublished',
        header: t('published'),
        cell: ({ row }) => (row.original.isPublished ? t('yes') : t('no')),
      },
    ],
    [t, locale],
  );
}
