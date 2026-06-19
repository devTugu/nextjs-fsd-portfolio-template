import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, type PaginatedResult } from '@/shared/api';
import { listQueryOptions } from '@/shared/api/list-query-options';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type {
  NewsPostOutput,
  CreateNewsPostInput,
  ListNewsPostsParams,
  UpdateNewsPostInput,
} from '../types/news-post';

export const newsPostKeys = {
  all: ['news-posts'] as const,
  lists: () => [...newsPostKeys.all, 'list'] as const,
  list: (params?: ListNewsPostsParams) => [...newsPostKeys.lists(), params] as const,
  detail: (id: number) => [...newsPostKeys.all, 'detail', id] as const,
};

export function useNewsPosts(params?: ListNewsPostsParams) {
  return useQuery({
    queryKey: newsPostKeys.list(params),
    queryFn: () =>
      api.get<PaginatedResult<NewsPostOutput>>(API_ENDPOINTS.BLOG_POSTS.LIST, {
        params,
      }),
    ...listQueryOptions,
  });
}

export function useNewsPost(id: number, enabled = true) {
  return useQuery({
    queryKey: newsPostKeys.detail(id),
    queryFn: () => api.get<NewsPostOutput>(API_ENDPOINTS.BLOG_POSTS.BY_ID(id)),
    enabled: enabled && id > 0,
  });
}

export function useCreateNewsPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNewsPostInput) =>
      api.post<NewsPostOutput>(API_ENDPOINTS.BLOG_POSTS.LIST, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsPostKeys.all }),
  });
}

export function useUpdateNewsPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNewsPostInput }) =>
      api.patch<NewsPostOutput>(API_ENDPOINTS.BLOG_POSTS.BY_ID(id), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsPostKeys.all }),
  });
}

export function useDeleteNewsPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(API_ENDPOINTS.BLOG_POSTS.BY_ID(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsPostKeys.all }),
  });
}
