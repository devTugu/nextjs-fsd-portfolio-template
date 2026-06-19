import type { LocalizedText } from '@/shared/i18n/localized-content';

export interface HistoryEntryOutput {
  id: number;
  year: number;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListHistoryParams {
  page?: number;
  limit?: number;
}

export interface CreateHistoryInput {
  year: number;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export type UpdateHistoryInput = Partial<CreateHistoryInput>;
