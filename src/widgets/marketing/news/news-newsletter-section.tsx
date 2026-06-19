import { getTranslations } from 'next-intl/server';
import { NewsSubscribeForm } from './news-subscribe-form';

export async function NewsNewsletterSection() {
  const t = await getTranslations('marketing.news');

  return (
    <section className="border-t bg-[var(--marketing-surface-muted)] py-16">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">{t('subscribeTitle')}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{t('subscribeDescription')}</p>
        <div className="mt-6">
          <NewsSubscribeForm />
        </div>
      </div>
    </section>
  );
}
