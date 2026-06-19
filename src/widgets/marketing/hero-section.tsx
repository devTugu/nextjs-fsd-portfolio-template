import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import type { SiteSettingsHero } from '@/entities/site-settings';
import { resolveEnvBrandName } from '@/shared/config/brand';
import { PUBLIC_ROUTES } from '@/shared/config/routes';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import {
  AnimatedMesh,
  Container,
  MarketingButton,
  Section,
} from '@/shared/ui/marketing';
import { LogoStripSection } from '@/widgets/marketing/logo-strip-section';

interface HeroSectionProps {
  hero: SiteSettingsHero;
}

export async function HeroSection({ hero }: HeroSectionProps) {
  const t = await getTranslations('marketing.hero');
  const locale = (await getLocale()) as Locale;
  const brandName = resolveEnvBrandName();

  const title =
    pickLocalized(hero.title, locale) ||
    t('fallbackTitle', { brandName });
  const description =
    pickLocalized(hero.description, locale) ||
    t('fallbackDescription', { brandName });
  const bannerText = pickLocalized(hero.subtitle, locale) || t('bannerLabel');
  const primaryLabel = pickLocalized(hero.ctaLabel, locale) || t('primaryCta');
  const primaryHref = hero.ctaUrl || PUBLIC_ROUTES.CONTACT;
  const secondaryLabel =
    pickLocalized(hero.secondaryCtaLabel, locale) || t('secondaryCta');
  const secondaryHref = hero.secondaryCtaUrl || PUBLIC_ROUTES.BRANDS;

  return (
    <Section className="relative -mt-16 min-h-svh overflow-hidden pt-16 pb-0">
      <AnimatedMesh />
      <Container className="relative flex min-h-[calc(100svh-4rem)] flex-col">
        <div className="flex flex-1 flex-col justify-center py-12 md:py-16">
          <div className="max-w-2xl space-y-6">
            <div className="bg-[var(--marketing-pill-bg)] inline-flex items-center gap-2 rounded-full border border-border/40 px-4 py-2 text-sm">
              <span>{bannerText}</span>
              <span className="text-muted-foreground">•</span>
              <Link
                href={PUBLIC_ROUTES.NEWS}
                className="text-[var(--marketing-indigo)] font-medium"
              >
                {t('bannerLink')}
              </Link>
            </div>
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl md:leading-[1.05]">
              {title}
            </h1>
            <p className="text-muted-foreground max-w-xl text-xl">{description}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <MarketingButton href={primaryHref} variant="primary">
                {primaryLabel}
              </MarketingButton>
              <MarketingButton href={secondaryHref} variant="secondary">
                {secondaryLabel}
              </MarketingButton>
            </div>
          </div>
        </div>

        <LogoStripSection embedded />
      </Container>
    </Section>
  );
}
