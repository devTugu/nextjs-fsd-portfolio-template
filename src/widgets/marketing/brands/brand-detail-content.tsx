import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import type { BrandDetailOutput } from '@/entities/brand';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { Badge } from '@/shared/ui/badge';
import { Container, Section } from '@/shared/ui/marketing';

interface BrandDetailContentProps {
  brand: BrandDetailOutput;
}

export async function BrandDetailContent({ brand }: BrandDetailContentProps) {
  const t = await getTranslations('marketing.brands');
  const locale = (await getLocale()) as Locale;
  const name = pickLocalized(brand.name, locale);
  const description = pickLocalized(brand.description, locale);
  const address = brand.address ? pickLocalized(brand.address, locale) : null;
  const workHours = brand.workHours ? pickLocalized(brand.workHours, locale) : null;

  return (
    <>
      <Section className="pt-8">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-4">
                {brand.type === 'RESTAURANT' ? t('restaurant') : t('event')}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight">{name}</h1>
              <p className="text-muted-foreground mt-4 text-lg">{description}</p>
              {brand.phone ? (
                <p className="mt-4 text-sm">
                  <span className="font-medium">{t('phone')}:</span> {brand.phone}
                </p>
              ) : null}
              {address ? (
                <p className="mt-2 text-sm">
                  <span className="font-medium">{t('address')}:</span> {address}
                </p>
              ) : null}
              {workHours ? (
                <p className="mt-2 text-sm">
                  <span className="font-medium">{t('workHours')}:</span> {workHours}
                </p>
              ) : null}
            </div>
            {brand.coverImageUrl ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={brand.coverImageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      {brand.type === 'RESTAURANT' && brand.menuItems && brand.menuItems.length > 0 ? (
        <Section className="bg-muted/20">
          <Container>
            <h2 className="text-2xl font-semibold">{t('menuTitle')}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {brand.menuItems.map((item) => (
                <div
                  key={item.id}
                  className="border-border/60 bg-background rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium">
                        {pickLocalized(item.name, locale)}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {pickLocalized(item.description, locale)}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {pickLocalized(item.category, locale)}
                      </p>
                    </div>
                    <span className="font-semibold tabular-nums">
                      {item.price.toLocaleString(locale)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {brand.type === 'EVENT' && brand.events && brand.events.length > 0 ? (
        <Section className="bg-muted/20">
          <Container>
            <h2 className="text-2xl font-semibold">{t('eventsTitle')}</h2>
            <div className="mt-8 space-y-4">
              {brand.events.map((event) => (
                <div
                  key={event.id}
                  className="border-border/60 bg-background rounded-lg border p-4"
                >
                  <h3 className="font-medium">
                    {pickLocalized(event.title, locale)}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {pickLocalized(event.description, locale)}
                  </p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {new Date(event.eventDate).toLocaleDateString(locale)} ·{' '}
                    {pickLocalized(event.location, locale)}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
