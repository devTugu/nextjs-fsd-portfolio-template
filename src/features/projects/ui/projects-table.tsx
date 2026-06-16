'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  projectColumns,
  type ProjectOutput,
  useProjects,
} from '@/entities/project';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { ProjectManageSheet, type ProjectSheetState } from './project-manage-sheet';
import { ProjectDeleteDialog } from './project-delete-dialog';

export function ProjectsTable() {
  const { can } = useAuthPermissions();
  const {
    pagination,
    setPagination,
    onSearchChange,
    queryParams,
    search,
    filters,
    setFilter,
  } = useTableSearchParams({
    filterParams: {
      featured: { defaultValue: 'all', omitFromQuery: ['all'] },
    },
  });
  const featured = filters.featured;
  const listParams = {
    ...queryParams,
    ...(featured === 'featured' ? { featured: true } : {}),
  };
  const { data, isLoading, isError, error, refetch } = useProjects(listParams);
  const [sheetState, setSheetState] = useState<ProjectSheetState | null>(null);
  const [deleteItem, setDeleteItem] = useState<ProjectOutput | null>(null);

  const columns = useMemo<ColumnDef<ProjectOutput, unknown>[]>(
    () => [
      ...projectColumns,
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <AdminTableActions
            name={row.original.title}
            updatePermission={PERMISSION_CODES.PROJECT_UPDATE}
            deletePermission={PERMISSION_CODES.PROJECT_DELETE}
            onEdit={() =>
              setSheetState({ mode: 'edit', project: row.original })
            }
            onDelete={() => setDeleteItem(row.original)}
          />
        ),
      },
    ],
    []
  );

  const canCreate = can(PERMISSION_CODES.PROJECT_CREATE);

  return (
    <DataTableQueryState isError={isError} error={error} refetch={refetch}>
      <div className="space-y-4">
        <DataTableToolbar
          initialSearch={search}
          onSearchChange={onSearchChange}
          placeholder="Search projects..."
        >
          <Select
            value={featured}
            onValueChange={(value) => setFilter('featured', value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>
          {canCreate ? (
            <Button size="sm" onClick={() => setSheetState({ mode: 'create' })}>
              Add project
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
              title="No projects found"
              action={
                canCreate ? (
                  <Button
                    size="sm"
                    onClick={() => setSheetState({ mode: 'create' })}
                  >
                    Add project
                  </Button>
                ) : undefined
              }
            />
          }
        />
        <ProjectManageSheet
          state={sheetState}
          onOpenChange={(open) => !open && setSheetState(null)}
        />
        <ProjectDeleteDialog
          project={deleteItem}
          open={Boolean(deleteItem)}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      </div>
    </DataTableQueryState>
  );
}
