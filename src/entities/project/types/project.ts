export interface ProjectImage {
  url: string;
  alt?: string;
}

export interface ProjectOutput {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  thumbnailUrl: string | null;
  images: ProjectImage[];
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  title: string;
  slug?: string;
  shortDescription: string;
  description: string;
  thumbnailUrl?: string;
  images?: ProjectImage[];
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateProjectInput {
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string | null;
  images?: ProjectImage[];
  techStack?: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface ListProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
}
