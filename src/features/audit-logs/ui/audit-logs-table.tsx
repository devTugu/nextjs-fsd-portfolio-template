'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useAuditLogs, type AuditLogOutput } from '@/entities/audit-log';
import { useTableSearchParams } from '@/shared/hooks/use-table-search-params';
import {
  DataTable,
  DataTableToolbar,
  DataTableEmpty,
  DataTableQueryState,
} from '@/widgets/data-table';

export function AuditLogsTable() {
  const { pagination, setPagination, onSearchChange, queryParams, search } =
    useTableSearchParams();

  const { data, isLoading, isError, error, refetch } = useAuditLogs(queryParams);

  const columns = useMemo<ColumnDef<AuditLogOutput, unknown>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: 'Time',
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
      },
      { accessorKey: 'action', header: 'Action' },
      { accessorKey: 'resource', header: 'Resource' },
      { accessorKey: 'resourceId', header: 'Resource ID' },
      { accessorKey: 'userId', header: 'User ID' },
      { accessorKey: 'ipAddress', header: 'IP' },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <DataTableToolbar
        initialSearch={search}
        onSearchChange={onSearchChange}
        placeholder="Filter by action or resource..."
      />
      <DataTableQueryState isError={isError} error={error} refetch={refetch}>
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          pageCount={data?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoading}
          emptyContent={<DataTableEmpty title="No audit logs found." />}
        />
      </DataTableQueryState>
    </div>
  );
}
