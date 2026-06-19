'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { listQueryOptions } from '@/shared/api/list-query-options';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type { PaginatedResult } from '@/shared/api';
import type { BrandOutput, ListBrandsParams } from '../types/brand';

export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (params: ListBrandsParams) => [...brandKeys.lists(), params] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: number) => [...brandKeys.details(), id] as const,
};

export const useBrands = (params: ListBrandsParams) => {
  return useQuery({
    queryKey: brandKeys.list(params),
    queryFn: () =>
      api.get<PaginatedResult<BrandOutput>>(API_ENDPOINTS.BRANDS.LIST, {
        params,
      }),
    ...listQueryOptions,
  });
};

export const useBrand = (id: number, enabled = true) => {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => api.get<BrandOutput>(API_ENDPOINTS.BRANDS.BY_ID(id)),
    enabled: enabled && id > 0,
  });
};
