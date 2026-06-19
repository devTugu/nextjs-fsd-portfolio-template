'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useAdminContentLocale } from '@/shared/i18n/admin-content-locale-context';
import { pickLocalized } from '@/shared/lib/pick-localized';
import type { BrandOutput } from '../types/brand';
import { Badge } from '@/shared/ui/badge';

export function useBrandColumns(): ColumnDef<BrandOutput, unknown>[] {
  const t = useTranslations('entities.brands');
  const { locale } = useAdminContentLocale();

  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('name'),
        cell: ({ row }) => pickLocalized(row.original.name, locale),
      },
      {
        accessorKey: 'slug',
        header: t('slug'),
      },
      {
        accessorKey: 'type',
        header: t('type'),
        cell: ({ row }) => (
          <Badge variant="secondary">{t(`type${row.original.type}`)}</Badge>
        ),
      },
      {
        accessorKey: 'sortOrder',
        header: t('sortOrder'),
      },
      {
        accessorKey: 'isPublished',
        header: t('published'),
        cell: ({ row }) =>
          row.original.isPublished ? t('yes') : t('no'),
      },
    ],
    [t, locale],
  );
}
