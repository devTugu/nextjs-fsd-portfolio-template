'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  createExperienceSchema,
  type CreateExperienceFormValues,
  type ExperienceOutput,
  useCreateExperience,
  useExperience,
  useUpdateExperience,
} from '@/entities/experience';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { getErrorMessage } from '@/shared/api';
import { AdminFormSheet } from '@/widgets/admin-form-sheet';
import { PublishedSwitch, SortOrderField } from '@/shared/ui/form-fields';
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
import { Switch } from '@/shared/ui/switch';
import { Textarea } from '@/shared/ui/textarea';

export type ExperienceSheetState =
  | { mode: 'create' }
  | { mode: 'edit'; experience: ExperienceOutput };

interface ExperienceManageSheetProps {
  state: ExperienceSheetState | null;
  onOpenChange: (open: boolean) => void;
}

export function ExperienceManageSheet({
  state,
  onOpenChange,
}: ExperienceManageSheetProps) {
  const { can } = useAuthPermissions();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const isCreate = state?.mode === 'create';
  const isEdit = state?.mode === 'edit';
  const experienceId = isEdit ? state.experience.id : 0;
  const { data: experienceDetail } = useExperience(experienceId, isEdit);
  const experience = experienceDetail ?? (isEdit ? state.experience : null);
  const open = state !== null;
  const canSubmit = isCreate
    ? can(PERMISSION_CODES.EXPERIENCE_CREATE)
    : can(PERMISSION_CODES.EXPERIENCE_UPDATE);

  const createForm = useForm<CreateExperienceFormValues>({
    resolver: zodResolver(createExperienceSchema),
    defaultValues: {
      company: '',
      role: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      isPublished: true,
      sortOrder: 0,
    },
  });

  const editForm = useForm<CreateExperienceFormValues>({
    resolver: zodResolver(createExperienceSchema),
    defaultValues: {
      company: '',
      role: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      isPublished: true,
      sortOrder: 0,
    },
  });

  const isCurrentCreate = createForm.watch('isCurrent');
  const isCurrentEdit = editForm.watch('isCurrent');

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      createForm.reset();
      return;
    }
    if (!experience) return;
    editForm.reset({
      company: experience.company,
      role: experience.role,
      location: experience.location ?? '',
      description: experience.description ?? '',
      startDate: experience.startDate,
      endDate: experience.endDate ?? '',
      isCurrent: experience.isCurrent,
      isPublished: experience.isPublished,
      sortOrder: experience.sortOrder,
    });
  }, [open, isCreate, experience, createForm, editForm]);

  const onCreate = createForm.handleSubmit(async (values) => {
    try {
      await createExperience.mutateAsync({
        ...values,
        location: values.location || undefined,
        description: values.description || undefined,
        endDate: values.isCurrent ? undefined : values.endDate || undefined,
      });
      toast.success('Experience created');
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const onUpdate = editForm.handleSubmit(async (values) => {
    if (!experience) return;
    try {
      await updateExperience.mutateAsync({
        id: experience.id,
        data: {
          ...values,
          location: values.location || null,
          description: values.description || null,
          endDate: values.isCurrent ? null : values.endDate || null,
        },
      });
      toast.success('Experience updated');
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const isPending = createExperience.isPending || updateExperience.isPending;

  const formFields = (
    control: typeof createForm.control,
    isCurrent: boolean,
    onCurrentChange: (checked: boolean) => void
  ) => (
    <>
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company</FormLabel>
            <FormControl>
              <Input disabled={!canSubmit} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <Input disabled={!canSubmit} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input disabled={!canSubmit} {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea rows={4} disabled={!canSubmit} {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <Input type="date" disabled={!canSubmit} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  disabled={!canSubmit || isCurrent}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="isCurrent"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-3">
            <FormLabel>Current role</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  onCurrentChange(checked);
                }}
                disabled={!canSubmit}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <PublishedSwitch control={control} name="isPublished" disabled={!canSubmit} />
      <SortOrderField control={control} name="sortOrder" disabled={!canSubmit} />
    </>
  );

  return (
    <AdminFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isCreate ? 'Create experience' : 'Edit experience'}
      description="Manage work experience entries."
      footer={
        <Button
          type="submit"
          form={isCreate ? 'create-experience-form' : 'edit-experience-form'}
          disabled={!canSubmit || isPending}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {isCreate ? 'Create' : 'Save changes'}
        </Button>
      }
    >
      {isCreate ? (
        <Form {...createForm}>
          <form
            id="create-experience-form"
            onSubmit={onCreate}
            className="space-y-4"
          >
            {formFields(createForm.control, isCurrentCreate, () =>
              createForm.setValue('endDate', '')
            )}
          </form>
        </Form>
      ) : (
        <Form {...editForm}>
          <form
            id="edit-experience-form"
            onSubmit={onUpdate}
            className="space-y-4"
          >
            {formFields(editForm.control, isCurrentEdit, () =>
              editForm.setValue('endDate', '')
            )}
          </form>
        </Form>
      )}
    </AdminFormSheet>
  );
}
