'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { DashboardContactStats } from '@/entities/dashboard';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
interface BreakdownItem {
  key: string;
  label: string;
  value: number;
  barClassName?: string;
}

function BreakdownList({
  items,
  total,
  emptyLabel,
}: {
  items: BreakdownItem[];
  total: number;
  emptyLabel: string;
}) {
  if (total === 0) {
    return (
      <p className="text-muted-foreground text-sm">{emptyLabel}</p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const percent = Math.round((item.value / total) * 100);
        return (
          <li key={item.key} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="tabular-nums">
                  {item.value}
                </Badge>
                <span className="text-muted-foreground w-10 text-right text-xs tabular-nums">
                  {percent}%
                </span>
              </div>
            </div>
            <Progress
              value={item.value}
              max={total}
              className={cn('h-1.5', item.barClassName)}
            />
          </li>
        );
      })}
    </ul>
  );
}

interface DashboardInsightsProps {
  brands: number;
  history: number;
  news: number;
  contactMessages?: DashboardContactStats;
  showContact: boolean;
  showContent: boolean;
}

export function DashboardInsights({
  brands,
  history,
  news,
  contactMessages,
  showContact,
  showContent,
}: DashboardInsightsProps) {
  const t = useTranslations('dashboard');

  const contentTotal = brands + history + news;
  const contentItems: BreakdownItem[] = [
    { key: 'brands', label: t('brands'), value: brands },
    { key: 'history', label: t('history'), value: history },
    { key: 'news', label: t('news'), value: news },
  ];

  const contactTotal = contactMessages?.total ?? 0;
  const contactItems: BreakdownItem[] = [
    { key: 'new', label: t('new'), value: contactMessages?.new ?? 0 },
    { key: 'read', label: t('read'), value: contactMessages?.read ?? 0 },
    {
      key: 'archived',
      label: t('archived'),
      value: contactMessages?.archived ?? 0,
    },
  ];

  if (!showContent && !showContact) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-medium">{t('insightsTitle')}</h3>
        <p className="text-muted-foreground text-sm">{t('insightsDescription')}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {showContent ? (
          <Card>
            <CardHeader className="border-b">
              <CardTitle>{t('cmsContent')}</CardTitle>
              <CardDescription>{t('cmsContentDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <BreakdownList
                items={contentItems}
                total={contentTotal}
                emptyLabel={t('noCmsContent')}
              />
            </CardContent>
            <CardFooter className="border-t justify-between">
              <span className="text-muted-foreground text-sm">
                {t('totalPublished', { count: contentTotal })}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href={ROUTES.BRANDS}>{t('manageContent')}</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : null}

        {showContact ? (
          <Card>
            <CardHeader className="border-b">
              <CardTitle>{t('contactInbox')}</CardTitle>
              <CardDescription>{t('contactInboxDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <BreakdownList
                items={contactItems}
                total={contactTotal}
                emptyLabel={t('noContactMessages')}
              />
            </CardContent>
            <CardFooter className="border-t justify-between">
              <span className="text-muted-foreground text-sm">
                {t('totalMessages', { count: contactTotal })}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href={ROUTES.CONTACT_MESSAGES}>{t('openInbox')}</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
