'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { NavigationNodeTree } from '@/entities/navigation';
import { resolveNavigationLabel } from '@/entities/navigation';
import { PUBLIC_ROUTES, ROUTES } from '@/shared/config/routes';
import type { Locale } from '@/shared/i18n/config';
import { LocaleSwitcher } from '@/shared/i18n/locale-switcher';
import { Button } from '@/shared/ui/button';
import { Container, MarketingButton, MarketingLayoutGrid } from '@/shared/ui/marketing';
import { ThemeToggle } from '@/shared/ui/theme-toggle';
import { MegaNavigationMenu } from '@/widgets/marketing/mega-navigation-menu';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { cn } from '@/shared/lib/utils';

interface SiteHeaderProps {
  siteName: string;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  headerTree: NavigationNodeTree[];
  hasSession: boolean;
  hasHero?: boolean;
}

export function SiteHeader({
  siteName,
  logoUrl,
  logoDarkUrl,
  headerTree,
  hasSession,
  hasHero = false,
}: SiteHeaderProps) {
  const t = useTranslations('marketing.nav');
  const locale = useLocale() as Locale;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const authHref = hasSession ? ROUTES.DASHBOARD : ROUTES.LOGIN;
  const authLabel = hasSession ? t('dashboard') : t('signIn');
  const isTransparent = !isScrolled && !!hasHero;

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300',
        isTransparent
          ? 'border-transparent bg-transparent'
          : 'border-border/60 bg-background/95 border-b shadow-sm backdrop-blur-md',
      )}
    >
      <MarketingLayoutGrid>
        <div className="col-span-1 flex h-16 items-center gap-4 lg:col-span-4">
          <Link
            href={PUBLIC_ROUTES.HOME}
            className="shrink-0 text-lg font-semibold tracking-tight"
          >
            <BrandLogo
              name={siteName}
              logoUrl={logoUrl}
              logoDarkUrl={logoDarkUrl}
              showName={!logoUrl && !logoDarkUrl}
              className={cn(isTransparent && !logoDarkUrl && 'brightness-0 invert')}
            />
          </Link>

          <div className="hidden flex-1 justify-center lg:flex">
            <MegaNavigationMenu
              tree={headerTree}
              locale={locale}
              transparent={isTransparent}
            />
          </div>

          <div className="hidden items-center gap-2 lg:ml-auto lg:flex">
            <ThemeToggle
              className={cn(
                isTransparent && 'text-white hover:bg-white/10 hover:text-white',
              )}
            />
            <Link
              href={authHref}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isTransparent
                  ? 'text-white/90 hover:bg-white/10 hover:text-white'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              )}
            >
              {authLabel}
            </Link>
            <MarketingButton href={PUBLIC_ROUTES.CONTACT} variant="primary">
              {t('contactSales')}
            </MarketingButton>
            <LocaleSwitcher
              variant="flags"
              className={cn(isTransparent && 'text-white hover:bg-white/10')}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
            onClick={() => setMobileOpen((v) => !v)}
            className={cn('ml-auto lg:hidden', isTransparent && 'text-white hover:bg-white/10')}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </MarketingLayoutGrid>

      {mobileOpen ? (
        <MobileNav
          authHref={authHref}
          authLabel={authLabel}
          headerTree={headerTree}
          locale={locale}
          onClose={() => setMobileOpen(false)}
          t={t}
        />
      ) : null}
    </header>
  );
}

function MobileNav({
  authHref,
  authLabel,
  headerTree,
  locale,
  onClose,
  t,
}: {
  authHref: string;
  authLabel: string;
  headerTree: NavigationNodeTree[];
  locale: Locale;
  onClose: () => void;
  t: ReturnType<typeof useTranslations<'marketing.nav'>>;
}) {
  return (
    <div className="border-border/60 bg-background border-t shadow-lg lg:hidden">
      <MarketingLayoutGrid className="py-6">
        <div className="col-span-1 lg:col-span-4">
          <MobileNavContent
          authHref={authHref}
          authLabel={authLabel}
          headerTree={headerTree}
          locale={locale}
          onClose={onClose}
          t={t}
          />
        </div>
      </MarketingLayoutGrid>
    </div>
  );
}

function MobileNavContent({
  authHref,
  authLabel,
  headerTree,
  locale,
  onClose,
  t,
}: {
  authHref: string;
  authLabel: string;
  headerTree: NavigationNodeTree[];
  locale: Locale;
  onClose: () => void;
  t: ReturnType<typeof useTranslations<'marketing.nav'>>;
}) {
  return (
    <>
      <div className="space-y-5">
        {headerTree.map((node) => (
          <MobileNavSection key={node.id} node={node} locale={locale} onClose={onClose} />
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-3 border-t pt-6">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher variant="flags" />
        </div>
        <Button asChild variant="ghost" className="justify-start px-0">
          <Link href={authHref} onClick={onClose}>
            {authLabel}
          </Link>
        </Button>
        <MarketingButton href={PUBLIC_ROUTES.CONTACT} variant="primary" onClick={onClose}>
          {t('contactSales')}
        </MarketingButton>
      </div>
    </>
  );
}

function MobileNavSection({
  node,
  locale,
  onClose,
  depth = 0,
}: {
  node: NavigationNodeTree;
  locale: Locale;
  onClose: () => void;
  depth?: number;
}) {
  const label = resolveNavigationLabel(node.labels, locale);

  if (node.type === 'LINK') {
    return (
      <Link
        href={node.href ?? '/'}
        onClick={onClose}
        className="block text-sm font-medium"
        style={{ paddingLeft: depth * 12 }}
      >
        {label}
      </Link>
    );
  }

  if (node.children.length === 0) {
    return null;
  }

  return (
    <div style={{ paddingLeft: depth * 12 }}>
      <p className="text-muted-foreground mb-2 flex items-center gap-1 text-xs font-semibold tracking-wide">
        {node.type === 'MEGA' ? <ChevronDown className="size-3" /> : null}
        {label}
      </p>
      <div className="space-y-2">
        {node.children.map((child) => (
          <MobileNavSection
            key={child.id}
            node={child}
            locale={locale}
            onClose={onClose}
            depth={depth + 1}
          />
        ))}
      </div>
    </div>
  );
}
