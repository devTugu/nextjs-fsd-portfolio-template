'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import {
  useNewsPostColumns,
  type NewsPostOutput,
  useNewsPosts,
  useDeleteNewsPost,
} from '@/entities/news-post';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/api';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { NewsPostManageSheet, type NewsPostSheetState } from './news-post-manage-sheet';

export function NewsPostsTable() {
  const t = useTranslations('entities.news');
  const tCommon = useTranslations('common');
  const blogColumns = useNewsPostColumns();
  const { can } = useAuthPermissions();
  const deletePost = useDeleteNewsPost();
  const { pagination, setPagination, onSearchChange, queryParams, search } =
    useTableSearchParams({});
  const { data, isLoading, isError, error, refetch } = useNewsPosts(queryParams);
  const [sheetState, setSheetState] = useState<NewsPostSheetState | null>(null);
  const [deleteItem, setDeleteItem] = useState<NewsPostOutput | null>(null);

  const columns = useMemo<ColumnDef<NewsPostOutput, unknown>[]>(
    () => [
      ...blogColumns,
      {
        id: 'actions',
        header: () => <span className="sr-only">{tCommon('actions')}</span>,
        cell: ({ row }) => (
          <AdminTableActions
            name={pickLocalized(row.original.title, 'en')}
            updatePermission={PERMISSION_CODES.BLOG_UPDATE}
            deletePermission={PERMISSION_CODES.BLOG_DELETE}
            onEdit={() => setSheetState({ mode: 'edit', post: row.original })}
            onDelete={() => setDeleteItem(row.original)}
          />
        ),
      },
    ],
    [blogColumns, tCommon],
  );

  const canCreate = can(PERMISSION_CODES.BLOG_CREATE);

  async function confirmDelete() {
    if (!deleteItem) return;
    try {
      await deletePost.mutateAsync(deleteItem.id);
      toast.success(t('toastDeleted'));
      setDeleteItem(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <DataTableQueryState isError={isError} error={error} refetch={refetch}>
      <div className="space-y-4">
        <DataTableToolbar
          initialSearch={search}
          onSearchChange={onSearchChange}
          placeholder={t('searchPlaceholder')}
        >
          {canCreate ? (
            <Button onClick={() => setSheetState({ mode: 'create' })}>{t('addPost')}</Button>
          ) : null}
        </DataTableToolbar>

        <DataTable<NewsPostOutput>
          columns={columns}
          data={data?.items ?? []}
          pageCount={data?.totalPages ?? 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoading}
          emptyContent={<DataTableEmpty title={t('emptyTitle')} />}
        />
      </div>

      <NewsPostManageSheet
        state={sheetState}
        onOpenChange={(open) => !open && setSheetState(null)}
      />

      <AlertDialog open={deleteItem !== null} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteItem
                ? t('deleteDescription', {
                    title: pickLocalized(deleteItem.title, 'en'),
                  })
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{tCommon('delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DataTableQueryState>
  );
}
