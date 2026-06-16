export interface SkillOutput {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillInput {
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateSkillInput {
  name?: string;
  category?: string;
  proficiency?: number;
  icon?: string | null;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface ListSkillsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}
