'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  createSkillSchema,
  type CreateSkillFormValues,
  type SkillOutput,
  useCreateSkill,
  useSkill,
  useUpdateSkill,
} from '@/entities/skill';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { getErrorMessage } from '@/shared/api';
import { AdminFormSheet } from '@/widgets/admin-form-sheet';
import { MediaUploadField } from '@/entities/media';
import {
  ProficiencySelect,
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

export type SkillSheetState =
  | { mode: 'create' }
  | { mode: 'edit'; skill: SkillOutput };

interface SkillManageSheetProps {
  state: SkillSheetState | null;
  onOpenChange: (open: boolean) => void;
}

export function SkillManageSheet({ state, onOpenChange }: SkillManageSheetProps) {
  const { can } = useAuthPermissions();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const isCreate = state?.mode === 'create';
  const isEdit = state?.mode === 'edit';
  const skillId = isEdit ? state.skill.id : 0;
  const { data: skillDetail } = useSkill(skillId, isEdit);
  const skill = skillDetail ?? (isEdit ? state.skill : null);
  const open = state !== null;
  const canSubmit = isCreate
    ? can(PERMISSION_CODES.SKILL_CREATE)
    : can(PERMISSION_CODES.SKILL_UPDATE);

  const createForm = useForm<CreateSkillFormValues>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      name: '',
      category: '',
      proficiency: 3,
      icon: '',
      isPublished: true,
      sortOrder: 0,
    },
  });

  const editForm = useForm<CreateSkillFormValues>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      name: '',
      category: '',
      proficiency: 3,
      icon: '',
      isPublished: true,
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      createForm.reset();
      return;
    }
    if (!skill) return;
    editForm.reset({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon ?? '',
      isPublished: skill.isPublished,
      sortOrder: skill.sortOrder,
    });
  }, [open, isCreate, skill, createForm, editForm]);

  const onCreate = createForm.handleSubmit(async (values) => {
    try {
      await createSkill.mutateAsync({
        ...values,
        icon: values.icon || undefined,
      });
      toast.success('Skill created');
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const onUpdate = editForm.handleSubmit(async (values) => {
    if (!skill) return;
    try {
      await updateSkill.mutateAsync({
        id: skill.id,
        data: {
          ...values,
          icon: values.icon || null,
        },
      });
      toast.success('Skill updated');
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const isPending = createSkill.isPending || updateSkill.isPending;

  const formFields = (control: typeof createForm.control) => (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input disabled={!canSubmit} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input
                disabled={!canSubmit}
                placeholder="e.g. frontend"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <ProficiencySelect control={control} name="proficiency" disabled={!canSubmit} />
      <MediaUploadField
        control={control}
        name="icon"
        label="Icon URL"
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
      title={isCreate ? 'Create skill' : 'Edit skill'}
      description="Manage skill entries for the portfolio."
      footer={
        <Button
          type="submit"
          form={isCreate ? 'create-skill-form' : 'edit-skill-form'}
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
            id="create-skill-form"
            onSubmit={onCreate}
            className="space-y-4"
          >
            {formFields(createForm.control)}
          </form>
        </Form>
      ) : (
        <Form {...editForm}>
          <form id="edit-skill-form" onSubmit={onUpdate} className="space-y-4">
            {formFields(editForm.control)}
          </form>
        </Form>
      )}
    </AdminFormSheet>
  );
}
