import { getLocale, getTranslations } from 'next-intl/server';
import type { SiteSettingsAbout } from '@/entities/site-settings';
import { PUBLIC_ROUTES } from '@/shared/config/routes';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { cn } from '@/shared/lib/utils';
import {
  Container,
  MarketingButton,
  Section,
  SectionHeader,
} from '@/shared/ui/marketing';

interface AboutBriefSectionProps {
  about: SiteSettingsAbout;
  className?: string;
}

export async function AboutBriefSection({
  about,
  className,
}: AboutBriefSectionProps) {
  const t = await getTranslations('marketing.about');
  const locale = (await getLocale()) as Locale;
  const brief = pickLocalized(about.brief, locale);

  if (!brief) {
    return null;
  }

  return (
    <Section id="about" className={cn(className)}>
      <Container>
        <SectionHeader title={t('briefTitle')} description={brief} />
        <div className="mt-8 flex flex-wrap gap-4">
          <MarketingButton href={PUBLIC_ROUTES.ABOUT} variant="secondary">
            {t('learnMore')}
          </MarketingButton>
          <MarketingButton href={PUBLIC_ROUTES.ABOUT_HISTORY} variant="ghost">
            {t('historyLink')}
          </MarketingButton>
        </div>
      </Container>
    </Section>
  );
}
