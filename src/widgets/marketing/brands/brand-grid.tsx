import Link from 'next/link';
import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import type { BrandOutput } from '@/entities/brand';
import { PUBLIC_ROUTES } from '@/shared/config/routes';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { Badge } from '@/shared/ui/badge';
import { Container, Section, SectionHeader } from '@/shared/ui/marketing';

interface BrandGridProps {
  brands: BrandOutput[];
}

export async function BrandGrid({ brands }: BrandGridProps) {
  const t = await getTranslations('marketing.brands');
  const locale = (await getLocale()) as Locale;

  if (brands.length === 0) {
    return (
      <Section>
        <Container>
          <p className="text-muted-foreground text-center">{t('empty')}</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <SectionHeader title={t('pageTitle')} description={t('pageDescription')} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => {
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
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  ) : null}
                </div>
                <div className="p-5">
                  <Badge variant="secondary" className="mb-2">
                    {brand.type === 'RESTAURANT' ? t('restaurant') : t('event')}
                  </Badge>
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
      </Container>
    </Section>
  );
}
