import type { SiteSettingsOutput } from '@/entities/site-settings';

export type SiteSettingsFormValues = Omit<
  SiteSettingsOutput,
  'id' | 'updatedAt'
>;

export const emptySiteSettingsFormValues: SiteSettingsFormValues = {
  hero: {
    title: '',
    subtitle: '',
    description: '',
    ctaLabel: '',
    ctaUrl: '',
    imageUrl: '',
  },
  header: {
    logoUrl: '',
    siteName: '',
    navLinks: [],
  },
  footer: {
    copyright: '',
    tagline: '',
    socialLinks: [],
  },
  seo: {
    title: '',
    description: '',
    ogImageUrl: '',
    keywords: [],
  },
  contactInfo: {
    email: '',
    phone: '',
    location: '',
    showForm: true,
  },
};

export function toSiteSettingsFormValues(
  data: SiteSettingsOutput
): SiteSettingsFormValues {
  return {
    hero: {
      ...data.hero,
      imageUrl: data.hero.imageUrl ?? '',
    },
    header: {
      ...data.header,
      logoUrl: data.header.logoUrl ?? '',
    },
    footer: data.footer,
    seo: {
      ...data.seo,
      ogImageUrl: data.seo.ogImageUrl ?? '',
      keywords: data.seo.keywords ?? [],
    },
    contactInfo: {
      ...data.contactInfo,
      phone: data.contactInfo.phone ?? '',
      location: data.contactInfo.location ?? '',
    },
  };
}
