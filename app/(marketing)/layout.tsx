import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { withHeaderNavFallback } from '@/entities/navigation';
import { getPublicNavigation, getPublicSiteSettings } from '@/entities/public-api';
import { resolveBrandContext } from '@/shared/config/brand';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized, pickLocalizedList } from '@/shared/lib/pick-localized';
import { hasServerSession } from '@/shared/lib/server-session';
import { SiteFooter, MarketingSiteHeader } from '@/widgets/marketing';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const locale = (await getLocale()) as Locale;
  const brand = resolveBrandContext({
    locale,
    cmsSiteName: settings?.header.siteName,
    header: settings?.header,
  });
  const seo = settings?.seo;

  const title =
    pickLocalized(seo?.title ?? { en: '', mn: '' }, locale) || brand.siteName;
  const description =
    pickLocalized(seo?.description ?? { en: '', mn: '' }, locale) ||
    pickLocalized(settings?.hero.description ?? { en: '', mn: '' }, locale);

  return {
    metadataBase: brand.siteUrl ? new URL(brand.siteUrl) : undefined,
    title,
    description,
    keywords: seo?.keywords ? pickLocalizedList(seo.keywords, locale) : undefined,
    icons: brand.assets.faviconUrl
      ? { icon: [{ url: brand.assets.faviconUrl }] }
      : undefined,
    openGraph: {
      title,
      description: description || undefined,
      ...(seo?.ogImageUrl ? { images: [{ url: seo.ogImageUrl }] } : {}),
    },
  };
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await getLocale()) as Locale;
  const [settings, hasSession, headerNav, footerNav] = await Promise.all([
    getPublicSiteSettings(),
    hasServerSession(),
    getPublicNavigation('HEADER'),
    getPublicNavigation('FOOTER'),
  ]);

  const brand = resolveBrandContext({
    locale,
    cmsSiteName: settings?.header.siteName,
    header: settings?.header,
  });
  const headerTree = withHeaderNavFallback(headerNav);
  const footer = settings?.footer ?? {
    copyright: { en: '', mn: '' },
    tagline: { en: '', mn: '' },
    socialLinks: [],
  };

  return (
    <div
      className="flex min-h-svh flex-col"
      style={
        settings?.theme?.brandColor
          ? ({
              '--marketing-indigo': settings.theme.brandColor,
            } as React.CSSProperties)
          : undefined
      }
    >
      <MarketingSiteHeader
        siteName={brand.siteName}
        logoUrl={brand.assets.logoUrl}
        logoDarkUrl={brand.assets.logoDarkUrl}
        headerTree={headerTree}
        hasSession={hasSession}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter footer={footer} siteName={brand.siteName} footerTree={footerNav} />
    </div>
  );
}
