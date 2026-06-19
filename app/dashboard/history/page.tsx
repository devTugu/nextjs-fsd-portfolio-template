import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { RequirePermission } from '@/features/auth';
import { HistoryTable } from '@/features/history';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { AdminPageHeader } from '@/widgets/admin-page-header';
import { Skeleton } from '@/shared/ui/skeleton';

export default async function HistoryPage() {
  const tNav = await getTranslations('nav');
  const t = await getTranslations('entities.history');

  return (
    <RequirePermission permission={PERMISSION_CODES.HISTORY_READ}>
      <div className="space-y-6">
        <AdminPageHeader title={tNav('history')} description={t('description')} />
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-full max-w-sm" />
              <Skeleton className="h-64 w-full" />
            </div>
          }
        >
          <HistoryTable />
        </Suspense>
      </div>
    </RequirePermission>
  );
}
