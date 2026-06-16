export interface ExperienceOutput {
  id: number;
  company: string;
  role: string;
  location: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperienceInput {
  company: string;
  role: string;
  location?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateExperienceInput {
  company?: string;
  role?: string;
  location?: string | null;
  description?: string | null;
  startDate?: string;
  endDate?: string | null;
  isCurrent?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface ListExperiencesParams {
  page?: number;
  limit?: number;
  search?: string;
}
