'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Trash2 } from 'lucide-react';
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
      toast.success('Status updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{detail?.subject ?? 'Contact message'}</SheetTitle>
          <SheetDescription>
            From {detail?.name} ({detail?.email})
          </SheetDescription>
        </SheetHeader>
        {detail ? (
          <div className="space-y-4 px-4 pb-4">
            <div className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
              {detail.message}
            </div>
            <p className="text-xs text-muted-foreground">
              Received {new Date(detail.createdAt).toLocaleString()}
              {detail.ipAddress ? ` · IP ${detail.ipAddress}` : ''}
            </p>
            <Separator />
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
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
                          <SelectItem value="NEW">NEW</SelectItem>
                          <SelectItem value="READ">READ</SelectItem>
                          <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
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
                    Update status
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
              Delete message
            </Button>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
