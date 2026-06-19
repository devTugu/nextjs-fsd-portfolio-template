import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import type { HistoryEntryOutput } from '@/entities/history';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { Container, Section, SectionHeader } from '@/shared/ui/marketing';

interface HistoryTimelineProps {
  entries: HistoryEntryOutput[];
}

export async function HistoryTimeline({ entries }: HistoryTimelineProps) {
  const t = await getTranslations('marketing.about');
  const locale = (await getLocale()) as Locale;

  if (entries.length === 0) {
    return (
      <Section className="pt-8">
        <Container>
          <p className="text-muted-foreground text-center">{t('historyEmpty')}</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="pt-8">
      <Container>
        <SectionHeader title={t('historyTitle')} description={t('historyDescription')} />
        <div className="mt-12 space-y-8">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border-border/60 grid gap-6 rounded-xl border p-6 md:grid-cols-[120px_1fr]"
            >
              <div className="text-[var(--marketing-indigo)] text-2xl font-bold">
                {entry.year}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {pickLocalized(entry.title, locale)}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {pickLocalized(entry.description, locale)}
                </p>
                {entry.imageUrl ? (
                  <div className="relative mt-4 aspect-video max-w-md overflow-hidden rounded-lg">
                    <Image
                      src={entry.imageUrl}
                      alt={pickLocalized(entry.title, locale)}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
