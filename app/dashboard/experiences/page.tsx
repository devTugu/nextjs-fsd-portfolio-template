import { Suspense } from 'react';
import { RequirePermission } from '@/features/auth';
import { ExperiencesTable } from '@/features/experiences';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { Skeleton } from '@/shared/ui/skeleton';

export default function ExperiencesPage() {
  return (
    <RequirePermission permission={PERMISSION_CODES.EXPERIENCE_READ}>
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <ExperiencesTable />
      </Suspense>
    </RequirePermission>
  );
}
