import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import type { NewsPostOutput } from '@/entities/news-post';
import { PUBLIC_ROUTES } from '@/shared/config/routes';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { readingTime } from '@/shared/lib/reading-time';
import { MarkdownContent } from '@/shared/ui/markdown-content';
import { Container, Section } from '@/shared/ui/marketing';
import { NewsNewsletterSection } from './news-newsletter-section';

interface NewsArticleContentProps {
  post: NewsPostOutput;
}

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="bg-[var(--marketing-indigo)]/10 text-[var(--marketing-indigo)] inline-flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
      {initials}
    </span>
  );
}

export async function NewsArticleContent({ post }: NewsArticleContentProps) {
  const t = await getTranslations('marketing.news');
  const locale = (await getLocale()) as Locale;
  const title = pickLocalized(post.title, locale);
  const authorName = pickLocalized(post.authorName, locale);
  const authorRole = pickLocalized(post.authorRole, locale);
  const content = pickLocalized(post.content, locale);
  const readMinutes = readingTime(content);
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <>
      <Section className="border-border/60 border-b pt-12 pb-6">
        <Container className="max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav className="text-muted-foreground flex items-center gap-1 text-sm">
              <Link href={PUBLIC_ROUTES.NEWS} className="hover:text-foreground">
                {t('title')}
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="text-[var(--marketing-indigo)]">
                {t(`categories.${post.category}`)}
              </span>
            </nav>
            {publishedDate ? (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <time>{publishedDate}</time>
                <span aria-hidden>·</span>
                <span>{t('readTime', { minutes: readMinutes })}</span>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">
                {t('readTime', { minutes: readMinutes })}
              </span>
            )}
          </div>
        </Container>
      </Section>

      <Section className="pt-8 pb-4">
        <Container className="max-w-4xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {title}
          </h1>
          <div className="mt-6 flex items-center gap-3">
            <AuthorAvatar name={authorName} />
            <div>
              <p className="font-medium">{authorName}</p>
              <p className="text-muted-foreground text-sm">{authorRole}</p>
            </div>
          </div>
        </Container>
      </Section>

      {post.coverImageUrl ? (
        <Section className="py-0">
          <Container className="max-w-4xl">
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-muted shadow-sm">
              <Image
                src={post.coverImageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 896px"
                priority
              />
            </div>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container className="max-w-3xl">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <MarkdownContent content={content} />
          </article>
        </Container>
      </Section>

      <NewsNewsletterSection />
    </>
  );
}
