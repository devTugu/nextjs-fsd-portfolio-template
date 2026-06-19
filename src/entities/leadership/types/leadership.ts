import type { LocalizedText } from '@/shared/i18n/localized-content';
import type { SocialLink } from '@/entities/site-settings';

export interface LeadershipMemberOutput {
  id: number;
  name: string;
  title: LocalizedText;
  quote: LocalizedText;
  imageUrl: string | null;
  socialLinks: SocialLink[];
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListLeadershipParams {
  page?: number;
  limit?: number;
}

export interface CreateLeadershipInput {
  name: string;
  title: LocalizedText;
  quote: LocalizedText;
  imageUrl?: string | null;
  socialLinks?: SocialLink[];
  sortOrder?: number;
  isPublished?: boolean;
}

export type UpdateLeadershipInput = Partial<CreateLeadershipInput>;
