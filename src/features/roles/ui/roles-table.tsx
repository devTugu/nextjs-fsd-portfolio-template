'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useRoles, type Role } from '@/entities/role';
import { roleColumns } from '@/entities/role/ui/role-columns';
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
import { RoleManageSheet, type RoleSheetState } from './role-manage-sheet';
import { RoleDeleteDialog } from './role-delete-dialog';

export function RolesTable() {
  const { can } = useAuthPermissions();
  const { pagination, setPagination, onSearchChange, queryParams, search } =
    useTableSearchParams();
  const { data, isLoading, isError, error, refetch } = useRoles(queryParams);
  const [sheetState, setSheetState] = useState<RoleSheetState | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);

  const columns = useMemo<ColumnDef<Role, unknown>[]>(
    () => [
      ...roleColumns,
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <AdminTableActions
            name={row.original.name}
            updatePermission={PERMISSION_CODES.ROLE_UPDATE}
            deletePermission={PERMISSION_CODES.ROLE_DELETE}
            onEdit={() =>
              setSheetState({ mode: 'edit', role: row.original })
            }
            onDelete={() => setDeleteRole(row.original)}
          />
        ),
      },
    ],
    []
  );

  const canCreate = can(PERMISSION_CODES.ROLE_CREATE);

  return (
    <DataTableQueryState isError={isError} error={error} refetch={refetch}>
      <div className="space-y-4">
        <DataTableToolbar
          initialSearch={search}
          onSearchChange={onSearchChange}
          placeholder="Search roles..."
        >
          {canCreate ? (
            <Button size="sm" onClick={() => setSheetState({ mode: 'create' })}>
              Add role
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
              title="No roles found"
              action={
                canCreate ? (
                  <Button
                    size="sm"
                    onClick={() => setSheetState({ mode: 'create' })}
                  >
                    Add role
                  </Button>
                ) : undefined
              }
            />
          }
        />
        <RoleManageSheet
          state={sheetState}
          onOpenChange={(open) => !open && setSheetState(null)}
        />
        <RoleDeleteDialog
          role={deleteRole}
          open={Boolean(deleteRole)}
          onOpenChange={(open) => !open && setDeleteRole(null)}
        />
      </div>
    </DataTableQueryState>
  );
}
