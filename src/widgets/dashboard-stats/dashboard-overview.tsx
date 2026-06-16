'use client';

import dynamic from 'next/dynamic';
import { useDashboardStats } from '@/entities/dashboard';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { FadeIn } from '@/shared/ui/motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

const DashboardCharts = dynamic(
  () =>
    import('./dashboard-charts').then((module) => module.DashboardCharts),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full" />,
  },
);

function StatCard({
  title,
  value,
  loading,
}: {
  title: string;
  value: number;
  loading: boolean;
}) {
  return (
    <FadeIn>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

export function DashboardOverview() {
  const { can } = useAuthPermissions();
  const { data: stats, isLoading } = useDashboardStats();

  const showPortfolio =
    can(PERMISSION_CODES.PROJECT_READ) ||
    can(PERMISSION_CODES.SKILL_READ) ||
    can(PERMISSION_CODES.EXPERIENCE_READ);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Portfolio CMS admin dashboard
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {can(PERMISSION_CODES.USER_READ) ? (
          <StatCard
            title="Users"
            value={stats?.users ?? 0}
            loading={isLoading}
          />
        ) : null}
        {can(PERMISSION_CODES.ROLE_READ) ? (
          <StatCard
            title="Roles"
            value={stats?.roles ?? 0}
            loading={isLoading}
          />
        ) : null}
        {can(PERMISSION_CODES.PROJECT_READ) ? (
          <StatCard
            title="Projects"
            value={stats?.projects ?? 0}
            loading={isLoading}
          />
        ) : null}
        {can(PERMISSION_CODES.SKILL_READ) ? (
          <StatCard
            title="Skills"
            value={stats?.skills ?? 0}
            loading={isLoading}
          />
        ) : null}
        {can(PERMISSION_CODES.EXPERIENCE_READ) ? (
          <StatCard
            title="Experiences"
            value={stats?.experiences ?? 0}
            loading={isLoading}
          />
        ) : null}
        {can(PERMISSION_CODES.CONTACT_READ) ? (
          <StatCard
            title="Contact messages"
            value={stats?.contactMessages?.total ?? 0}
            loading={isLoading}
          />
        ) : null}
        {can(PERMISSION_CODES.CONTACT_READ) ? (
          <StatCard
            title="New messages"
            value={stats?.contactMessages?.new ?? 0}
            loading={isLoading}
          />
        ) : null}
      </div>

      {showPortfolio ? (
        <DashboardCharts
          projects={stats?.projects ?? 0}
          skills={stats?.skills ?? 0}
          experiences={stats?.experiences ?? 0}
          contactMessages={stats?.contactMessages}
          showContact={can(PERMISSION_CODES.CONTACT_READ)}
        />
      ) : null}
    </div>
  );
}
