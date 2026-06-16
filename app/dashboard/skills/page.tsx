import { Suspense } from 'react';
import { RequirePermission } from '@/features/auth';
import { SkillsTable } from '@/features/skills';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { Skeleton } from '@/shared/ui/skeleton';

export default function SkillsPage() {
  return (
    <RequirePermission permission={PERMISSION_CODES.SKILL_READ}>
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <SkillsTable />
      </Suspense>
    </RequirePermission>
  );
}
