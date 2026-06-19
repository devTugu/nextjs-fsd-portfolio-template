'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  type NavigationNodeOutput,
  type NavigationNodeType,
  type NavigationScope,
  useCreateNavigationNode,
  useUpdateNavigationNode,
} from '@/entities/navigation';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { getErrorMessage } from '@/shared/api';
import { emptyLocalizedText } from '@/shared/i18n/localized-content';
import { AdminContentLocaleProvider } from '@/shared/i18n/admin-content-locale-context';
import { AdminContentLocaleTabs } from '@/widgets/admin-content-locale-tabs';
import { localizedTextSchema } from '@/shared/lib/localized-content.schema';
import {
  LocalizedTextField,
  LocalizedTextareaField,
  PublishedSwitch,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';

const nodeSchema = z.object({
  type: z.enum(['MEGA', 'COLUMN', 'LINK', 'SIDEBAR', 'PROMO', 'CTA_ROW', 'GROUP']),
  labels: localizedTextSchema,
  descriptions: localizedTextSchema.optional(),
  href: z.string().optional(),
  sortOrder: z.number().int().min(0),
  isPublished: z.boolean(),
});

type NodeFormValues = z.infer<typeof nodeSchema>;

const HEADER_TYPES: NavigationNodeType[] = [
  'MEGA',
  'COLUMN',
  'LINK',
  'SIDEBAR',
  'PROMO',
  'CTA_ROW',
];

const FOOTER_TYPES: NavigationNodeType[] = ['GROUP', 'LINK'];

interface NavigationNodeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: NavigationScope;
  node: NavigationNodeOutput | null;
  parentId: number | null;
  flatNodes: NavigationNodeOutput[];
}

export function NavigationNodeSheet({
  open,
  onOpenChange,
  scope,
  node,
  parentId,
}: NavigationNodeSheetProps) {
  const t = useTranslations('entities.navigation');
  const tTable = useTranslations('table');
  const { can } = useAuthPermissions();
  const createNode = useCreateNavigationNode();
  const updateNode = useUpdateNavigationNode();
  const canUpdate = can(PERMISSION_CODES.NAV_UPDATE);
  const canCreate = can(PERMISSION_CODES.NAV_CREATE);
  const isEditing = node !== null;
  const readOnly = isEditing ? !canUpdate : !canCreate;

  const form = useForm<NodeFormValues>({
    resolver: zodResolver(nodeSchema),
    defaultValues: {
      type: scope === 'HEADER' ? 'LINK' : 'GROUP',
      labels: emptyLocalizedText(),
      descriptions: emptyLocalizedText(),
      href: '',
      sortOrder: 0,
      isPublished: true,
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      type: node?.type ?? (scope === 'HEADER' ? 'LINK' : 'GROUP'),
      labels: node?.labels ?? emptyLocalizedText(),
      descriptions: node?.descriptions ?? emptyLocalizedText(),
      href: node?.href ?? '',
      sortOrder: node?.sortOrder ?? 0,
      isPublished: node?.isPublished ?? true,
    });
  }, [open, node, scope, form]);

  const allowedTypes = scope === 'HEADER' ? HEADER_TYPES : FOOTER_TYPES;
  const selectedType = useWatch({ control: form.control, name: 'type' });
  const hrefRequired = selectedType === 'LINK' || selectedType === 'CTA_ROW';

  const onSubmit = async (values: NodeFormValues) => {
    const payload = {
      scope,
      parentId,
      type: values.type,
      labels: values.labels,
      descriptions: values.descriptions?.en || values.descriptions?.mn
        ? values.descriptions
        : null,
      href: values.href?.trim() || null,
      sortOrder: values.sortOrder,
      isPublished: values.isPublished,
    };

    try {
      if (isEditing && node) {
        await updateNode.mutateAsync({ id: node.id, data: payload });
        toast.success(t('updated'));
      } else {
        await createNode.mutateAsync(payload);
        toast.success(t('created'));
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <AdminContentLocaleProvider resetKey={open ? (node?.id ?? 'create') : false}>
          <SheetHeader className="px-6 pt-6">
            <SheetTitle>{isEditing ? t('editNode') : t('createNode')}</SheetTitle>
            <SheetDescription>{t('sheetDescription')}</SheetDescription>
          </SheetHeader>
          <AdminContentLocaleTabs />

          <div className="flex-1 overflow-y-auto px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('nodeType')}</FormLabel>
                  <Select
                    disabled={readOnly}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allowedTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LocalizedTextField
              control={form.control}
              name="labels"
              label={tTable('name')}
              disabled={readOnly}
            />

            <LocalizedTextareaField
              control={form.control}
              name="descriptions"
              label={tTable('description')}
              disabled={readOnly}
              rows={2}
            />

            {hrefRequired ? (
              <FormField
                control={form.control}
                name="href"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('href')}</FormLabel>
                    <FormControl>
                      <Input disabled={readOnly} placeholder="/contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sortOrder')}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={readOnly}
                      type="number"
                      min={0}
                      {...field}
                      onChange={(event) => field.onChange(event.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PublishedSwitch control={form.control} name="isPublished" disabled={readOnly} />

            {!readOnly ? (
              <SheetFooter>
                <Button type="submit" disabled={createNode.isPending || updateNode.isPending}>
                  {isEditing ? t('save') : t('createNode')}
                </Button>
              </SheetFooter>
            ) : null}
          </form>
        </Form>
          </div>
        </AdminContentLocaleProvider>
      </SheetContent>
    </Sheet>
  );
}
