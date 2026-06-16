'use client';

import { useEffect, useRef } from 'react';
import { sessionHint } from '@/shared/lib/session-hint';
import type { ApiEnvelope } from '@/shared/api/types';

const REFRESH_BUFFER_MS = 60_000;

export function useTokenRefreshScheduler() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const schedule = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      if (!sessionHint.hasSession()) return;

      const expiresAt = sessionHint.getExpiresAt();
      if (!expiresAt) return;

      const delay = Math.max(expiresAt - Date.now() - REFRESH_BUFFER_MS, 0);

      timerRef.current = setTimeout(async () => {
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (!response.ok) {
            sessionHint.clear();
            return;
          }

          const envelope = (await response.json()) as ApiEnvelope<{
            expiresIn: number;
          }>;
          sessionHint.updateExpiresAt(envelope.data.expiresIn);
        } catch {
          sessionHint.clear();
        }
        schedule();
      }, delay);
    };

    schedule();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}
