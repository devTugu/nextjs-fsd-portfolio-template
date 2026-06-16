import { Suspense } from 'react';
import { RequirePermission } from '@/features/auth';
import { RolesTable } from '@/features/roles';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { Skeleton } from '@/shared/ui/skeleton';

export default function RolesPage() {
  return (
    <RequirePermission permission={PERMISSION_CODES.ROLE_READ}>
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <RolesTable />
      </Suspense>
    </RequirePermission>
  );
}
