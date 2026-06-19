'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { Textarea } from '@/shared/ui/textarea';
import {
  createContactSchema,
  type ContactFormValues,
} from '../lib/contact.schema';

async function fetchCsrfToken(): Promise<string> {
  const response = await fetch('/api/auth/csrf');
  const json = (await response.json()) as { data: { token: string } };
  return json.data.token;
}

export function ContactForm() {
  const t = useTranslations('marketing.contact');
  const tVal = useTranslations('marketing.validation');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = createContactSchema({
    nameRequired: tVal('nameRequired'),
    emailInvalid: tVal('emailInvalid'),
    messageMin: tVal('messageMin'),
  });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      website: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const csrf = await fetchCsrfToken();
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrf,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('submit_failed');
      }

      toast.success(t('success'));
      form.reset();
    } catch {
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('subject')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('message')}</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <input type="hidden" aria-hidden tabIndex={-1} {...form.register('website')} />
        <Button type="submit" disabled={isSubmitting} className="min-h-11 w-full sm:w-auto">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {t('submit')}
        </Button>
      </form>
    </Form>
  );
}
