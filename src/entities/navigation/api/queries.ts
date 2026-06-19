import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type {
  CreateNavigationNodeInput,
  NavigationNodeOutput,
  NavigationScope,
  ReorderNavigationNodesInput,
  UpdateNavigationNodeInput,
} from '../types/navigation';

export const navigationKeys = {
  all: ['navigation'] as const,
  list: (scope: NavigationScope) => [...navigationKeys.all, 'list', scope] as const,
};

export function useNavigationNodes(scope: NavigationScope) {
  return useQuery({
    queryKey: navigationKeys.list(scope),
    queryFn: () =>
      api.get<NavigationNodeOutput[]>(API_ENDPOINTS.NAVIGATION.LIST, {
        params: { scope },
      }),
    retry: 1,
  });
}

export function useCreateNavigationNode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNavigationNodeInput) =>
      api.post<NavigationNodeOutput>(API_ENDPOINTS.NAVIGATION.NODES, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: navigationKeys.all }),
  });
}

export function useUpdateNavigationNode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNavigationNodeInput }) =>
      api.patch<NavigationNodeOutput>(API_ENDPOINTS.NAVIGATION.NODE_BY_ID(id), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: navigationKeys.all }),
  });
}

export function useDeleteNavigationNode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(API_ENDPOINTS.NAVIGATION.NODE_BY_ID(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: navigationKeys.all }),
  });
}

export function useReorderNavigationNodes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReorderNavigationNodesInput) =>
      api.put<void>(API_ENDPOINTS.NAVIGATION.REORDER, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: navigationKeys.all }),
  });
}
