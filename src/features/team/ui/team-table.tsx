'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import {
  useTeamColumns,
  type TeamMemberOutput,
  useTeamMembers,
} from '@/entities/team';
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
import { TeamManageSheet, type TeamSheetState } from './team-manage-sheet';
import { TeamDeleteDialog } from './team-delete-dialog';

export function TeamTable() {
  const t = useTranslations('entities.team');
  const tCommon = useTranslations('common');
  const teamColumns = useTeamColumns();
  const { can } = useAuthPermissions();
  const { pagination, setPagination, onSearchChange, queryParams, search } =
    useTableSearchParams();
  const { data, isLoading, isError, error, refetch } = useTeamMembers(queryParams);
  const [sheetState, setSheetState] = useState<TeamSheetState | null>(null);
  const [deleteItem, setDeleteItem] = useState<TeamMemberOutput | null>(null);

  const columns = useMemo<ColumnDef<TeamMemberOutput, unknown>[]>(
    () => [
      ...teamColumns,
      {
        id: 'actions',
        header: () => <span className="sr-only">{tCommon('actions')}</span>,
        cell: ({ row }) => (
          <AdminTableActions
            name={row.original.name}
            updatePermission={PERMISSION_CODES.TEAM_UPDATE}
            deletePermission={PERMISSION_CODES.TEAM_DELETE}
            onEdit={() => setSheetState({ mode: 'edit', member: row.original })}
            onDelete={() => setDeleteItem(row.original)}
          />
        ),
      },
    ],
    [teamColumns, tCommon],
  );

  const canCreate = can(PERMISSION_CODES.TEAM_CREATE);

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
        <TeamManageSheet
          state={sheetState}
          onOpenChange={(open) => !open && setSheetState(null)}
        />
        <TeamDeleteDialog
          member={deleteItem}
          open={Boolean(deleteItem)}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      </div>
    </DataTableQueryState>
  );
}
