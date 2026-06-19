import { getLocale, getTranslations } from 'next-intl/server';
import type { SiteSettingsAbout } from '@/entities/site-settings';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { Container, Section, SectionHeader } from '@/shared/ui/marketing';

interface AboutUsContentProps {
  about: SiteSettingsAbout;
}

export async function AboutUsContent({ about }: AboutUsContentProps) {
  const t = await getTranslations('marketing.about');
  const locale = (await getLocale()) as Locale;
  const mission = pickLocalized(about.mission, locale);
  const vision = pickLocalized(about.vision, locale);

  return (
    <Section className="pt-8">
      <Container>
        <SectionHeader title={t('pageTitle')} description={pickLocalized(about.brief, locale)} />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {mission ? (
            <div>
              <h2 className="text-xl font-semibold">{t('mission')}</h2>
              <p className="text-muted-foreground mt-3">{mission}</p>
            </div>
          ) : null}
          {vision ? (
            <div>
              <h2 className="text-xl font-semibold">{t('vision')}</h2>
              <p className="text-muted-foreground mt-3">{vision}</p>
            </div>
          ) : null}
        </div>
        {about.values.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-xl font-semibold">{t('values')}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {about.values.map((value, index) => (
                <div
                  key={`${value.icon}-${index}`}
                  className="border-border/60 rounded-lg border p-4"
                >
                  <p className="font-medium">{pickLocalized(value.label, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {about.stats.length > 0 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.stats.map((stat, index) => (
              <div
                key={`${stat.value}-${index}`}
                className="border-border/60 rounded-lg border p-4 text-center"
              >
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {pickLocalized(stat.label, locale)}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
