'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { RequirePermission } from '@/features/auth';
import { NavigationAdminPanel } from '@/features/navigation';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { AdminPageHeader } from '@/widgets/admin-page-header';
import { Skeleton } from '@/shared/ui/skeleton';

export default function NavigationDashboardPage() {
  const t = useTranslations('entities.navigation');

  return (
    <RequirePermission permission={PERMISSION_CODES.NAV_READ}>
      <div className="space-y-6">
        <AdminPageHeader title={t('title')} description={t('description')} />
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-full max-w-sm" />
              <Skeleton className="h-64 w-full" />
            </div>
          }
        >
          <NavigationAdminPanel />
        </Suspense>
      </div>
    </RequirePermission>
  );
}
