'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { skillColumns, type SkillOutput, useSkills } from '@/entities/skill';
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
import { Input } from '@/shared/ui/input';
import { SkillManageSheet, type SkillSheetState } from './skill-manage-sheet';
import { SkillDeleteDialog } from './skill-delete-dialog';

export function SkillsTable() {
  const { can } = useAuthPermissions();
  const { pagination, setPagination, onSearchChange, queryParams, search } =
    useTableSearchParams();
  const [category, setCategory] = useState('');
  const listParams = {
    ...queryParams,
    ...(category.trim() ? { category: category.trim() } : {}),
  };
  const { data, isLoading, isError, error, refetch } = useSkills(listParams);
  const [sheetState, setSheetState] = useState<SkillSheetState | null>(null);
  const [deleteItem, setDeleteItem] = useState<SkillOutput | null>(null);

  const columns = useMemo<ColumnDef<SkillOutput, unknown>[]>(
    () => [
      ...skillColumns,
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <AdminTableActions
            name={row.original.name}
            updatePermission={PERMISSION_CODES.SKILL_UPDATE}
            deletePermission={PERMISSION_CODES.SKILL_DELETE}
            onEdit={() => setSheetState({ mode: 'edit', skill: row.original })}
            onDelete={() => setDeleteItem(row.original)}
          />
        ),
      },
    ],
    []
  );

  const canCreate = can(PERMISSION_CODES.SKILL_CREATE);

  return (
    <DataTableQueryState isError={isError} error={error} refetch={refetch}>
      <div className="space-y-4">
        <DataTableToolbar
          initialSearch={search}
          onSearchChange={onSearchChange}
          placeholder="Search skills..."
        >
          <Input
            placeholder="Category filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-[160px]"
          />
          {canCreate ? (
            <Button size="sm" onClick={() => setSheetState({ mode: 'create' })}>
              Add skill
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
              title="No skills found"
              action={
                canCreate ? (
                  <Button
                    size="sm"
                    onClick={() => setSheetState({ mode: 'create' })}
                  >
                    Add skill
                  </Button>
                ) : undefined
              }
            />
          }
        />
        <SkillManageSheet
          state={sheetState}
          onOpenChange={(open) => !open && setSheetState(null)}
        />
        <SkillDeleteDialog
          skill={deleteItem}
          open={Boolean(deleteItem)}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      </div>
    </DataTableQueryState>
  );
}
