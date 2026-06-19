'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { listQueryOptions } from '@/shared/api/list-query-options';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type { PaginatedResult } from '@/shared/api';
import type { ListTeamParams, TeamMemberOutput } from '../types/team';

export const teamKeys = {
  all: ['team'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (params: ListTeamParams) => [...teamKeys.lists(), params] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (id: number) => [...teamKeys.details(), id] as const,
};

export const useTeamMembers = (params: ListTeamParams) => {
  return useQuery({
    queryKey: teamKeys.list(params),
    queryFn: () =>
      api.get<PaginatedResult<TeamMemberOutput>>(API_ENDPOINTS.TEAM.LIST, {
        params,
      }),
    ...listQueryOptions,
  });
};

export const useTeamMember = (id: number, enabled = true) => {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => api.get<TeamMemberOutput>(API_ENDPOINTS.TEAM.BY_ID(id)),
    enabled: enabled && id > 0,
  });
};
