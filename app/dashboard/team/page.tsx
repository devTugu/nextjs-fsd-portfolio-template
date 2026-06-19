import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { RequirePermission } from '@/features/auth';
import { TeamTable } from '@/features/team';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { AdminPageHeader } from '@/widgets/admin-page-header';
import { Skeleton } from '@/shared/ui/skeleton';

export default async function TeamPage() {
  const tNav = await getTranslations('nav');
  const t = await getTranslations('entities.team');

  return (
    <RequirePermission permission={PERMISSION_CODES.TEAM_READ}>
      <div className="space-y-6">
        <AdminPageHeader title={tNav('team')} description={t('description')} />
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-full max-w-sm" />
              <Skeleton className="h-64 w-full" />
            </div>
          }
        >
          <TeamTable />
        </Suspense>
      </div>
    </RequirePermission>
  );
}
