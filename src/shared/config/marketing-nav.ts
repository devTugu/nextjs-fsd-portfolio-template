import { PUBLIC_ROUTES } from '@/shared/config/routes';

export interface MarketingNavLink {
  labelKey: string;
  href: string;
  descriptionKey?: string;
}

export interface MarketingNavGroup {
  labelKey: string;
  items: MarketingNavLink[];
}

export interface MarketingFooterColumn {
  titleKey: string;
  links: MarketingNavLink[];
}

/** Static fallback when CMS navigation is empty (tests / legacy). */
export const MARKETING_MEGA_NAV: MarketingNavGroup[] = [
  {
    labelKey: 'about',
    items: [
      { labelKey: 'about', href: PUBLIC_ROUTES.ABOUT, descriptionKey: 'aboutDesc' },
      { labelKey: 'history', href: PUBLIC_ROUTES.ABOUT_HISTORY, descriptionKey: 'historyDesc' },
    ],
  },
  {
    labelKey: 'brands',
    items: [
      { labelKey: 'brands', href: PUBLIC_ROUTES.BRANDS, descriptionKey: 'brandsDesc' },
      { labelKey: 'news', href: PUBLIC_ROUTES.NEWS, descriptionKey: 'newsDesc' },
      { labelKey: 'contact', href: PUBLIC_ROUTES.CONTACT, descriptionKey: 'contactDesc' },
    ],
  },
];

export const MARKETING_FOOTER_COLUMNS: MarketingFooterColumn[] = [
  {
    titleKey: 'company',
    links: [
      { labelKey: 'about', href: PUBLIC_ROUTES.ABOUT },
      { labelKey: 'brands', href: PUBLIC_ROUTES.BRANDS },
      { labelKey: 'news', href: PUBLIC_ROUTES.NEWS },
      { labelKey: 'contact', href: PUBLIC_ROUTES.CONTACT },
    ],
  },
];
