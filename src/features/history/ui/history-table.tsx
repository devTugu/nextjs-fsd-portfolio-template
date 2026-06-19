'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import {
  useHistoryColumns,
  type HistoryEntryOutput,
  useHistoryEntries,
} from '@/entities/history';
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
import {
  HistoryManageSheet,
  type HistorySheetState,
} from './history-manage-sheet';
import { HistoryDeleteDialog } from './history-delete-dialog';

export function HistoryTable() {
  const t = useTranslations('entities.history');
  const tCommon = useTranslations('common');
  const historyColumns = useHistoryColumns();
  const { can } = useAuthPermissions();
  const { pagination, setPagination, onSearchChange, queryParams, search } =
    useTableSearchParams();
  const { data, isLoading, isError, error, refetch } =
    useHistoryEntries(queryParams);
  const [sheetState, setSheetState] = useState<HistorySheetState | null>(null);
  const [deleteItem, setDeleteItem] = useState<HistoryEntryOutput | null>(null);

  const columns = useMemo<ColumnDef<HistoryEntryOutput, unknown>[]>(
    () => [
      ...historyColumns,
      {
        id: 'actions',
        header: () => <span className="sr-only">{tCommon('actions')}</span>,
        cell: ({ row }) => (
          <AdminTableActions
            name={String(row.original.year)}
            updatePermission={PERMISSION_CODES.HISTORY_UPDATE}
            deletePermission={PERMISSION_CODES.HISTORY_DELETE}
            onEdit={() =>
              setSheetState({ mode: 'edit', entry: row.original })
            }
            onDelete={() => setDeleteItem(row.original)}
          />
        ),
      },
    ],
    [historyColumns, tCommon],
  );

  const canCreate = can(PERMISSION_CODES.HISTORY_CREATE);

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
              {t('addEntry')}
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
                    {t('addEntry')}
                  </Button>
                ) : undefined
              }
            />
          }
        />
        <HistoryManageSheet
          state={sheetState}
          onOpenChange={(open) => !open && setSheetState(null)}
        />
        <HistoryDeleteDialog
          entry={deleteItem}
          open={Boolean(deleteItem)}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      </div>
    </DataTableQueryState>
  );
}
