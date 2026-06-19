import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PUBLIC_ROUTES } from '@/shared/config/routes';
import { Container } from '@/shared/ui/marketing';

const TOPIC_KEYS = ['product', 'engineering', 'corporate', 'industry', 'guides'] as const;

const TOPIC_GRADIENTS: Record<(typeof TOPIC_KEYS)[number], string> = {
  product: 'linear-gradient(160deg, oklch(0.72 0.12 230), oklch(0.55 0.2 264))',
  engineering: 'linear-gradient(160deg, oklch(0.62 0.18 264), oklch(0.48 0.22 292))',
  corporate: 'linear-gradient(160deg, oklch(0.55 0.2 264), oklch(0.42 0.18 280))',
  industry: 'linear-gradient(160deg, oklch(0.5 0.22 292), oklch(0.38 0.2 300))',
  guides: 'linear-gradient(160deg, oklch(0.45 0.2 292), oklch(0.32 0.16 280))',
};

export async function NewsTopicCards() {
  const t = await getTranslations('marketing.news.topics');

  return (
    <Container>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {TOPIC_KEYS.map((key) => {
          const href =
            key === 'guides'
              ? PUBLIC_ROUTES.NEWS
              : `${PUBLIC_ROUTES.NEWS}?category=${key.toUpperCase()}`;

          return (
            <Link
              key={key}
              href={href}
              className="group flex min-h-[140px] flex-col justify-between rounded-xl p-5 text-white shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ background: TOPIC_GRADIENTS[key] }}
            >
              <span className="text-sm font-semibold leading-snug">{t(`${key}.title`)}</span>
              <span className="text-xs text-white/80 group-hover:text-white">
                {t(`${key}.cta`)} →
              </span>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
