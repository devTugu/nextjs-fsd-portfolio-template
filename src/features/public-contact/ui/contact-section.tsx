import { Mail, MapPin, Phone } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import type { SiteSettingsContactInfo } from '@/entities/site-settings';
import { ContactSalesForm } from '@/features/public-contact/ui/contact-sales-form';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { Container, GradientRibbon, Section } from '@/shared/ui/marketing';

interface ContactSectionProps {
  contactInfo: SiteSettingsContactInfo;
}

interface SidebarLabels {
  emailLabel: string;
  phoneLabel: string;
  locationLabel: string;
}

function ContactSidebar({
  contactInfo,
  locale,
  labels,
}: {
  contactInfo: SiteSettingsContactInfo;
  locale: Locale;
  labels: SidebarLabels;
}) {
  const location = contactInfo.location
    ? pickLocalized(contactInfo.location, locale)
    : null;
  const hasDetails = contactInfo.email || contactInfo.phone || location;

  if (!hasDetails) {
    return null;
  }

  return (
    <aside className="bg-card border-border/60 space-y-6 rounded-2xl border p-6 shadow-sm lg:p-8">
      {contactInfo.email ? (
        <ContactInfoRow
          icon={Mail}
          label={labels.emailLabel}
          value={contactInfo.email}
          href={`mailto:${contactInfo.email}`}
        />
      ) : null}
      {contactInfo.phone ? (
        <ContactInfoRow
          icon={Phone}
          label={labels.phoneLabel}
          value={contactInfo.phone}
          href={`tel:${contactInfo.phone}`}
        />
      ) : null}
      {location ? (
        <ContactInfoRow icon={MapPin} label={labels.locationLabel} value={location} />
      ) : null}
    </aside>
  );
}

function ContactInfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="text-[var(--marketing-indigo)] mt-0.5 size-5 shrink-0" />
      <div>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
        {href ? (
          <a href={href} className="mt-1 block font-medium hover:underline">
            {value}
          </a>
        ) : (
          <p className="mt-1 font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

export async function ContactSection({ contactInfo }: ContactSectionProps) {
  const t = await getTranslations('marketing.contact');
  const locale = (await getLocale()) as Locale;
  const sidebarLabels: SidebarLabels = {
    emailLabel: t('emailLabel'),
    phoneLabel: t('phoneLabel'),
    locationLabel: t('locationLabel'),
  };

  return (
    <Section className="relative min-h-[70vh] overflow-hidden pt-12 pb-24 md:pt-16">
      <GradientRibbon className="bottom-0 h-[320px] opacity-80" />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            {contactInfo.showForm ? (
              <ContactSalesForm />
            ) : (
              <div className="bg-background border-border/60 rounded-2xl border p-8 text-center shadow-lg">
                <h1 className="text-2xl font-semibold">{t('title')}</h1>
                <p className="text-muted-foreground mt-3">{t('description')}</p>
                {contactInfo.email ? (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-[var(--marketing-indigo)] mt-4 inline-block font-medium hover:underline"
                  >
                    {contactInfo.email}
                  </a>
                ) : null}
              </div>
            )}
          </div>
          <ContactSidebar contactInfo={contactInfo} locale={locale} labels={sidebarLabels} />
        </div>
      </Container>
    </Section>
  );
}
