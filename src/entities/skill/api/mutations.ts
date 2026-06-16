'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type {
  CreateSkillInput,
  SkillOutput,
  UpdateSkillInput,
} from '../types/skill';
import { skillKeys } from './queries';

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSkillInput) =>
      api.post<SkillOutput>(API_ENDPOINTS.SKILLS.LIST, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.lists() });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSkillInput }) =>
      api.patch<SkillOutput>(API_ENDPOINTS.SKILLS.BY_ID(id), data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: skillKeys.lists() });
      queryClient.invalidateQueries({ queryKey: skillKeys.detail(id) });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(API_ENDPOINTS.SKILLS.BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.lists() });
    },
  });
};
