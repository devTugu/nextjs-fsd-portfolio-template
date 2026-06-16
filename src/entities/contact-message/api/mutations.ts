'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config/api.config';
import type {
  ContactMessageOutput,
  UpdateContactMessageInput,
} from '../types/contact-message';
import { contactMessageKeys } from './queries';

export const useUpdateContactMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateContactMessageInput;
    }) =>
      api.patch<ContactMessageOutput>(
        API_ENDPOINTS.CONTACT_MESSAGES.BY_ID(id),
        data
      ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: contactMessageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactMessageKeys.detail(id) });
    },
  });
};

export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete<void>(API_ENDPOINTS.CONTACT_MESSAGES.BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactMessageKeys.lists() });
    },
  });
};
