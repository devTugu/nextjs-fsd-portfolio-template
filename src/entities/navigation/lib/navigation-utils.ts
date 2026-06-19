import type { Locale } from '@/shared/i18n/config';
import type { LocalizedText, NavigationNodeTree } from '../types/navigation';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { PUBLIC_ROUTES } from '@/shared/config/routes';

export function resolveNavigationLabel(
  labels: LocalizedText,
  locale: Locale,
): string {
  return pickLocalized(labels, locale);
}

export function resolveNavigationDescription(
  descriptions: LocalizedText | null,
  locale: Locale,
): string {
  if (!descriptions) return '';
  return pickLocalized(descriptions, locale);
}

export const FALLBACK_HEADER_NAV: NavigationNodeTree[] = [
  {
    id: -1,
    scope: 'HEADER',
    type: 'LINK',
    labels: { en: 'Home', mn: 'Нүүр' },
    descriptions: null,
    href: PUBLIC_ROUTES.HOME,
    icon: null,
    metadata: null,
    sortOrder: 0,
    children: [],
  },
  {
    id: -2,
    scope: 'HEADER',
    type: 'LINK',
    labels: { en: 'Brands', mn: 'Брэндүүд' },
    descriptions: null,
    href: PUBLIC_ROUTES.BRANDS,
    icon: null,
    metadata: null,
    sortOrder: 1,
    children: [],
  },
  {
    id: -3,
    scope: 'HEADER',
    type: 'LINK',
    labels: { en: 'News', mn: 'Мэдээ' },
    descriptions: null,
    href: PUBLIC_ROUTES.NEWS,
    icon: null,
    metadata: null,
    sortOrder: 2,
    children: [],
  },
  {
    id: -4,
    scope: 'HEADER',
    type: 'LINK',
    labels: { en: 'Contact', mn: 'Холбоо барих' },
    descriptions: null,
    href: PUBLIC_ROUTES.CONTACT,
    icon: null,
    metadata: null,
    sortOrder: 3,
    children: [],
  },
];

export function withHeaderNavFallback(
  tree: NavigationNodeTree[] | null | undefined,
): NavigationNodeTree[] {
  if (!tree || tree.length === 0) {
    return FALLBACK_HEADER_NAV;
  }
  return tree;
}

export function buildFlatTree(
  nodes: Array<{
    id: number;
    parentId: number | null;
    sortOrder: number;
  }>,
): Map<number | null, number[]> {
  const byParent = new Map<number | null, number[]>();
  const sorted = [...nodes].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  for (const node of sorted) {
    const siblings = byParent.get(node.parentId) ?? [];
    siblings.push(node.id);
    byParent.set(node.parentId, siblings);
  }
  return byParent;
}

export const HEADER_MAX_DEPTH = 4;
export const FOOTER_MAX_DEPTH = 2;
