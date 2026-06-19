'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  Building2,
  Clock,
  LayoutDashboard,
  Mail,
  MailWarning,
  Newspaper,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useDashboardStats } from '@/entities/dashboard';
import { useAuthPermissions } from '@/features/auth';
import { useAuthStore } from '@/features/auth/model/store';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { ROUTES } from '@/shared/config/routes';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { Skeleton } from '@/shared/ui/skeleton';
import type { ReactNode } from 'react';
import type { AppMessages } from '@/shared/i18n/messages';
import { cn } from '@/shared/lib/utils';
import { DashboardInsights } from './dashboard-insights';

type NavTitleKey = keyof AppMessages['nav'];

interface StatCardProps {
  title: string;
  value: number;
  loading: boolean;
  icon: LucideIcon;
  href?: string;
  accent?: 'blue' | 'violet' | 'amber' | 'emerald' | 'rose';
  badge?: string;
}

const accentStyles = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
} as const;

function StatCard({
  title,
  value,
  loading,
  icon: Icon,
  href,
  accent = 'blue',
  badge,
}: StatCardProps) {
  const t = useTranslations('dashboard');

  const card = (
    <Card
      className={cn(
        'gap-4 py-4',
        href && 'hover:border-primary/40 hover:bg-muted/20 transition-colors',
      )}
    >
      <CardHeader className="px-4">
        <CardDescription className="line-clamp-1">{title}</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {loading ? <Skeleton className="h-8 w-14" /> : value}
        </CardTitle>
        {badge ? (
          <Badge variant="secondary" className="w-fit text-xs">
            {badge}
          </Badge>
        ) : null}
        <CardAction>
          <div
            className={cn(
              'flex size-9 items-center justify-center rounded-lg',
              accentStyles[accent],
            )}
          >
            <Icon className="size-4" aria-hidden />
          </div>
        </CardAction>
        {href ? (
          <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
            {t('view')}
            <ArrowRight className="size-3" aria-hidden />
          </span>
        ) : null}
      </CardHeader>
    </Card>
  );

  if (!href) {
    return card;
  }

  return (
    <Link
      href={href}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {card}
    </Link>
  );
}

interface QuickAction {
  labelKey: NavTitleKey;
  href: string;
  icon: LucideIcon;
  permission: (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES];
}

const quickActions: QuickAction[] = [
  {
    labelKey: 'brands',
    href: ROUTES.BRANDS,
    icon: Building2,
    permission: PERMISSION_CODES.BRAND_READ,
  },
  {
    labelKey: 'news',
    href: ROUTES.NEWS,
    icon: Newspaper,
    permission: PERMISSION_CODES.BLOG_READ,
  },
  {
    labelKey: 'contactMessages',
    href: ROUTES.CONTACT_MESSAGES,
    icon: Mail,
    permission: PERMISSION_CODES.CONTACT_READ,
  },
  {
    labelKey: 'siteSettings',
    href: ROUTES.SITE_SETTINGS,
    icon: Settings,
    permission: PERMISSION_CODES.SITE_SETTING_READ,
  },
];

function OverviewSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
    </section>
  );
}

export function DashboardOverview() {
  const t = useTranslations('dashboard');
  const tNav = useTranslations('nav');
  const { can } = useAuthPermissions();
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading } = useDashboardStats();

  const showContentInsights =
    can(PERMISSION_CODES.BRAND_READ) ||
    can(PERMISSION_CODES.HISTORY_READ) ||
    can(PERMISSION_CODES.BLOG_READ);

  const showContactInsights = can(PERMISSION_CODES.CONTACT_READ);

  const visibleQuickActions = quickActions.filter((action) =>
    can(action.permission),
  );

  const newMessages = stats?.contactMessages?.new ?? 0;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <LayoutDashboard className="text-muted-foreground size-6" aria-hidden />
            {t('title')}
          </CardTitle>
          <CardDescription>
            {user?.email ? t('welcome', { email: user.email }) : t('subtitle')}
          </CardDescription>
        </CardHeader>
        {visibleQuickActions.length > 0 ? (
          <CardContent className="flex flex-wrap gap-2">
            {visibleQuickActions.map((action) => (
              <Button key={action.href} variant="secondary" size="sm" asChild>
                <Link href={action.href}>
                  <action.icon className="size-4" aria-hidden />
                  {tNav(action.labelKey)}
                </Link>
              </Button>
            ))}
          </CardContent>
        ) : null}
      </Card>

      {showContactInsights && newMessages > 0 ? (
        <Alert variant="warning">
          <MailWarning aria-hidden />
          <AlertTitle>{t('newMessagesAlert', { count: newMessages })}</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>{t('newMessagesAlertDescription')}</span>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.CONTACT_MESSAGES}>{t('reviewInbox')}</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {can(PERMISSION_CODES.USER_READ) || can(PERMISSION_CODES.ROLE_READ) ? (
        <>
          <OverviewSection
            title={t('sectionSystem')}
            description={t('sectionSystemDescription')}
          >
            {can(PERMISSION_CODES.USER_READ) ? (
              <StatCard
                title={t('users')}
                value={stats?.users ?? 0}
                loading={isLoading}
                icon={Users}
                href={ROUTES.USERS}
                accent="blue"
              />
            ) : null}
            {can(PERMISSION_CODES.ROLE_READ) ? (
              <StatCard
                title={t('roles')}
                value={stats?.roles ?? 0}
                loading={isLoading}
                icon={Shield}
                href={ROUTES.ROLES}
                accent="violet"
              />
            ) : null}
          </OverviewSection>
          <Separator />
        </>
      ) : null}

      {showContentInsights ? (
        <>
          <OverviewSection
            title={t('sectionContent')}
            description={t('sectionContentDescription')}
          >
            {can(PERMISSION_CODES.BRAND_READ) ? (
              <StatCard
                title={t('brands')}
                value={stats?.brands ?? 0}
                loading={isLoading}
                icon={Building2}
                href={ROUTES.BRANDS}
                accent="emerald"
              />
            ) : null}
            {can(PERMISSION_CODES.HISTORY_READ) ? (
              <StatCard
                title={t('history')}
                value={stats?.history ?? 0}
                loading={isLoading}
                icon={Clock}
                href={ROUTES.HISTORY}
                accent="amber"
              />
            ) : null}
            {can(PERMISSION_CODES.BLOG_READ) ? (
              <StatCard
                title={t('news')}
                value={stats?.news ?? 0}
                loading={isLoading}
                icon={Newspaper}
                href={ROUTES.NEWS}
                accent="violet"
              />
            ) : null}
          </OverviewSection>
          <Separator />
        </>
      ) : null}

      {showContactInsights ? (
        <OverviewSection
          title={t('sectionInbox')}
          description={t('sectionInboxDescription')}
        >
          <StatCard
            title={t('contactMessages')}
            value={stats?.contactMessages?.total ?? 0}
            loading={isLoading}
            icon={Mail}
            href={ROUTES.CONTACT_MESSAGES}
            accent="blue"
          />
          <StatCard
            title={t('newMessages')}
            value={newMessages}
            loading={isLoading}
            icon={Mail}
            href={ROUTES.CONTACT_MESSAGES}
            accent="rose"
            badge={newMessages > 0 ? t('new') : undefined}
          />
        </OverviewSection>
      ) : null}

      {showContentInsights || showContactInsights ? (
        <DashboardInsights
          brands={stats?.brands ?? 0}
          history={stats?.history ?? 0}
          news={stats?.news ?? 0}
          contactMessages={stats?.contactMessages}
          showContact={showContactInsights}
          showContent={showContentInsights}
        />
      ) : null}
    </div>
  );
}
