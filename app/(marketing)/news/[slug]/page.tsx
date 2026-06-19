import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPublicNewsBySlug } from '@/entities/public-api';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { NewsArticleContent } from '@/widgets/marketing/news/news-article-content';

interface NewsPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicNewsBySlug(slug);
  if (!post) return { title: 'News' };

  const locale = (await getLocale()) as Locale;

  return {
    title: pickLocalized(post.title, locale),
    description: pickLocalized(post.excerpt, locale),
    openGraph: post.coverImageUrl
      ? { images: [{ url: post.coverImageUrl }] }
      : undefined,
  };
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params;
  const post = await getPublicNewsBySlug(slug);
  if (!post) notFound();

  return <NewsArticleContent post={post} />;
}
