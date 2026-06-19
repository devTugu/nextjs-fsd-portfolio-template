import type { LocalizedText } from '@/shared/i18n/localized-content';
import type { SocialLink } from '@/entities/site-settings';

export type BrandType = 'RESTAURANT' | 'EVENT';

export interface BrandOutput {
  id: number;
  slug: string;
  type: BrandType;
  name: LocalizedText;
  description: LocalizedText;
  logoUrl: string | null;
  coverImageUrl: string | null;
  address: LocalizedText | null;
  phone: string | null;
  mapEmbed: string | null;
  socialLinks: SocialLink[];
  workHours: LocalizedText | null;
  sortOrder: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemOutput {
  id: number;
  brandId: number;
  category: LocalizedText;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandEventOutput {
  id: number;
  brandId: number;
  title: LocalizedText;
  description: LocalizedText;
  eventDate: string;
  location: LocalizedText;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandDetailOutput extends BrandOutput {
  menuItems?: MenuItemOutput[];
  events?: BrandEventOutput[];
}

export interface ListBrandsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: BrandType;
}

export interface CreateBrandInput {
  slug?: string;
  type: BrandType;
  name: LocalizedText;
  description: LocalizedText;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  address?: LocalizedText | null;
  phone?: string | null;
  mapEmbed?: string | null;
  socialLinks?: SocialLink[];
  workHours?: LocalizedText | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export type UpdateBrandInput = Partial<CreateBrandInput>;

export interface CreateMenuItemInput {
  brandId: number;
  category: LocalizedText;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  imageUrl?: string | null;
  isAvailable?: boolean;
  sortOrder?: number;
  isPublished?: boolean;
}

export type UpdateMenuItemInput = Partial<Omit<CreateMenuItemInput, 'brandId'>>;

export interface CreateBrandEventInput {
  brandId: number;
  title: LocalizedText;
  description: LocalizedText;
  eventDate: string;
  location: LocalizedText;
  imageUrl?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export type UpdateBrandEventInput = Partial<Omit<CreateBrandEventInput, 'brandId'>>;
