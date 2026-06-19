import Link from 'next/link';
import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import type { BrandOutput } from '@/entities/brand';
import { PUBLIC_ROUTES } from '@/shared/config/routes';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import {
  Container,
  MarketingButton,
  Section,
  SectionHeader,
} from '@/shared/ui/marketing';

interface BrandsShowcaseSectionProps {
  brands: BrandOutput[];
  className?: string;
}

export async function BrandsShowcaseSection({
  brands,
  className,
}: BrandsShowcaseSectionProps) {
  const t = await getTranslations('marketing.brands');
  const locale = (await getLocale()) as Locale;
  const featured = brands.slice(0, 6);

  if (featured.length === 0) {
    return null;
  }

  return (
    <Section id="brands" className={cn(className)}>
      <Container>
        <SectionHeader title={t('title')} description={t('description')} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((brand) => {
            const name = pickLocalized(brand.name, locale);
            const description = pickLocalized(brand.description, locale);

            return (
              <Link
                key={brand.id}
                href={PUBLIC_ROUTES.BRAND(brand.slug)}
                className="group border-border/60 bg-background overflow-hidden rounded-xl border"
              >
                <div className="relative aspect-[16/10] bg-muted">
                  {brand.coverImageUrl ? (
                    <Image
                      src={brand.coverImageUrl}
                      alt={name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  ) : brand.logoUrl ? (
                    <div className="flex h-full items-center justify-center p-8">
                      <Image
                        src={brand.logoUrl}
                        alt={name}
                        width={120}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                  ) : null}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary">
                      {brand.type === 'RESTAURANT'
                        ? t('restaurant')
                        : t('event')}
                    </Badge>
                  </div>
                  <h3 className="font-semibold group-hover:text-[var(--marketing-indigo)]">
                    {name}
                  </h3>
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                    {description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <MarketingButton href={PUBLIC_ROUTES.BRANDS} variant="secondary">
            {t('viewAll')}
          </MarketingButton>
        </div>
      </Container>
    </Section>
  );
}
