'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useAdminContentLocale } from '@/shared/i18n/admin-content-locale-context';
import { pickLocalized } from '@/shared/lib/pick-localized';
import type { LeadershipMemberOutput } from '../types/leadership';

export function useLeadershipColumns(): ColumnDef<LeadershipMemberOutput, unknown>[] {
  const t = useTranslations('entities.leadership');
  const { locale } = useAdminContentLocale();

  return useMemo(
    () => [
      { accessorKey: 'name', header: t('name') },
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
