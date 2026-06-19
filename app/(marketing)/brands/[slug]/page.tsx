import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPublicBrandBySlug } from '@/entities/public-api';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { BrandDetailContent } from '@/widgets/marketing/brands/brand-detail-content';

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getPublicBrandBySlug(slug);
  if (!brand) return { title: 'Brand' };

  const locale = (await getLocale()) as Locale;

  return {
    title: pickLocalized(brand.name, locale),
    description: pickLocalized(brand.description, locale),
    openGraph: brand.coverImageUrl
      ? { images: [{ url: brand.coverImageUrl }] }
      : undefined,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getPublicBrandBySlug(slug);
  if (!brand) notFound();

  return <BrandDetailContent brand={brand} />;
}
