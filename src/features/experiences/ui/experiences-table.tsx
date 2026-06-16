'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  experienceColumns,
  type ExperienceOutput,
  useExperiences,
} from '@/entities/experience';
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
  ExperienceManageSheet,
  type ExperienceSheetState,
} from './experience-manage-sheet';
import { ExperienceDeleteDialog } from './experience-delete-dialog';

export function ExperiencesTable() {
  const { can } = useAuthPermissions();
  const { pagination, setPagination, onSearchChange, queryParams, search } =
    useTableSearchParams();
  const { data, isLoading, isError, error, refetch } =
    useExperiences(queryParams);
  const [sheetState, setSheetState] = useState<ExperienceSheetState | null>(
    null
  );
  const [deleteItem, setDeleteItem] = useState<ExperienceOutput | null>(null);

  const columns = useMemo<ColumnDef<ExperienceOutput, unknown>[]>(
    () => [
      ...experienceColumns,
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <AdminTableActions
            name={row.original.company}
            updatePermission={PERMISSION_CODES.EXPERIENCE_UPDATE}
            deletePermission={PERMISSION_CODES.EXPERIENCE_DELETE}
            onEdit={() =>
              setSheetState({ mode: 'edit', experience: row.original })
            }
            onDelete={() => setDeleteItem(row.original)}
          />
        ),
      },
    ],
    []
  );

  const canCreate = can(PERMISSION_CODES.EXPERIENCE_CREATE);

  return (
    <DataTableQueryState isError={isError} error={error} refetch={refetch}>
      <div className="space-y-4">
        <DataTableToolbar
          initialSearch={search}
          onSearchChange={onSearchChange}
          placeholder="Search experiences..."
        >
          {canCreate ? (
            <Button size="sm" onClick={() => setSheetState({ mode: 'create' })}>
              Add experience
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
              title="No experiences found"
              action={
                canCreate ? (
                  <Button
                    size="sm"
                    onClick={() => setSheetState({ mode: 'create' })}
                  >
                    Add experience
                  </Button>
                ) : undefined
              }
            />
          }
        />
        <ExperienceManageSheet
          state={sheetState}
          onOpenChange={(open) => !open && setSheetState(null)}
        />
        <ExperienceDeleteDialog
          experience={deleteItem}
          open={Boolean(deleteItem)}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      </div>
    </DataTableQueryState>
  );
}
