'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  type NewsPostOutput,
  useNewsPost,
  useCreateNewsPost,
  useUpdateNewsPost,
} from '@/entities/news-post';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { getErrorMessage } from '@/shared/api';
import { emptyLocalizedText } from '@/shared/i18n/localized-content';
import { localizedTextSchema } from '@/shared/lib/localized-content.schema';
import {
  LocalizedTextField,
  LocalizedTextareaField,
} from '@/shared/ui/form-fields';
import { AdminFormSheet } from '@/widgets/admin-form-sheet';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

const newsPostSchema = z.object({
  title: localizedTextSchema,
  slug: z.string().optional(),
  excerpt: localizedTextSchema,
  content: localizedTextSchema,
  category: z.enum(['PRODUCT', 'ENGINEERING', 'CORPORATE', 'INDUSTRY']),
  authorName: localizedTextSchema,
  authorRole: localizedTextSchema,
  coverImageUrl: z.string().optional(),
  isPublished: z.boolean(),
  sortOrder: z.number().int().min(0),
});

type NewsPostFormValues = z.infer<typeof newsPostSchema>;

export type NewsPostSheetState =
  | { mode: 'create' }
  | { mode: 'edit'; post: NewsPostOutput };

interface NewsPostManageSheetProps {
  state: NewsPostSheetState | null;
  onOpenChange: (open: boolean) => void;
}

const emptyValues: NewsPostFormValues = {
  title: emptyLocalizedText(),
  slug: '',
  excerpt: emptyLocalizedText(),
  content: emptyLocalizedText(),
  category: 'PRODUCT',
  authorName: emptyLocalizedText(),
  authorRole: emptyLocalizedText(),
  coverImageUrl: '',
  isPublished: false,
  sortOrder: 0,
};

export function NewsPostManageSheet({ state, onOpenChange }: NewsPostManageSheetProps) {
  const t = useTranslations('entities.news');
  const tCommon = useTranslations('common');
  const tTable = useTranslations('table');
  const tStatus = useTranslations('status');
  const { can } = useAuthPermissions();
  const createPost = useCreateNewsPost();
  const updatePost = useUpdateNewsPost();
  const isCreate = state?.mode === 'create';
  const isEdit = state?.mode === 'edit';
  const postId = isEdit ? state.post.id : 0;
  const { data: postDetail } = useNewsPost(postId, isEdit);
  const post = postDetail ?? (isEdit ? state.post : null);
  const open = state !== null;
  const canSubmit = isCreate
    ? can(PERMISSION_CODES.BLOG_CREATE)
    : can(PERMISSION_CODES.BLOG_UPDATE);

  const form = useForm<NewsPostFormValues>({
    resolver: zodResolver(newsPostSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;
    if (post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        authorName: post.authorName,
        authorRole: post.authorRole,
        coverImageUrl: post.coverImageUrl ?? '',
        isPublished: post.isPublished,
        sortOrder: post.sortOrder,
      });
      return;
    }
    form.reset(emptyValues);
  }, [open, post, form]);

  const title = useMemo(
    () => (isCreate ? t('createTitle') : t('editTitle')),
    [isCreate, t],
  );

  async function onSubmit(values: NewsPostFormValues) {
    const payload = {
      ...values,
      slug: values.slug?.trim() || undefined,
      coverImageUrl: values.coverImageUrl?.trim() || null,
    };

    try {
      if (isCreate) {
        await createPost.mutateAsync(payload);
        toast.success(t('toastCreated'));
      } else if (post) {
        await updatePost.mutateAsync({ id: post.id, data: payload });
        toast.success(t('toastUpdated'));
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const pending = createPost.isPending || updatePost.isPending;

  return (
    <AdminFormSheet open={open} onOpenChange={onOpenChange} title={title}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <LocalizedTextField
            control={form.control}
            name="title"
            label={tTable('title')}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tTable('slug')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="auto-generated if empty" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('category')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(['PRODUCT', 'ENGINEERING', 'CORPORATE', 'INDUSTRY'] as const).map(
                      (value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <LocalizedTextareaField
            control={form.control}
            name="excerpt"
            label={t('excerpt')}
            rows={2}
          />
          <LocalizedTextareaField
            control={form.control}
            name="content"
            label={t('content')}
            rows={8}
          />
          <LocalizedTextField
            control={form.control}
            name="authorName"
            label={t('authorName')}
          />
          <LocalizedTextField
            control={form.control}
            name="authorRole"
            label={t('authorRole')}
          />
          <FormField
            control={form.control}
            name="coverImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('coverImageUrl')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tTable('order')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <FormLabel>{tStatus('published')}</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          {canSubmit ? (
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {tCommon('save')}
            </Button>
          ) : null}
        </form>
      </Form>
    </AdminFormSheet>
  );
}
