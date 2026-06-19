import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { RequirePermission } from '@/features/auth';
import { ContactMessagesTable } from '@/features/contact-messages';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { AdminPageHeader } from '@/widgets/admin-page-header';
import { Skeleton } from '@/shared/ui/skeleton';

export default async function ContactMessagesPage() {
  const tNav = await getTranslations('nav');
  const t = await getTranslations('entities.contactMessages');

  return (
    <RequirePermission permission={PERMISSION_CODES.CONTACT_READ}>
      <div className="space-y-6">
        <AdminPageHeader
          title={tNav('contactMessages')}
          description={t('pageDescription')}
        />
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-full max-w-sm" />
              <Skeleton className="h-64 w-full" />
            </div>
          }
        >
          <ContactMessagesTable />
        </Suspense>
      </div>
    </RequirePermission>
  );
}
