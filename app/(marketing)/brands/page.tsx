import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublicBrands } from '@/entities/public-api';
import { BrandGrid } from '@/widgets/marketing/brands/brand-grid';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.brands');
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function BrandsPage() {
  const brands = await getPublicBrands();
  return <BrandGrid brands={brands} />;
}
