'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  type LeadershipMemberOutput,
  useDeleteLeadershipMember,
} from '@/entities/leadership';
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

interface LeadershipDeleteDialogProps {
  member: LeadershipMemberOutput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadershipDeleteDialog({
  member,
  open,
  onOpenChange,
}: LeadershipDeleteDialogProps) {
  const t = useTranslations('entities.leadership');
  const tCommon = useTranslations('common');
  const deleteMember = useDeleteLeadershipMember();

  const handleDelete = async () => {
    if (!member) return;
    try {
      await deleteMember.mutateAsync(member.id);
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
            {t('deleteDescription', { name: member?.name ?? '' })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMember.isPending}>
            {tCommon('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMember.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMember.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            {tCommon('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
