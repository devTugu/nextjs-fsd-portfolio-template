'use client';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { type SkillOutput, useDeleteSkill } from '@/entities/skill';
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

interface SkillDeleteDialogProps {
  skill: SkillOutput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SkillDeleteDialog({
  skill,
  open,
  onOpenChange,
}: SkillDeleteDialogProps) {
  const deleteSkill = useDeleteSkill();

  const handleDelete = async () => {
    if (!skill) return;
    try {
      await deleteSkill.mutateAsync(skill.id);
      toast.success('Skill deleted');
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete skill?</AlertDialogTitle>
          <AlertDialogDescription>
            Remove {skill?.name}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSkill.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSkill.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteSkill.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
