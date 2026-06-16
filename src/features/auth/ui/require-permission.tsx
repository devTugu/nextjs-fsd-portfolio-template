'use client';

import { ShieldOff } from 'lucide-react';
import type { PermissionCode } from '@/shared/config/permissions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { useAuthPermissions } from '../hooks/use-permissions';

interface RequirePermissionProps {
  permission: PermissionCode;
  children: React.ReactNode;
}

export function RequirePermission({
  permission,
  children,
}: RequirePermissionProps) {
  const { can } = useAuthPermissions();

  if (!can(permission)) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldOff className="size-5 text-muted-foreground" />
            <CardTitle>Access denied</CardTitle>
          </div>
          <CardDescription>
            You do not have permission to view this page ({permission}).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Contact an administrator if you believe this is a mistake.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
