import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublicTeam } from '@/entities/public-api';
import { TeamGrid } from '@/widgets/marketing/about/team-grid';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.about');
  return { title: t('teamTitle'), description: t('teamDescription') };
}

export default async function AboutTeamPage() {
  const members = await getPublicTeam();
  return <TeamGrid members={members} />;
}
