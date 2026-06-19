'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { type TeamMemberOutput, useDeleteTeamMember } from '@/entities/team';
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

interface TeamDeleteDialogProps {
  member: TeamMemberOutput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamDeleteDialog({
  member,
  open,
  onOpenChange,
}: TeamDeleteDialogProps) {
  const t = useTranslations('entities.team');
  const tCommon = useTranslations('common');
  const deleteMember = useDeleteTeamMember();

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
