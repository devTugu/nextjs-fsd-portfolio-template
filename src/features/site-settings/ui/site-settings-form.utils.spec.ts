import { describe, expect, it } from 'vitest';
import {
  emptySiteSettingsFormValues,
  toSiteSettingsFormValues,
} from '@/features/site-settings/ui/site-settings-form.utils';
import type { SiteSettingsOutput } from '@/entities/site-settings';

const baseSettings: SiteSettingsOutput = {
  id: 1,
  updatedAt: '2026-01-01T00:00:00.000Z',
  hero: {
    title: 'Hello',
    subtitle: 'World',
    description: 'Desc',
    ctaLabel: 'CTA',
    ctaUrl: '/',
    imageUrl: null,
  },
  header: {
    logoUrl: null,
    siteName: 'Site',
    navLinks: [],
  },
  footer: {
    copyright: '2026',
    tagline: 'Tag',
    socialLinks: [],
  },
  seo: {
    title: 'SEO',
    description: 'Meta',
    ogImageUrl: null,
    keywords: [],
  },
  contactInfo: {
    email: 'a@b.com',
    phone: null,
    location: null,
    showForm: true,
  },
};

describe('toSiteSettingsFormValues', () => {
  it('normalizes nullable strings to empty values', () => {
    const values = toSiteSettingsFormValues(baseSettings);

    expect(values.hero.imageUrl).toBe('');
    expect(values.header.logoUrl).toBe('');
    expect(values.seo.ogImageUrl).toBe('');
    expect(values.seo.keywords).toEqual([]);
  });

  it('provides stable empty defaults', () => {
    expect(emptySiteSettingsFormValues.hero.title).toBe('');
    expect(emptySiteSettingsFormValues.contactInfo.showForm).toBe(true);
  });
});
