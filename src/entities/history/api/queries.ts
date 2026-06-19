'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { listQueryOptions } from '@/shared/api/list-query-options';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type { PaginatedResult } from '@/shared/api';
import type { HistoryEntryOutput, ListHistoryParams } from '../types/history';

export const historyKeys = {
  all: ['history'] as const,
  lists: () => [...historyKeys.all, 'list'] as const,
  list: (params: ListHistoryParams) => [...historyKeys.lists(), params] as const,
  details: () => [...historyKeys.all, 'detail'] as const,
  detail: (id: number) => [...historyKeys.details(), id] as const,
};

export const useHistoryEntries = (params: ListHistoryParams) => {
  return useQuery({
    queryKey: historyKeys.list(params),
    queryFn: () =>
      api.get<PaginatedResult<HistoryEntryOutput>>(API_ENDPOINTS.HISTORY.LIST, {
        params,
      }),
    ...listQueryOptions,
  });
};

export const useHistoryEntry = (id: number, enabled = true) => {
  return useQuery({
    queryKey: historyKeys.detail(id),
    queryFn: () => api.get<HistoryEntryOutput>(API_ENDPOINTS.HISTORY.BY_ID(id)),
    enabled: enabled && id > 0,
  });
};
