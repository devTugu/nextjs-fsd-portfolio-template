'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type {
  CreateExperienceInput,
  ExperienceOutput,
  UpdateExperienceInput,
} from '../types/experience';
import { experienceKeys } from './queries';

export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExperienceInput) =>
      api.post<ExperienceOutput>(API_ENDPOINTS.EXPERIENCES.LIST, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.lists() });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExperienceInput }) =>
      api.patch<ExperienceOutput>(API_ENDPOINTS.EXPERIENCES.BY_ID(id), data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: experienceKeys.detail(id) });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete<void>(API_ENDPOINTS.EXPERIENCES.BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.lists() });
    },
  });
};
