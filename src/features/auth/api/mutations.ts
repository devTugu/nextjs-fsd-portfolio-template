'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bffLogin, bffLogout, bffMe } from '@/shared/lib/bff-auth';
import { sessionHint } from '@/shared/lib/session-hint';
import { useAuthStore } from '../model/store';
import { userKeys } from '@/entities/user/api/queries';
import type { UserOutput } from '@/entities/user';
import type { SignInRequest } from '../types/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (data: SignInRequest) => bffLogin(data),
    onSuccess: async ({ expiresIn }) => {
      sessionHint.setSession(expiresIn);
      const user = await bffMe<UserOutput>();
      setSession(user);
      queryClient.setQueryData(userKeys.me, user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: () => bffLogout(),
    onSettled: () => {
      sessionHint.clear();
      clearSession();
      queryClient.clear();
    },
  });
};
