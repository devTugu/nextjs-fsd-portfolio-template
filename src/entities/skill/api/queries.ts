'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { listQueryOptions } from '@/shared/api/list-query-options';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type { PaginatedResult } from '@/shared/api';
import type { ListSkillsParams, SkillOutput } from '../types/skill';

export const skillKeys = {
  all: ['skills'] as const,
  lists: () => [...skillKeys.all, 'list'] as const,
  list: (params: ListSkillsParams) => [...skillKeys.lists(), params] as const,
  details: () => [...skillKeys.all, 'detail'] as const,
  detail: (id: number) => [...skillKeys.details(), id] as const,
};

export const useSkills = (params: ListSkillsParams) => {
  return useQuery({
    queryKey: skillKeys.list(params),
    queryFn: () =>
      api.get<PaginatedResult<SkillOutput>>(API_ENDPOINTS.SKILLS.LIST, {
        params,
      }),
    ...listQueryOptions,
  });
};

export const useSkill = (id: number, enabled = true) => {
  return useQuery({
    queryKey: skillKeys.detail(id),
    queryFn: () => api.get<SkillOutput>(API_ENDPOINTS.SKILLS.BY_ID(id)),
    enabled: enabled && id > 0,
  });
};
