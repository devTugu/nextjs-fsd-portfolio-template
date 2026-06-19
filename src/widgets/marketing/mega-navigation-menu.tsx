'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { NavigationNodeTree } from '@/entities/navigation';
import {
  resolveNavigationDescription,
  resolveNavigationLabel,
} from '@/entities/navigation';
import type { Locale } from '@/shared/i18n/config';
import { cn } from '@/shared/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/shared/ui/navigation-menu';

interface MegaNavigationMenuProps {
  tree: NavigationNodeTree[];
  locale: Locale;
  transparent?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
}

function marketingNavTriggerClass(transparent?: boolean) {
  return cn(
    'group inline-flex h-auto w-max items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
    transparent
      ? 'text-white/85 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white'
      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground data-[state=open]:bg-muted/50 data-[state=open]:text-foreground',
  );
}

export function MegaNavigationMenu({
  tree,
  locale,
  transparent = false,
  onMenuOpenChange,
}: MegaNavigationMenuProps) {
  return (
    <NavigationMenu
      onValueChange={(value) => onMenuOpenChange?.(value !== '')}
      viewportVariant="marketing"
    >
      <NavigationMenuList className="gap-0">
        {tree.map((node) => (
          <HeaderNavItem key={node.id} node={node} locale={locale} transparent={transparent} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function HeaderNavItem({
  node,
  locale,
  transparent,
}: {
  node: NavigationNodeTree;
  locale: Locale;
  transparent?: boolean;
}) {
  const label = resolveNavigationLabel(node.labels, locale);
  const triggerClass = marketingNavTriggerClass(transparent);

  if (node.type === 'LINK') {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href={node.href ?? '/'} className={triggerClass}>
            {label}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }

  if (node.type !== 'MEGA') {
    return null;
  }

  const columns = node.children.filter((child) => child.type === 'COLUMN');
  const sidebar = node.children.find((child) => child.type === 'SIDEBAR');
  const ctaRow = node.children.find((child) => child.type === 'CTA_ROW');
  const directLinks = node.children.filter((child) => child.type === 'LINK');
  const columnCount = Math.max(columns.length, 1);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={triggerClass}>{label}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="w-[min(100vw-2rem,1080px)] p-8">
          {columns.length > 0 || sidebar ? (
            <div
              className="grid gap-8"
              style={
                sidebar
                  ? {
                      gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr)) 220px`,
                    }
                  : {
                      gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                    }
              }
            >
              {columns.map((column) => (
                <MegaColumn key={column.id} column={column} locale={locale} />
              ))}
              {sidebar ? <MegaSidebar sidebar={sidebar} locale={locale} /> : null}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {directLinks.map((link) => (
                <MegaLinkItem key={link.id} link={link} locale={locale} />
              ))}
            </div>
          )}
          {ctaRow ? <MegaCtaRow row={ctaRow} locale={locale} /> : null}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function MegaColumn({
  column,
  locale,
}: {
  column: NavigationNodeTree;
  locale: Locale;
}) {
  const title = resolveNavigationLabel(column.labels, locale);
  const links = column.children.filter((child) => child.type === 'LINK');

  return (
    <div>
      <p className="text-muted-foreground mb-4 text-xs font-semibold">{title}</p>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.id}>
            <MegaLinkItem link={link} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaSidebar({
  sidebar,
  locale,
}: {
  sidebar: NavigationNodeTree;
  locale: Locale;
}) {
  const title = resolveNavigationLabel(sidebar.labels, locale);
  const links = sidebar.children.filter((child) => child.type === 'LINK');
  const promo = sidebar.children.find((child) => child.type === 'PROMO');

  return (
    <div className="border-border/60 border-l pl-8">
      <p className="text-muted-foreground mb-4 text-xs font-semibold">{title}</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.id}>
            <Link
              href={link.href ?? '/'}
              className="text-sm font-medium hover:text-[var(--marketing-indigo)]"
            >
              {resolveNavigationLabel(link.labels, locale)}
            </Link>
          </li>
        ))}
      </ul>
      {promo ? <MegaPromoCard promo={promo} locale={locale} /> : null}
    </div>
  );
}

function MegaPromoCard({
  promo,
  locale,
}: {
  promo: NavigationNodeTree;
  locale: Locale;
}) {
  const title = resolveNavigationLabel(promo.labels, locale);
  const ctaHref = promo.metadata?.ctaHref ?? promo.href ?? '/';
  const ctaLabel = promo.metadata?.ctaLabel
    ? resolveNavigationLabel(promo.metadata.ctaLabel, locale)
    : title;

  return (
    <div className="bg-muted/30 mt-6 overflow-hidden rounded-xl border p-4 shadow-sm">
      {promo.metadata?.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={promo.metadata.imageUrl}
          alt=""
          className="mb-3 aspect-video w-full rounded-lg object-cover"
        />
      ) : null}
      <p className="text-sm font-semibold">{title}</p>
      <Link
        href={ctaHref}
        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--marketing-indigo)]"
      >
        {ctaLabel}
        <span aria-hidden>›</span>
      </Link>
    </div>
  );
}

function MegaLinkItem({
  link,
  locale,
}: {
  link: NavigationNodeTree;
  locale: Locale;
}) {
  const label = resolveNavigationLabel(link.labels, locale);
  const description = resolveNavigationDescription(link.descriptions, locale);

  return (
    <Link
      href={link.href ?? '/'}
      className="group block rounded-lg p-3 transition-colors hover:bg-muted/40"
    >
      <span className="block text-sm font-semibold text-[var(--marketing-indigo)] group-hover:underline">
        {label}
      </span>
      {description ? (
        <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
          {description}
        </span>
      ) : null}
    </Link>
  );
}

function MegaCtaRow({
  row,
  locale,
}: {
  row: NavigationNodeTree;
  locale: Locale;
}) {
  const t = useTranslations('marketing.nav');
  const prompt = resolveNavigationLabel(row.labels, locale);
  const linkLabel = row.metadata?.ctaLabel
    ? resolveNavigationLabel(row.metadata.ctaLabel, locale)
    : t('findWhatsRight');

  return (
    <div className="border-border/60 mt-8 flex flex-col items-start justify-between gap-3 border-t pt-6 sm:flex-row sm:items-center">
      <p className="text-muted-foreground text-sm">{prompt}</p>
      {row.href ? (
        <Link
          href={row.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--marketing-indigo)] hover:underline"
        >
          {linkLabel}
          <span aria-hidden>›</span>
        </Link>
      ) : null}
    </div>
  );
}
