import type { Metadata } from 'next';
import type { NewsPostCategory } from '@/entities/news-post';
import { getTranslations } from 'next-intl/server';
import { getPublicNews } from '@/entities/public-api';
import { NewsListContent } from '@/widgets/marketing/news/news-list-content';

interface NewsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.news');
  return { title: t('title'), description: t('description') };
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { category } = await searchParams;
  const validCategories: NewsPostCategory[] = [
    'PRODUCT',
    'ENGINEERING',
    'CORPORATE',
    'INDUSTRY',
  ];
  const activeCategory = validCategories.includes(category as NewsPostCategory)
    ? (category as NewsPostCategory)
    : undefined;

  const result = await getPublicNews({
    category: activeCategory,
    limit: 24,
  });

  return <NewsListContent posts={result.items} activeCategory={activeCategory} />;
}
