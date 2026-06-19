'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  type ContactMessageOutput,
  type ContactMessageStatus,
  useContactMessage,
  useUpdateContactMessage,
} from '@/entities/contact-message';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { getErrorMessage } from '@/shared/api';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/shared/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';

interface ContactDetailSheetProps {
  message: ContactMessageOutput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export function ContactDetailSheet({
  message,
  open,
  onOpenChange,
  onDelete,
}: ContactDetailSheetProps) {
  const t = useTranslations('entities.contactMessages');
  const tTable = useTranslations('table');
  const tStatus = useTranslations('status');
  const { can } = useAuthPermissions();
  const canUpdate = can(PERMISSION_CODES.CONTACT_UPDATE);
  const canDelete = can(PERMISSION_CODES.CONTACT_DELETE);
  const { data } = useContactMessage(message?.id ?? 0, open && Boolean(message));
  const detail = data ?? message;
  const updateMessage = useUpdateContactMessage();

  const form = useForm<{ status: ContactMessageStatus }>({
    defaultValues: { status: 'NEW' },
  });

  useEffect(() => {
    if (detail) form.reset({ status: detail.status });
  }, [detail, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!detail) return;
    try {
      await updateMessage.mutateAsync({ id: detail.id, data: values });
      toast.success(t('toastStatusUpdated'));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  const receivedDate = detail
    ? new Date(detail.createdAt).toLocaleString()
    : '';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{detail?.subject ?? t('defaultTitle')}</SheetTitle>
          <SheetDescription>
            {detail
              ? t('fromLine', { name: detail.name, email: detail.email })
              : null}
          </SheetDescription>
        </SheetHeader>
        {detail ? (
          <div className="space-y-4 px-4 pb-4">
            <div className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
              {detail.message}
            </div>
            <p className="text-xs text-muted-foreground">
              {detail.ipAddress
                ? t('receivedWithIp', {
                    date: receivedDate,
                    ip: detail.ipAddress,
                  })
                : t('receivedLine', { date: receivedDate })}
            </p>
            <Separator />
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tTable('status')}</FormLabel>
                      <Select
                        value={field.value ?? 'NEW'}
                        onValueChange={field.onChange}
                        disabled={!canUpdate}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NEW">{tStatus('new')}</SelectItem>
                          <SelectItem value="READ">{tStatus('read')}</SelectItem>
                          <SelectItem value="ARCHIVED">
                            {tStatus('archived')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {canUpdate ? (
                  <Button type="submit" disabled={updateMessage.isPending}>
                    {updateMessage.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : null}
                    {t('updateStatus')}
                  </Button>
                ) : null}
              </form>
            </Form>
          </div>
        ) : null}
        <SheetFooter>
          {canDelete ? (
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 size-4" />
              {t('deleteMessage')}
            </Button>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
