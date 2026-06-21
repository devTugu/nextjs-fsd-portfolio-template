import { getLocale, getTranslations } from 'next-intl/server';
import type { SiteSettingsAbout } from '@/entities/site-settings';
import { MarketingSplitSection } from '@/features/marketing-split-section';
import { PUBLIC_ROUTES } from '@/shared/config/routes';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { cn } from '@/shared/lib/utils';
import {
  MarketingButton,
  MarketingLayoutMedia,
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

  const title = t('briefTitle');
  const imageAlt = title;

  return (
    <Section id="about" allowBleed className={cn(className)}>
      <MarketingSplitSection
        media={
          about.imageUrl ? (
            <MarketingLayoutMedia
              src={about.imageUrl}
              alt={imageAlt}
              bleed="right"
            />
          ) : undefined
        }
      >
        <SectionHeader align="left" className="mb-0" title={title} description={brief} />
        <div className="mt-8 flex flex-wrap gap-4">
          <MarketingButton href={PUBLIC_ROUTES.ABOUT} variant="secondary">
            {t('learnMore')}
          </MarketingButton>
          <MarketingButton href={PUBLIC_ROUTES.ABOUT_HISTORY} variant="ghost">
            {t('historyLink')}
          </MarketingButton>
        </div>
      </MarketingSplitSection>
    </Section>
  );
}
