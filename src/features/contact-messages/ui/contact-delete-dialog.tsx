'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  type ContactMessageOutput,
  useDeleteContactMessage,
} from '@/entities/contact-message';
import { getErrorMessage } from '@/shared/api';
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

interface ContactDeleteDialogProps {
  message: ContactMessageOutput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDeleteDialog({
  message,
  open,
  onOpenChange,
}: ContactDeleteDialogProps) {
  const t = useTranslations('entities.contactMessages');
  const tCommon = useTranslations('common');
  const deleteMessage = useDeleteContactMessage();

  const handleDelete = async () => {
    if (!message) return;
    try {
      await deleteMessage.mutateAsync(message.id);
      toast.success(t('toastDeleted'));
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteDescription', { name: message?.name ?? '' })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMessage.isPending}>
            {tCommon('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMessage.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMessage.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            {tCommon('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
