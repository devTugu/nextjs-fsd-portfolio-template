'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  contactMessageColumns,
  type ContactMessageOutput,
  type ContactMessageStatus,
  useContactMessages,
} from '@/entities/contact-message';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { useTableSearchParams } from '@/shared/hooks/use-table-search-params';
import {
  DataTable,
  DataTableToolbar,
  DataTableEmpty,
  DataTableQueryState,
} from '@/widgets/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { ContactDetailSheet } from './contact-detail-sheet';
import { ContactDeleteDialog } from './contact-delete-dialog';

export function ContactMessagesTable() {
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
      status: { defaultValue: 'all', omitFromQuery: ['all'] },
    },
  });
  const status = filters.status;
  const listParams = {
    ...queryParams,
    ...(status !== 'all'
      ? { status: status as ContactMessageStatus }
      : {}),
  };
  const { data, isLoading, isError, error, refetch } =
    useContactMessages(listParams);
  const [selected, setSelected] = useState<ContactMessageOutput | null>(null);
  const [deleteItem, setDeleteItem] = useState<ContactMessageOutput | null>(
    null
  );

  const columns = useMemo<ColumnDef<ContactMessageOutput, unknown>[]>(
    () => [
      ...contactMessageColumns,
      {
        id: 'open',
        header: () => <span className="sr-only">Open</span>,
        cell: ({ row }) => (
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            onClick={() => setSelected(row.original)}
          >
            View
          </button>
        ),
      },
    ],
    []
  );

  return (
    <DataTableQueryState isError={isError} error={error} refetch={refetch}>
      <div className="space-y-4">
        <DataTableToolbar
          initialSearch={search}
          onSearchChange={onSearchChange}
          placeholder="Search messages..."
        >
          <Select
            value={status}
            onValueChange={(value) => setFilter('status', value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="NEW">NEW</SelectItem>
              <SelectItem value="READ">READ</SelectItem>
              <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
            </SelectContent>
          </Select>
        </DataTableToolbar>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          pageCount={data?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoading}
          emptyContent={<DataTableEmpty title="No contact messages" />}
        />
        <ContactDetailSheet
          message={selected}
          open={Boolean(selected)}
          onOpenChange={(open) => !open && setSelected(null)}
          onDelete={() => {
            if (selected) setDeleteItem(selected);
          }}
        />
        {can(PERMISSION_CODES.CONTACT_DELETE) ? (
          <ContactDeleteDialog
            message={deleteItem}
            open={Boolean(deleteItem)}
            onOpenChange={(open) => {
              if (!open) {
                setDeleteItem(null);
                setSelected(null);
              }
            }}
          />
        ) : null}
      </div>
    </DataTableQueryState>
  );
}
