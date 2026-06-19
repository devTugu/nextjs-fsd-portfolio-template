'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  createHistorySchema,
  type CreateHistoryFormValues,
  type HistoryEntryOutput,
  useCreateHistoryEntry,
  useHistoryEntry,
  useUpdateHistoryEntry,
} from '@/entities/history';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { getErrorMessage } from '@/shared/api';
import { AdminFormSheet } from '@/widgets/admin-form-sheet';
import { MediaUploadField } from '@/entities/media';
import { emptyLocalizedText } from '@/shared/i18n/localized-content';
import {
  LocalizedTextField,
  LocalizedTextareaField,
  PublishedSwitch,
  SortOrderField,
} from '@/shared/ui/form-fields';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

export type HistorySheetState =
  | { mode: 'create' }
  | { mode: 'edit'; entry: HistoryEntryOutput };

interface HistoryManageSheetProps {
  state: HistorySheetState | null;
  onOpenChange: (open: boolean) => void;
}

export function HistoryManageSheet({
  state,
  onOpenChange,
}: HistoryManageSheetProps) {
  const t = useTranslations('entities.history');
  const tCommon = useTranslations('common');
  const tVal = useTranslations('validation');
  const { can } = useAuthPermissions();
  const createEntry = useCreateHistoryEntry();
  const updateEntry = useUpdateHistoryEntry();
  const isCreate = state?.mode === 'create';
  const isEdit = state?.mode === 'edit';
  const entryId = isEdit ? state.entry.id : 0;
  const { data: entryDetail } = useHistoryEntry(entryId, isEdit);
  const entry = entryDetail ?? (isEdit ? state.entry : null);
  const open = state !== null;
  const canSubmit = isCreate
    ? can(PERMISSION_CODES.HISTORY_CREATE)
    : can(PERMISSION_CODES.HISTORY_UPDATE);

  const historySchema = useMemo(
    () => createHistorySchema(),
    [tVal],
  );

  const createForm = useForm<CreateHistoryFormValues>({
    resolver: zodResolver(historySchema),
    defaultValues: {
      year: new Date().getFullYear(),
      title: emptyLocalizedText(),
      description: emptyLocalizedText(),
      imageUrl: '',
      sortOrder: 0,
      isPublished: true,
    },
  });

  const editForm = useForm<CreateHistoryFormValues>({
    resolver: zodResolver(historySchema),
    defaultValues: createForm.formState.defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      createForm.reset();
      return;
    }
    if (!entry) return;
    editForm.reset({
      year: entry.year,
      title: entry.title,
      description: entry.description,
      imageUrl: entry.imageUrl ?? '',
      sortOrder: entry.sortOrder,
      isPublished: entry.isPublished,
    });
  }, [open, isCreate, entry, createForm, editForm]);

  const onCreate = createForm.handleSubmit(async (values) => {
    try {
      await createEntry.mutateAsync({
        ...values,
        imageUrl: values.imageUrl || null,
      });
      toast.success(t('toastCreated'));
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const onUpdate = editForm.handleSubmit(async (values) => {
    if (!entry) return;
    try {
      await updateEntry.mutateAsync({
        id: entry.id,
        data: { ...values, imageUrl: values.imageUrl || null },
      });
      toast.success(t('toastUpdated'));
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const isPending = createEntry.isPending || updateEntry.isPending;

  const formFields = (control: typeof createForm.control) => (
    <>
      <FormField
        control={control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('year')}</FormLabel>
            <FormControl>
              <Input type="number" disabled={!canSubmit} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <LocalizedTextField
        control={control}
        name="title"
        label={t('title')}
        disabled={!canSubmit}
      />
      <LocalizedTextareaField
        control={control}
        name="description"
        label={t('entryDescription')}
        disabled={!canSubmit}
      />
      <MediaUploadField
        control={control}
        name="imageUrl"
        label={t('imageUrl')}
        disabled={!canSubmit}
      />
      <PublishedSwitch control={control} name="isPublished" disabled={!canSubmit} />
      <SortOrderField control={control} name="sortOrder" disabled={!canSubmit} />
    </>
  );

  return (
    <AdminFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isCreate ? t('createTitle') : t('editTitle')}
      description={t('formDescription')}
      footer={
        <Button
          type="submit"
          form={isCreate ? 'create-history-form' : 'edit-history-form'}
          disabled={!canSubmit || isPending}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {isCreate ? tCommon('create') : tCommon('saveChanges')}
        </Button>
      }
    >
      {isCreate ? (
        <Form {...createForm}>
          <form id="create-history-form" onSubmit={onCreate} className="space-y-4">
            {formFields(createForm.control)}
          </form>
        </Form>
      ) : (
        <Form {...editForm}>
          <form id="edit-history-form" onSubmit={onUpdate} className="space-y-4">
            {formFields(editForm.control)}
          </form>
        </Form>
      )}
    </AdminFormSheet>
  );
}
