'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type {
  CreateHistoryInput,
  HistoryEntryOutput,
  UpdateHistoryInput,
} from '../types/history';
import { historyKeys } from './queries';

export const useCreateHistoryEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHistoryInput) =>
      api.post<HistoryEntryOutput>(API_ENDPOINTS.HISTORY.LIST, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
    },
  });
};

export const useUpdateHistoryEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateHistoryInput }) =>
      api.patch<HistoryEntryOutput>(API_ENDPOINTS.HISTORY.BY_ID(id), data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: historyKeys.detail(id) });
    },
  });
};

export const useDeleteHistoryEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(API_ENDPOINTS.HISTORY.BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
    },
  });
};
