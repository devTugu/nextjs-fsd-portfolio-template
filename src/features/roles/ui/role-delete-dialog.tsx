'use client';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { type Role, useDeleteRole } from '@/entities/role';
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

interface RoleDeleteDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleDeleteDialog({
  role,
  open,
  onOpenChange,
}: RoleDeleteDialogProps) {
  const deleteRole = useDeleteRole();

  const handleDelete = async () => {
    if (!role) return;
    try {
      await deleteRole.mutateAsync(role.id);
      toast.success('Role deleted');
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete role?</AlertDialogTitle>
          <AlertDialogDescription>
            Remove role {role?.name}. Users may lose access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteRole.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteRole.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteRole.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
