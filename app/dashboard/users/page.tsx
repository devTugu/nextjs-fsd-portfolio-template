import { Suspense } from 'react';
import { RequirePermission } from '@/features/auth';
import { UsersTable } from '@/features/users';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { Skeleton } from '@/shared/ui/skeleton';

export default function UsersPage() {
  return (
    <RequirePermission permission={PERMISSION_CODES.USER_READ}>
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <UsersTable />
      </Suspense>
    </RequirePermission>
  );
}
