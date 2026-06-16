'use client';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { type ProjectOutput, useDeleteProject } from '@/entities/project';
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

interface ProjectDeleteDialogProps {
  project: ProjectOutput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDeleteDialog({
  project,
  open,
  onOpenChange,
}: ProjectDeleteDialogProps) {
  const deleteProject = useDeleteProject();

  const handleDelete = async () => {
    if (!project) return;
    try {
      await deleteProject.mutateAsync(project.id);
      toast.success('Project deleted');
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            Remove {project?.title}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProject.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProject.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteProject.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
