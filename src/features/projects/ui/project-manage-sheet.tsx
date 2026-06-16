'use client';

import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  createProjectSchema,
  type CreateProjectFormValues,
  type ProjectOutput,
  useCreateProject,
  useProject,
  useUpdateProject,
} from '@/entities/project';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { getErrorMessage } from '@/shared/api';
import { AdminFormSheet } from '@/widgets/admin-form-sheet';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ProjectFormTabs } from './project-form-tabs';

export type ProjectSheetState =
  | { mode: 'create' }
  | { mode: 'edit'; project: ProjectOutput };

interface ProjectManageSheetProps {
  state: ProjectSheetState | null;
  onOpenChange: (open: boolean) => void;
}

const emptyProjectFormValues: CreateProjectFormValues = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  thumbnailUrl: '',
  images: [],
  techStack: [],
  liveUrl: '',
  repoUrl: '',
  isFeatured: false,
  isPublished: false,
  sortOrder: 0,
};

function normalizeOptionalUrl(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function ProjectManageSheet({
  state,
  onOpenChange,
}: ProjectManageSheetProps) {
  const { can } = useAuthPermissions();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const isCreate = state?.mode === 'create';
  const isEdit = state?.mode === 'edit';
  const projectId = isEdit ? state.project.id : 0;
  const { data: projectDetail } = useProject(projectId, isEdit);
  const project = projectDetail ?? (isEdit ? state.project : null);
  const open = state !== null;
  const canSubmit = isCreate
    ? can(PERMISSION_CODES.PROJECT_CREATE)
    : can(PERMISSION_CODES.PROJECT_UPDATE);

  const createForm = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: emptyProjectFormValues,
  });

  const editForm = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: emptyProjectFormValues,
  });

  const createImages = useFieldArray({
    control: createForm.control,
    name: 'images',
  });

  const editImages = useFieldArray({
    control: editForm.control,
    name: 'images',
  });

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      createForm.reset();
      return;
    }
    if (!project) return;
    editForm.reset({
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      description: project.description,
      thumbnailUrl: project.thumbnailUrl ?? '',
      images: project.images,
      techStack: project.techStack,
      liveUrl: project.liveUrl ?? '',
      repoUrl: project.repoUrl ?? '',
      isFeatured: project.isFeatured,
      isPublished: project.isPublished,
      sortOrder: project.sortOrder,
    });
  }, [open, isCreate, project, createForm, editForm]);

  const onCreate = createForm.handleSubmit(async (values) => {
    try {
      await createProject.mutateAsync({
        ...values,
        slug: values.slug || undefined,
        thumbnailUrl: normalizeOptionalUrl(values.thumbnailUrl),
        liveUrl: normalizeOptionalUrl(values.liveUrl),
        repoUrl: normalizeOptionalUrl(values.repoUrl),
        images: values.images?.length ? values.images : undefined,
      });
      toast.success('Project created');
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const onUpdate = editForm.handleSubmit(async (values) => {
    if (!project) return;
    try {
      await updateProject.mutateAsync({
        id: project.id,
        data: {
          ...values,
          slug: values.slug || undefined,
          thumbnailUrl: normalizeOptionalUrl(values.thumbnailUrl) ?? null,
          liveUrl: normalizeOptionalUrl(values.liveUrl) ?? null,
          repoUrl: normalizeOptionalUrl(values.repoUrl) ?? null,
        },
      });
      toast.success('Project updated');
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const isPending = createProject.isPending || updateProject.isPending;

  return (
    <AdminFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isCreate ? 'Create project' : 'Edit project'}
      description="Manage portfolio project content and visibility."
      footer={
        <Button
          type="submit"
          form={isCreate ? 'create-project-form' : 'edit-project-form'}
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
            id="create-project-form"
            onSubmit={onCreate}
            className="space-y-4"
          >
            <ProjectFormTabs
              control={createForm.control}
              images={createImages}
              disabled={!canSubmit}
            />
          </form>
        </Form>
      ) : (
        <Form {...editForm}>
          <form id="edit-project-form" onSubmit={onUpdate} className="space-y-4">
            <ProjectFormTabs
              control={editForm.control}
              images={editImages}
              disabled={!canSubmit}
            />
          </form>
        </Form>
      )}
    </AdminFormSheet>
  );
}
