import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublicSiteSettings } from '@/entities/public-api';
import { emptyLocalizedText } from '@/shared/i18n/localized-content';
import { AboutUsContent } from '@/widgets/marketing/about/about-us-content';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.about');
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function AboutUsPage() {
  const settings = await getPublicSiteSettings();
  const about = settings?.about ?? {
    brief: emptyLocalizedText(),
    mission: emptyLocalizedText(),
    vision: emptyLocalizedText(),
    values: [],
    stats: [],
  };

  return <AboutUsContent about={about} />;
}
