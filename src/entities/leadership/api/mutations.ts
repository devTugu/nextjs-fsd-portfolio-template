'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type {
  CreateLeadershipInput,
  LeadershipMemberOutput,
  UpdateLeadershipInput,
} from '../types/leadership';
import { leadershipKeys } from './queries';

export const useCreateLeadershipMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadershipInput) =>
      api.post<LeadershipMemberOutput>(API_ENDPOINTS.LEADERSHIP.LIST, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadershipKeys.lists() });
    },
  });
};

export const useUpdateLeadershipMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeadershipInput }) =>
      api.patch<LeadershipMemberOutput>(API_ENDPOINTS.LEADERSHIP.BY_ID(id), data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: leadershipKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadershipKeys.detail(id) });
    },
  });
};

export const useDeleteLeadershipMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete<void>(API_ENDPOINTS.LEADERSHIP.BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadershipKeys.lists() });
    },
  });
};
