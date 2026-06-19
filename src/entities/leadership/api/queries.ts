'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { listQueryOptions } from '@/shared/api/list-query-options';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type { PaginatedResult } from '@/shared/api';
import type { LeadershipMemberOutput, ListLeadershipParams } from '../types/leadership';

export const leadershipKeys = {
  all: ['leadership'] as const,
  lists: () => [...leadershipKeys.all, 'list'] as const,
  list: (params: ListLeadershipParams) => [...leadershipKeys.lists(), params] as const,
  details: () => [...leadershipKeys.all, 'detail'] as const,
  detail: (id: number) => [...leadershipKeys.details(), id] as const,
};

export const useLeadershipMembers = (params: ListLeadershipParams) => {
  return useQuery({
    queryKey: leadershipKeys.list(params),
    queryFn: () =>
      api.get<PaginatedResult<LeadershipMemberOutput>>(
        API_ENDPOINTS.LEADERSHIP.LIST,
        { params },
      ),
    ...listQueryOptions,
  });
};

export const useLeadershipMember = (id: number, enabled = true) => {
  return useQuery({
    queryKey: leadershipKeys.detail(id),
    queryFn: () =>
      api.get<LeadershipMemberOutput>(API_ENDPOINTS.LEADERSHIP.BY_ID(id)),
    enabled: enabled && id > 0,
  });
};
