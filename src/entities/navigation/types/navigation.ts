import type {
  LocalizedStringList,
  LocalizedText,
} from '@/shared/i18n/localized-content';

export type { LocalizedStringList, LocalizedText };

export type NavigationScope = 'HEADER' | 'FOOTER';

export type NavigationNodeType =
  | 'MEGA'
  | 'COLUMN'
  | 'LINK'
  | 'SIDEBAR'
  | 'PROMO'
  | 'CTA_ROW'
  | 'GROUP';

export interface NavigationNodeMetadata {
  imageUrl?: string;
  ctaHref?: string;
  ctaLabel?: LocalizedText;
  badge?: string;
}

export interface NavigationNodeTree {
  id: number;
  scope: NavigationScope;
  type: NavigationNodeType;
  labels: LocalizedText;
  descriptions: LocalizedText | null;
  href: string | null;
  icon: string | null;
  metadata: NavigationNodeMetadata | null;
  sortOrder: number;
  children: NavigationNodeTree[];
}

export interface NavigationNodeOutput {
  id: number;
  scope: NavigationScope;
  parentId: number | null;
  type: NavigationNodeType;
  labels: LocalizedText;
  descriptions: LocalizedText | null;
  href: string | null;
  icon: string | null;
  metadata: NavigationNodeMetadata | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicNavigationOutput {
  tree: NavigationNodeTree[];
}

export interface CreateNavigationNodeInput {
  scope: NavigationScope;
  parentId?: number | null;
  type: NavigationNodeType;
  labels: LocalizedText;
  descriptions?: LocalizedText | null;
  href?: string | null;
  icon?: string | null;
  metadata?: NavigationNodeMetadata | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export type UpdateNavigationNodeInput = Partial<
  Omit<CreateNavigationNodeInput, 'scope'>
>;

export interface ReorderNavigationNodeItem {
  id: number;
  parentId: number | null;
  sortOrder: number;
}

export interface ReorderNavigationNodesInput {
  scope: NavigationScope;
  items: ReorderNavigationNodeItem[];
}
