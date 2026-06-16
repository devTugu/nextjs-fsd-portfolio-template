'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { listQueryOptions } from '@/shared/api/list-query-options';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type { PaginatedResult } from '@/shared/api';
import type { ListProjectsParams, ProjectOutput } from '../types/project';

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params: ListProjectsParams) => [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: number) => [...projectKeys.details(), id] as const,
};

export const useProjects = (params: ListProjectsParams) => {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () =>
      api.get<PaginatedResult<ProjectOutput>>(API_ENDPOINTS.PROJECTS.LIST, {
        params,
      }),
    ...listQueryOptions,
  });
};

export const useProject = (id: number, enabled = true) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => api.get<ProjectOutput>(API_ENDPOINTS.PROJECTS.BY_ID(id)),
    enabled: enabled && id > 0,
  });
};
