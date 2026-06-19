import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublicHistory } from '@/entities/public-api';
import { HistoryTimeline } from '@/widgets/marketing/about/history-timeline';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.about');
  return { title: t('historyTitle'), description: t('historyDescription') };
}

export default async function AboutHistoryPage() {
  const entries = await getPublicHistory();
  return <HistoryTimeline entries={entries} />;
}
