'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { listQueryOptions } from '@/shared/api/list-query-options';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type { PaginatedResult } from '@/shared/api';
import type {
  ContactMessageOutput,
  ListContactMessagesParams,
} from '../types/contact-message';

export const contactMessageKeys = {
  all: ['contact-messages'] as const,
  lists: () => [...contactMessageKeys.all, 'list'] as const,
  list: (params: ListContactMessagesParams) =>
    [...contactMessageKeys.lists(), params] as const,
  details: () => [...contactMessageKeys.all, 'detail'] as const,
  detail: (id: number) => [...contactMessageKeys.details(), id] as const,
};

export const useContactMessages = (params: ListContactMessagesParams) => {
  return useQuery({
    queryKey: contactMessageKeys.list(params),
    queryFn: () =>
      api.get<PaginatedResult<ContactMessageOutput>>(
        API_ENDPOINTS.CONTACT_MESSAGES.LIST,
        { params }
      ),
    ...listQueryOptions,
  });
};

export const useContactMessage = (id: number, enabled = true) => {
  return useQuery({
    queryKey: contactMessageKeys.detail(id),
    queryFn: () =>
      api.get<ContactMessageOutput>(API_ENDPOINTS.CONTACT_MESSAGES.BY_ID(id)),
    enabled: enabled && id > 0,
  });
};
