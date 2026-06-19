'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PUBLIC_ROUTES } from '@/shared/config/routes';
import { Input } from '@/shared/ui/input';
import { MarketingButton } from '@/shared/ui/marketing';

export function NewsSubscribeForm() {
  const t = useTranslations('marketing.news');
  const [email, setEmail] = useState('');

  const href =
    email.trim().length > 0
      ? `${PUBLIC_ROUTES.CONTACT}?email=${encodeURIComponent(email.trim())}`
      : PUBLIC_ROUTES.CONTACT;

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        window.location.href = href;
      }}
    >
      <Input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={t('subscribePlaceholder')}
        className="bg-background h-11 min-w-[240px] flex-1"
        autoComplete="email"
      />
      <MarketingButton href={href} variant="primary">
        {t('subscribeButton')}
      </MarketingButton>
    </form>
  );
}
