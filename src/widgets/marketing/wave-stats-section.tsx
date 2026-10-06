import { getTranslations } from 'next-intl/server';
import { Container } from '@/shared/ui/marketing';
import { RibbonWaveField } from '@/shared/ui/marketing/ribbon-wave-field';
import { cn } from '@/shared/lib/utils';

const STAT_KEYS = ['brands', 'locales', 'uptime'] as const;

interface WaveStatsSectionProps {
  className?: string;
}

export async function WaveStatsSection({ className }: WaveStatsSectionProps) {
  const t = await getTranslations('marketing.waveStats');

  return (
    <section
      className={cn(
        'relative flex min-h-[28rem] flex-col overflow-hidden md:min-h-[34rem]',
        'bg-[var(--marketing-wave-section-bg)] text-white',
        className,
      )}
    >
      <RibbonWaveField />

      <Container className="relative z-10 pt-14 md:pt-20">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
          {t('title')}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
          {t('description')}
        </p>
      </Container>

      <div className="flex-1" aria-hidden />

      <Container className="relative z-10 pb-14 md:pb-20">
        <dl className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {STAT_KEYS.map((key) => (
            <div key={key}>
              <dt className="marketing-stat-gradient text-4xl font-semibold tracking-tight md:text-5xl">
                {t(`stats.${key}.value`)}
              </dt>
              <dd className="mt-2 text-sm text-white/55 md:text-base">
                {t(`stats.${key}.label`)}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
