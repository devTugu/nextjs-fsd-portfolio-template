import { getTranslations } from 'next-intl/server';
import type { SiteSettingsContactInfo } from '@/entities/site-settings';
import { PUBLIC_ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import {
  Container,
  GradientRibbon,
  MarketingButton,
  Section,
} from '@/shared/ui/marketing';

interface ContactCtaSectionProps {
  contactInfo?: SiteSettingsContactInfo;
  className?: string;
}

export async function ContactCtaSection({
  contactInfo,
  className,
}: ContactCtaSectionProps) {
  const t = await getTranslations('marketing.contactCta');

  return (
    <Section
      className={cn(
        'relative overflow-hidden bg-[var(--marketing-navy)] py-20 text-white md:py-28',
        className,
      )}
    >
      <GradientRibbon className="bottom-0 h-[200px] opacity-70" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-white/70 md:text-lg">
            {t('description')}
          </p>
          {contactInfo?.email ? (
            <p className="mt-2 text-sm text-white/60">{contactInfo.email}</p>
          ) : null}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MarketingButton
              href={PUBLIC_ROUTES.CONTACT}
              variant="primary"
              className="bg-white text-[var(--marketing-navy)] hover:bg-white/90"
            >
              {t('button')}
            </MarketingButton>
            <MarketingButton
              href={PUBLIC_ROUTES.BRANDS}
              variant="secondary"
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              {t('brandsButton')}
            </MarketingButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
