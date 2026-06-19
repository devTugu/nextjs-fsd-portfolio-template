import type { LocalizedText } from '@/shared/i18n/localized-content';

export type NewsPostCategory = 'PRODUCT' | 'ENGINEERING' | 'CORPORATE' | 'INDUSTRY';

export interface NewsPostOutput {
  id: number;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  category: NewsPostCategory;
  authorName: LocalizedText;
  authorRole: LocalizedText;
  coverImageUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsPostInput {
  title: LocalizedText;
  slug?: string;
  excerpt: LocalizedText;
  content: LocalizedText;
  category: NewsPostCategory;
  authorName: LocalizedText;
  authorRole: LocalizedText;
  coverImageUrl?: string | null;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateNewsPostInput {
  title?: LocalizedText;
  slug?: string;
  excerpt?: LocalizedText;
  content?: LocalizedText;
  category?: NewsPostCategory;
  authorName?: LocalizedText;
  authorRole?: LocalizedText;
  coverImageUrl?: string | null;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface ListNewsPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: NewsPostCategory;
}

export interface ListPublicNewsPostsParams {
  page?: number;
  limit?: number;
  category?: NewsPostCategory;
}
