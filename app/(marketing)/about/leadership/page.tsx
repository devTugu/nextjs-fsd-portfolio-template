import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublicLeadership } from '@/entities/public-api';
import { LeadershipGrid } from '@/widgets/marketing/about/leadership-grid';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.about');
  return {
    title: t('leadershipTitle'),
    description: t('leadershipDescription'),
  };
}

export default async function AboutLeadershipPage() {
  const members = await getPublicLeadership();
  return <LeadershipGrid members={members} />;
}
