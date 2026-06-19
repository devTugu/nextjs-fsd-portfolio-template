'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useAdminContentLocale } from '@/shared/i18n/admin-content-locale-context';
import { pickLocalized } from '@/shared/lib/pick-localized';
import type { TeamMemberOutput } from '../types/team';

export function useTeamColumns(): ColumnDef<TeamMemberOutput, unknown>[] {
  const t = useTranslations('entities.team');
  const { locale } = useAdminContentLocale();

  return useMemo(
    () => [
      { accessorKey: 'name', header: t('name') },
      {
        accessorKey: 'role',
        header: t('role'),
        cell: ({ row }) => pickLocalized(row.original.role, locale),
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
