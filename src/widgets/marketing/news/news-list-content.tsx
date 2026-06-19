import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import type { NewsPostOutput } from '@/entities/news-post';
import { PUBLIC_ROUTES } from '@/shared/config/routes';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { readingTime } from '@/shared/lib/reading-time';
import {
  Container,
  GradientMesh,
  Section,
} from '@/shared/ui/marketing';
import { Badge } from '@/shared/ui/badge';
import { NewsNewsletterSection } from './news-newsletter-section';
import { NewsTopicCards } from './news-topic-cards';

interface NewsListContentProps {
  posts: NewsPostOutput[];
  activeCategory?: string;
}

const CATEGORIES = ['ALL', 'PRODUCT', 'ENGINEERING', 'CORPORATE', 'INDUSTRY'] as const;

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="bg-[var(--marketing-indigo)]/10 text-[var(--marketing-indigo)] inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
      {initials}
    </span>
  );
}

export async function NewsListContent({ posts, activeCategory }: NewsListContentProps) {
  const t = await getTranslations('marketing.news');
  const locale = (await getLocale()) as Locale;
  const featured = posts[0];
  const rest = posts.slice(featured ? 1 : 0);
  const featuredTitle = featured ? pickLocalized(featured.title, locale) : '';
  const featuredExcerpt = featured ? pickLocalized(featured.excerpt, locale) : '';
  const featuredAuthorName = featured ? pickLocalized(featured.authorName, locale) : '';
  const featuredAuthorRole = featured ? pickLocalized(featured.authorRole, locale) : '';
  const featuredReadMinutes = featured
    ? readingTime(
        pickLocalized(featured.content, locale) || pickLocalized(featured.excerpt, locale),
      )
    : 0;

  return (
    <>
      <Section className="relative overflow-hidden pt-12 pb-8 md:pt-16">
        <GradientMesh className="opacity-60" />
        <Container className="relative">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{t('title')}</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">{t('description')}</p>
        </Container>
      </Section>

      {featured ? (
        <Section className="pt-0">
          <Container>
            <Link
              href={PUBLIC_ROUTES.NEWS_POST(featured.slug)}
              className="group border-border/60 grid overflow-hidden rounded-2xl border bg-background shadow-sm md:grid-cols-[1.1fr_1fr]"
            >
              <div className="flex flex-col justify-center p-8 md:p-10">
                <Badge variant="secondary" className="mb-4 w-fit">
                  {t(`categories.${featured.category}`)}
                </Badge>
                <h2 className="text-2xl font-semibold tracking-tight group-hover:text-[var(--marketing-indigo)] md:text-3xl">
                  {featuredTitle}
                </h2>
                <p className="text-muted-foreground mt-4 line-clamp-3">{featuredExcerpt}</p>
                <div className="mt-6 flex items-center gap-3">
                  <AuthorAvatar name={featuredAuthorName} />
                  <div>
                    <p className="text-sm font-medium">{featuredAuthorName}</p>
                    <p className="text-muted-foreground text-xs">
                      {featuredAuthorRole}
                      {featuredReadMinutes > 0
                        ? ` · ${t('readTime', { minutes: featuredReadMinutes })}`
                        : null}
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[240px] bg-muted md:min-h-[320px]">
                {featured.coverImageUrl ? (
                  <Image
                    src={featured.coverImageUrl}
                    alt={featuredTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: 'var(--marketing-ribbon-gradient)' }}
                  />
                )}
              </div>
            </Link>
          </Container>
        </Section>
      ) : null}

      <Section className="pt-0">
        <Container>
          <div className="mb-10 flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const href =
                category === 'ALL'
                  ? PUBLIC_ROUTES.NEWS
                  : `${PUBLIC_ROUTES.NEWS}?category=${category}`;
              const isActive =
                category === 'ALL' ? !activeCategory : activeCategory === category;

              return (
                <Link
                  key={category}
                  href={href}
                  className={
                    isActive
                      ? 'bg-[var(--marketing-indigo)] rounded-full px-4 py-1.5 text-sm text-white'
                      : 'bg-muted text-muted-foreground hover:text-foreground rounded-full px-4 py-1.5 text-sm'
                  }
                >
                  {t(`categories.${category}`)}
                </Link>
              );
            })}
          </div>

          <div className="divide-border/60 divide-y">
            {rest.map((post) => {
              const title = pickLocalized(post.title, locale);
              const excerpt = pickLocalized(post.excerpt, locale);
              const authorName = pickLocalized(post.authorName, locale);
              const readMinutes = readingTime(
                pickLocalized(post.content, locale) || excerpt,
              );

              return (
              <Link
                key={post.id}
                href={PUBLIC_ROUTES.NEWS_POST(post.slug)}
                className="group grid gap-8 py-10 md:grid-cols-[1fr_280px] md:items-center lg:grid-cols-[1fr_320px]"
              >
                <div>
                  <Badge variant="outline" className="mb-3">
                    {t(`categories.${post.category}`)}
                  </Badge>
                  <h3 className="text-xl font-semibold group-hover:text-[var(--marketing-indigo)] md:text-2xl">
                    {title}
                  </h3>
                  <p className="text-muted-foreground mt-3 line-clamp-2">{excerpt}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--marketing-indigo)]">
                    {t('readMore')}
                    <ChevronRight className="size-4" />
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <AuthorAvatar name={authorName} />
                    <p className="text-muted-foreground text-sm">
                      {authorName}
                      {post.publishedAt
                        ? ` · ${new Date(post.publishedAt).toLocaleDateString()}`
                        : null}
                      {` · ${t('readTime', { minutes: readMinutes })}`}
                    </p>
                  </div>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-sm">
                  {post.coverImageUrl ? (
                    <Image
                      src={post.coverImageUrl}
                      alt={title}
                      fill
                      className="object-cover transition-transform group-hover:scale-[1.02]"
                      sizes="320px"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: 'var(--marketing-hero-gradient)' }}
                    />
                  )}
                </div>
              </Link>
              );
            })}
          </div>

          {rest.length === 0 && !featured ? (
            <p className="text-muted-foreground py-12 text-center">{t('empty')}</p>
          ) : null}
        </Container>
      </Section>

      <Section className="bg-muted/20 pt-0">
        <NewsTopicCards />
      </Section>

      <NewsNewsletterSection />
    </>
  );
}
