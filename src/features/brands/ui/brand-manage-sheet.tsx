'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  createBrandSchema,
  type BrandOutput,
  type CreateBrandFormValues,
  useBrand,
  useCreateBrand,
  useUpdateBrand,
} from '@/entities/brand';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

export type BrandSheetState =
  | { mode: 'create' }
  | { mode: 'edit'; brand: BrandOutput };

interface BrandManageSheetProps {
  state: BrandSheetState | null;
  onOpenChange: (open: boolean) => void;
}

export function BrandManageSheet({ state, onOpenChange }: BrandManageSheetProps) {
  const t = useTranslations('entities.brands');
  const tCommon = useTranslations('common');
  const tTable = useTranslations('table');
  const tVal = useTranslations('validation');
  const { can } = useAuthPermissions();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const isCreate = state?.mode === 'create';
  const isEdit = state?.mode === 'edit';
  const brandId = isEdit ? state.brand.id : 0;
  const { data: brandDetail } = useBrand(brandId, isEdit);
  const brand = brandDetail ?? (isEdit ? state.brand : null);
  const open = state !== null;
  const canSubmit = isCreate
    ? can(PERMISSION_CODES.BRAND_CREATE)
    : can(PERMISSION_CODES.BRAND_UPDATE);

  const validationMessages = useMemo(
    () => ({
      required: tVal('required'),
      invalidUrl: tVal('invalidUrl'),
    }),
    [tVal],
  );

  const brandSchema = useMemo(
    () => createBrandSchema(validationMessages),
    [validationMessages],
  );

  const createForm = useForm<CreateBrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      slug: '',
      type: 'RESTAURANT',
      name: emptyLocalizedText(),
      description: emptyLocalizedText(),
      logoUrl: '',
      coverImageUrl: '',
      phone: '',
      sortOrder: 0,
      isPublished: true,
    },
  });

  const editForm = useForm<CreateBrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: createForm.formState.defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      createForm.reset();
      return;
    }
    if (!brand) return;
    editForm.reset({
      slug: brand.slug,
      type: brand.type,
      name: brand.name,
      description: brand.description,
      logoUrl: brand.logoUrl ?? '',
      coverImageUrl: brand.coverImageUrl ?? '',
      phone: brand.phone ?? '',
      sortOrder: brand.sortOrder,
      isPublished: brand.isPublished,
    });
  }, [open, isCreate, brand, createForm, editForm]);

  const onCreate = createForm.handleSubmit(async (values) => {
    try {
      await createBrand.mutateAsync({
        ...values,
        slug: values.slug || undefined,
        logoUrl: values.logoUrl || null,
        coverImageUrl: values.coverImageUrl || null,
        phone: values.phone || null,
      });
      toast.success(t('toastCreated'));
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const onUpdate = editForm.handleSubmit(async (values) => {
    if (!brand) return;
    try {
      await updateBrand.mutateAsync({
        id: brand.id,
        data: {
          ...values,
          logoUrl: values.logoUrl || null,
          coverImageUrl: values.coverImageUrl || null,
          phone: values.phone || null,
        },
      });
      toast.success(t('toastUpdated'));
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const isPending = createBrand.isPending || updateBrand.isPending;

  const formFields = (control: typeof createForm.control) => (
    <>
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('type')}</FormLabel>
            <Select
              disabled={!canSubmit}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="RESTAURANT">{t('typeRESTAURANT')}</SelectItem>
                <SelectItem value="EVENT">{t('typeEVENT')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('slug')}</FormLabel>
            <FormControl>
              <Input disabled={!canSubmit} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <LocalizedTextField
        control={control}
        name="name"
        label={tTable('name')}
        disabled={!canSubmit}
      />
      <LocalizedTextareaField
        control={control}
        name="description"
        label={tTable('description')}
        disabled={!canSubmit}
      />
      <MediaUploadField
        control={control}
        name="logoUrl"
        label={t('logoUrl')}
        disabled={!canSubmit}
      />
      <MediaUploadField
        control={control}
        name="coverImageUrl"
        label={t('coverImageUrl')}
        disabled={!canSubmit}
      />
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('phone')}</FormLabel>
            <FormControl>
              <Input disabled={!canSubmit} {...field} />
            </FormControl>
            <FormMessage />
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
      title={isCreate ? t('createTitle') : t('editTitle')}
      description={t('description')}
      footer={
        <Button
          type="submit"
          form={isCreate ? 'create-brand-form' : 'edit-brand-form'}
          disabled={!canSubmit || isPending}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {isCreate ? tCommon('create') : tCommon('saveChanges')}
        </Button>
      }
    >
      {isCreate ? (
        <Form {...createForm}>
          <form id="create-brand-form" onSubmit={onCreate} className="space-y-4">
            {formFields(createForm.control)}
          </form>
        </Form>
      ) : (
        <Form {...editForm}>
          <form id="edit-brand-form" onSubmit={onUpdate} className="space-y-4">
            {formFields(editForm.control)}
          </form>
        </Form>
      )}
    </AdminFormSheet>
  );
}
