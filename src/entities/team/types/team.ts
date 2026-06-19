import type { LocalizedText } from '@/shared/i18n/localized-content';
import type { SocialLink } from '@/entities/site-settings';

export interface TeamMemberOutput {
  id: number;
  name: string;
  role: LocalizedText;
  imageUrl: string | null;
  socialLinks: SocialLink[];
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListTeamParams {
  page?: number;
  limit?: number;
}

export interface CreateTeamInput {
  name: string;
  role: LocalizedText;
  imageUrl?: string | null;
  socialLinks?: SocialLink[];
  sortOrder?: number;
  isPublished?: boolean;
}

export type UpdateTeamInput = Partial<CreateTeamInput>;
