'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { listQueryOptions } from '@/shared/api/list-query-options';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type { PaginatedResult } from '@/shared/api';
import type { ExperienceOutput, ListExperiencesParams } from '../types/experience';

export const experienceKeys = {
  all: ['experiences'] as const,
  lists: () => [...experienceKeys.all, 'list'] as const,
  list: (params: ListExperiencesParams) =>
    [...experienceKeys.lists(), params] as const,
  details: () => [...experienceKeys.all, 'detail'] as const,
  detail: (id: number) => [...experienceKeys.details(), id] as const,
};

export const useExperiences = (params: ListExperiencesParams) => {
  return useQuery({
    queryKey: experienceKeys.list(params),
    queryFn: () =>
      api.get<PaginatedResult<ExperienceOutput>>(
        API_ENDPOINTS.EXPERIENCES.LIST,
        { params }
      ),
    ...listQueryOptions,
  });
};

export const useExperience = (id: number, enabled = true) => {
  return useQuery({
    queryKey: experienceKeys.detail(id),
    queryFn: () =>
      api.get<ExperienceOutput>(API_ENDPOINTS.EXPERIENCES.BY_ID(id)),
    enabled: enabled && id > 0,
  });
};
