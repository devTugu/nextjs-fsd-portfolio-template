'use client';

import { useEffect, useState } from 'react';
import { sessionHint } from '@/shared/lib/session-hint';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import type { ApiEnvelope } from '@/shared/api/types';

const WARNING_BEFORE_MS = 2 * 60 * 1000;

export function SessionExpiryDialog() {
  const [open, setOpen] = useState(false);
  const [extending, setExtending] = useState(false);

  useEffect(() => {
    const check = () => {
      if (!sessionHint.hasSession()) {
        setOpen(false);
        return;
      }

      const expiresAt = sessionHint.getExpiresAt();
      if (!expiresAt) return;

      const remaining = expiresAt - Date.now();
      setOpen(remaining > 0 && remaining <= WARNING_BEFORE_MS);
    };

    check();
    const interval = window.setInterval(check, 15_000);
    return () => window.clearInterval(interval);
  }, []);

  const extendSession = async () => {
    setExtending(true);
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        setOpen(false);
        return;
      }
      const envelope = (await response.json()) as ApiEnvelope<{
        expiresIn: number;
      }>;
      sessionHint.updateExpiresAt(envelope.data.expiresIn);
      setOpen(false);
    } finally {
      setExtending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session expiring soon</AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in a few minutes. Extend to stay signed in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={extending}>Dismiss</AlertDialogCancel>
          <AlertDialogAction onClick={extendSession} disabled={extending}>
            {extending ? 'Extending…' : 'Extend session'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
