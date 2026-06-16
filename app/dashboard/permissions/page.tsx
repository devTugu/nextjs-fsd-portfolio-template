import { Suspense } from 'react';
import { RequirePermission } from '@/features/auth';
import { PermissionsTable } from '@/features/permissions';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { Skeleton } from '@/shared/ui/skeleton';

export default function PermissionsPage() {
  return (
    <RequirePermission permission={PERMISSION_CODES.PERMISSION_READ}>
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <PermissionsTable />
      </Suspense>
    </RequirePermission>
  );
}
