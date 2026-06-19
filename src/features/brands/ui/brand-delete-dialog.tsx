'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { type BrandOutput, useDeleteBrand } from '@/entities/brand';
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

interface BrandDeleteDialogProps {
  brand: BrandOutput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrandDeleteDialog({
  brand,
  open,
  onOpenChange,
}: BrandDeleteDialogProps) {
  const t = useTranslations('entities.brands');
  const tCommon = useTranslations('common');
  const deleteBrand = useDeleteBrand();

  const handleDelete = async () => {
    if (!brand) return;
    try {
      await deleteBrand.mutateAsync(brand.id);
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
            {t('deleteDescription', { name: brand?.slug ?? '' })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteBrand.isPending}>
            {tCommon('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteBrand.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteBrand.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            {tCommon('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
