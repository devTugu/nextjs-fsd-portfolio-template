'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { cn } from '@/shared/lib/utils';
import {
  createContactSchema,
  type ContactFormValues,
} from '../lib/contact.schema';

const STEPS = ['email', 'info', 'message'] as const;
type Step = (typeof STEPS)[number];

const REGIONS = ['Mongolia', 'United States', 'United Kingdom', 'Singapore', 'Germany'] as const;

async function fetchCsrfToken(): Promise<string> {
  const response = await fetch('/api/auth/csrf');
  const json = (await response.json()) as { data: { token: string } };
  return json.data.token;
}

export function ContactSalesForm() {
  const t = useTranslations('marketing.contact');
  const tVal = useTranslations('marketing.validation');
  const [step, setStep] = useState<Step>('email');
  const [region, setRegion] = useState<string>('Mongolia');
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

  const stepIndex = STEPS.indexOf(step);

  const goNext = async () => {
    if (step === 'email') {
      const valid = await form.trigger('email');
      if (valid) setStep('info');
      return;
    }
    if (step === 'info') {
      const valid = await form.trigger(['name', 'subject']);
      if (valid) setStep('message');
    }
  };

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
        body: JSON.stringify({
          ...values,
          subject: values.subject || `[${region}] Sales inquiry`,
        }),
      });

      if (!response.ok) throw new Error('submit_failed');

      toast.success(t('success'));
      form.reset();
      setStep('email');
    } catch {
      toast.error(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background border-border/60 mx-auto w-full max-w-xl rounded-2xl border p-8 shadow-lg md:p-10">
      <StepIndicator activeIndex={stepIndex} labels={[t('stepEmail'), t('stepInfo'), t('stepTalk')]} />

      <div className="mt-8">
        <h1 className="text-2xl font-semibold tracking-tight">{t('salesTitle')}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t('salesSubtitle')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {step === 'email' ? (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('workEmail')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jane@example.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>{t('regionLabel')}</FormLabel>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : null}

          {step === 'info' ? (
            <>
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
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('companyLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('companyPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}

          {step === 'message' ? (
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
          ) : null}

          <input type="hidden" aria-hidden tabIndex={-1} {...form.register('website')} />

          <div className="flex justify-end gap-3 pt-2">
            {step !== 'email' ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(step === 'message' ? 'info' : 'email')}
              >
                {t('back')}
              </Button>
            ) : null}
            {step !== 'message' ? (
              <Button type="button" onClick={goNext}>
                {t('continue')}
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                {t('submit')}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

function StepIndicator({
  activeIndex,
  labels,
}: {
  activeIndex: number;
  labels: string[];
}) {
  return (
    <div className="flex gap-6">
      {labels.map((label, index) => (
        <div key={label} className="flex-1">
          <p
            className={cn(
              'text-xs font-medium',
              index <= activeIndex ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {label}
          </p>
          <div
            className={cn(
              'mt-2 h-1 rounded-full',
              index <= activeIndex ? 'bg-[var(--marketing-indigo)]' : 'bg-muted',
            )}
          />
        </div>
      ))}
    </div>
  );
}
