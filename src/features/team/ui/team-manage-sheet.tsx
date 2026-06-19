'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  createTeamSchema,
  type CreateTeamFormValues,
  type TeamMemberOutput,
  useCreateTeamMember,
  useTeamMember,
  useUpdateTeamMember,
} from '@/entities/team';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { getErrorMessage } from '@/shared/api';
import { AdminFormSheet } from '@/widgets/admin-form-sheet';
import { MediaUploadField } from '@/entities/media';
import { emptyLocalizedText } from '@/shared/i18n/localized-content';
import {
  LocalizedTextField,
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

export type TeamSheetState =
  | { mode: 'create' }
  | { mode: 'edit'; member: TeamMemberOutput };

interface TeamManageSheetProps {
  state: TeamSheetState | null;
  onOpenChange: (open: boolean) => void;
}

export function TeamManageSheet({ state, onOpenChange }: TeamManageSheetProps) {
  const t = useTranslations('entities.team');
  const tCommon = useTranslations('common');
  const tTable = useTranslations('table');
  const tVal = useTranslations('validation');
  const { can } = useAuthPermissions();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const isCreate = state?.mode === 'create';
  const isEdit = state?.mode === 'edit';
  const memberId = isEdit ? state.member.id : 0;
  const { data: memberDetail } = useTeamMember(memberId, isEdit);
  const member = memberDetail ?? (isEdit ? state.member : null);
  const open = state !== null;
  const canSubmit = isCreate
    ? can(PERMISSION_CODES.TEAM_CREATE)
    : can(PERMISSION_CODES.TEAM_UPDATE);

  const teamSchema = useMemo(
    () => createTeamSchema({ required: tVal('required') }),
    [tVal],
  );

  const createForm = useForm<CreateTeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      role: emptyLocalizedText(),
      imageUrl: '',
      sortOrder: 0,
      isPublished: true,
    },
  });

  const editForm = useForm<CreateTeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: createForm.formState.defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      createForm.reset();
      return;
    }
    if (!member) return;
    editForm.reset({
      name: member.name,
      role: member.role,
      imageUrl: member.imageUrl ?? '',
      sortOrder: member.sortOrder,
      isPublished: member.isPublished,
    });
  }, [open, isCreate, member, createForm, editForm]);

  const onCreate = createForm.handleSubmit(async (values) => {
    try {
      await createMember.mutateAsync({
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
    if (!member) return;
    try {
      await updateMember.mutateAsync({
        id: member.id,
        data: { ...values, imageUrl: values.imageUrl || null },
      });
      toast.success(t('toastUpdated'));
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const isPending = createMember.isPending || updateMember.isPending;

  const formFields = (control: typeof createForm.control) => (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tTable('name')}</FormLabel>
            <FormControl>
              <Input disabled={!canSubmit} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <LocalizedTextField
        control={control}
        name="role"
        label={t('role')}
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
      description={t('description')}
      footer={
        <Button
          type="submit"
          form={isCreate ? 'create-team-form' : 'edit-team-form'}
          disabled={!canSubmit || isPending}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {isCreate ? tCommon('create') : tCommon('saveChanges')}
        </Button>
      }
    >
      {isCreate ? (
        <Form {...createForm}>
          <form id="create-team-form" onSubmit={onCreate} className="space-y-4">
            {formFields(createForm.control)}
          </form>
        </Form>
      ) : (
        <Form {...editForm}>
          <form id="edit-team-form" onSubmit={onUpdate} className="space-y-4">
            {formFields(editForm.control)}
          </form>
        </Form>
      )}
    </AdminFormSheet>
  );
}
