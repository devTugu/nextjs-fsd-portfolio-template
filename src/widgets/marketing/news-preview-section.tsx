import Link from 'next/link';
import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import type { NewsPostOutput } from '@/entities/news-post';
import { PUBLIC_ROUTES } from '@/shared/config/routes';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { readingTime } from '@/shared/lib/reading-time';
import { cn } from '@/shared/lib/utils';
import {
  Container,
  MarketingButton,
  Section,
  SectionHeader,
} from '@/shared/ui/marketing';

interface NewsPreviewSectionProps {
  posts: NewsPostOutput[];
  className?: string;
}

export async function NewsPreviewSection({
  posts,
  className,
}: NewsPreviewSectionProps) {
  const t = await getTranslations('marketing.news');
  const locale = (await getLocale()) as Locale;
  const featured = posts.slice(0, 3);

  if (featured.length === 0) {
    return null;
  }

  return (
    <Section id="news" className={cn(className)}>
      <Container>
        <SectionHeader title={t('title')} description={t('description')} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((post) => {
            const title = pickLocalized(post.title, locale);
            const excerpt = pickLocalized(post.excerpt, locale);
            const minutes = readingTime(pickLocalized(post.content, locale));

            return (
              <Link
                key={post.id}
                href={PUBLIC_ROUTES.NEWS_POST(post.slug)}
                className="group border-border/60 bg-background overflow-hidden rounded-xl border"
              >
                {post.coverImageUrl ? (
                  <div className="relative aspect-[16/10] bg-muted">
                    <Image
                      src={post.coverImageUrl}
                      alt={title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </div>
                ) : null}
                <div className="p-5">
                  <p className="text-muted-foreground mb-2 text-xs uppercase tracking-wide">
                    {t('readTime', { minutes })}
                  </p>
                  <h3 className="font-semibold group-hover:text-[var(--marketing-indigo)]">
                    {title}
                  </h3>
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {excerpt}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <MarketingButton href={PUBLIC_ROUTES.NEWS} variant="secondary">
            {t('viewAll')}
          </MarketingButton>
        </div>
      </Container>
    </Section>
  );
}
