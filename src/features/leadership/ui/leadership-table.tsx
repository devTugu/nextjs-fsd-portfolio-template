'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import {
  useLeadershipColumns,
  type LeadershipMemberOutput,
  useLeadershipMembers,
} from '@/entities/leadership';
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
  LeadershipManageSheet,
  type LeadershipSheetState,
} from './leadership-manage-sheet';
import { LeadershipDeleteDialog } from './leadership-delete-dialog';

export function LeadershipTable() {
  const t = useTranslations('entities.leadership');
  const tCommon = useTranslations('common');
  const leadershipColumns = useLeadershipColumns();
  const { can } = useAuthPermissions();
  const { pagination, setPagination, onSearchChange, queryParams, search } =
    useTableSearchParams();
  const { data, isLoading, isError, error, refetch } =
    useLeadershipMembers(queryParams);
  const [sheetState, setSheetState] = useState<LeadershipSheetState | null>(
    null,
  );
  const [deleteItem, setDeleteItem] = useState<LeadershipMemberOutput | null>(
    null,
  );

  const columns = useMemo<ColumnDef<LeadershipMemberOutput, unknown>[]>(
    () => [
      ...leadershipColumns,
      {
        id: 'actions',
        header: () => <span className="sr-only">{tCommon('actions')}</span>,
        cell: ({ row }) => (
          <AdminTableActions
            name={row.original.name}
            updatePermission={PERMISSION_CODES.LEADERSHIP_UPDATE}
            deletePermission={PERMISSION_CODES.LEADERSHIP_DELETE}
            onEdit={() =>
              setSheetState({ mode: 'edit', member: row.original })
            }
            onDelete={() => setDeleteItem(row.original)}
          />
        ),
      },
    ],
    [leadershipColumns, tCommon],
  );

  const canCreate = can(PERMISSION_CODES.LEADERSHIP_CREATE);

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
              {t('addMember')}
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
                    {t('addMember')}
                  </Button>
                ) : undefined
              }
            />
          }
        />
        <LeadershipManageSheet
          state={sheetState}
          onOpenChange={(open) => !open && setSheetState(null)}
        />
        <LeadershipDeleteDialog
          member={deleteItem}
          open={Boolean(deleteItem)}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      </div>
    </DataTableQueryState>
  );
}
