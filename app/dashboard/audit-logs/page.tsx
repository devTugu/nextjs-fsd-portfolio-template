import { Suspense } from 'react';
import { RequirePermission } from '@/features/auth';
import { AuditLogsTable } from '@/features/audit-logs';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { Skeleton } from '@/shared/ui/skeleton';

export default function AuditLogsPage() {
  return (
    <RequirePermission permission={PERMISSION_CODES.AUDIT_READ}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground text-sm">
            Review system activity for compliance and security investigations.
          </p>
        </div>
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <AuditLogsTable />
        </Suspense>
      </div>
    </RequirePermission>
  );
}
