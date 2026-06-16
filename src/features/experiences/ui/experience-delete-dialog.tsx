'use client';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { type ExperienceOutput, useDeleteExperience } from '@/entities/experience';
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

interface ExperienceDeleteDialogProps {
  experience: ExperienceOutput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExperienceDeleteDialog({
  experience,
  open,
  onOpenChange,
}: ExperienceDeleteDialogProps) {
  const deleteExperience = useDeleteExperience();

  const handleDelete = async () => {
    if (!experience) return;
    try {
      await deleteExperience.mutateAsync(experience.id);
      toast.success('Experience deleted');
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete experience?</AlertDialogTitle>
          <AlertDialogDescription>
            Remove {experience?.role} at {experience?.company}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteExperience.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteExperience.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteExperience.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
