'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useBrandColumns, type BrandOutput, useBrands } from '@/entities/brand';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { useTableSearchParams } from '@/shared/hooks/use-table-search-params';
import { AdminTableActions } from '@/widgets/admin-table-actions';
import {
  DataTable,
  DataTableToolbar,
  DataTableEmpty,
  DataTableQueryState,
} from '@/widgets/data-table';
import { Button } from '@/shared/ui/button';
import { BrandManageSheet, type BrandSheetState } from './brand-manage-sheet';
import { BrandDeleteDialog } from './brand-delete-dialog';

export function BrandsTable() {
  const t = useTranslations('entities.brands');
  const tCommon = useTranslations('common');
  const brandColumns = useBrandColumns();
  const { can } = useAuthPermissions();
  const { pagination, setPagination, onSearchChange, queryParams, search } =
    useTableSearchParams();
  const { data, isLoading, isError, error, refetch } = useBrands(queryParams);
  const [sheetState, setSheetState] = useState<BrandSheetState | null>(null);
  const [deleteItem, setDeleteItem] = useState<BrandOutput | null>(null);

  const columns = useMemo<ColumnDef<BrandOutput, unknown>[]>(
    () => [
      ...brandColumns,
      {
        id: 'actions',
        header: () => <span className="sr-only">{tCommon('actions')}</span>,
        cell: ({ row }) => (
          <AdminTableActions
            name={row.original.slug}
            updatePermission={PERMISSION_CODES.BRAND_UPDATE}
            deletePermission={PERMISSION_CODES.BRAND_DELETE}
            onEdit={() => setSheetState({ mode: 'edit', brand: row.original })}
            onDelete={() => setDeleteItem(row.original)}
          />
        ),
      },
    ],
    [brandColumns, tCommon],
  );

  const canCreate = can(PERMISSION_CODES.BRAND_CREATE);

  return (
    <DataTableQueryState isError={isError} error={error} refetch={refetch}>
      <div className="space-y-4">
        <DataTableToolbar
          initialSearch={search}
          onSearchChange={onSearchChange}
          placeholder={t('searchPlaceholder')}
        >
          {canCreate ? (
            <Button size="sm" onClick={() => setSheetState({ mode: 'create' })}>
              {t('addBrand')}
            </Button>
          ) : null}
        </DataTableToolbar>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          pageCount={data?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoading}
          emptyContent={
            <DataTableEmpty
              title={t('emptyTitle')}
              action={
                canCreate ? (
                  <Button
                    size="sm"
                    onClick={() => setSheetState({ mode: 'create' })}
                  >
                    {t('addBrand')}
                  </Button>
                ) : undefined
              }
            />
          }
        />
        <BrandManageSheet
          state={sheetState}
          onOpenChange={(open) => !open && setSheetState(null)}
        />
        <BrandDeleteDialog
          brand={deleteItem}
          open={Boolean(deleteItem)}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      </div>
    </DataTableQueryState>
  );
}
