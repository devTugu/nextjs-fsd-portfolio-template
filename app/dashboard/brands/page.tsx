import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { RequirePermission } from '@/features/auth';
import { BrandsTable } from '@/features/brands';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { AdminPageHeader } from '@/widgets/admin-page-header';
import { Skeleton } from '@/shared/ui/skeleton';

export default async function BrandsPage() {
  const tNav = await getTranslations('nav');
  const t = await getTranslations('entities.brands');

  return (
    <RequirePermission permission={PERMISSION_CODES.BRAND_READ}>
      <div className="space-y-6">
        <AdminPageHeader title={tNav('brands')} description={t('description')} />
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-full max-w-sm" />
              <Skeleton className="h-64 w-full" />
            </div>
          }
        >
          <BrandsTable />
        </Suspense>
      </div>
    </RequirePermission>
  );
}
