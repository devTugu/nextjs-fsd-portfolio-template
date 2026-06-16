'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type {
  CreateProjectInput,
  ProjectOutput,
  UpdateProjectInput,
} from '../types/project';
import { projectKeys } from './queries';

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectInput) =>
      api.post<ProjectOutput>(API_ENDPOINTS.PROJECTS.LIST, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectInput }) =>
      api.patch<ProjectOutput>(API_ENDPOINTS.PROJECTS.BY_ID(id), data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete<void>(API_ENDPOINTS.PROJECTS.BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};
