export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteSettingsHero {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string | null;
}

export interface SiteSettingsHeader {
  logoUrl: string | null;
  siteName: string;
  navLinks: NavLink[];
}

export interface SiteSettingsFooter {
  copyright: string;
  tagline: string;
  socialLinks: SocialLink[];
}

export interface SiteSettingsSeo {
  title: string;
  description: string;
  ogImageUrl: string | null;
  keywords: string[];
}

export interface SiteSettingsContactInfo {
  email: string;
  phone: string | null;
  location: string | null;
  showForm: boolean;
}

export interface SiteSettingsOutput {
  id: number;
  hero: SiteSettingsHero;
  header: SiteSettingsHeader;
  footer: SiteSettingsFooter;
  seo: SiteSettingsSeo;
  contactInfo: SiteSettingsContactInfo;
  updatedAt: string;
}

export interface UpdateSiteSettingsInput {
  hero?: Partial<SiteSettingsHero>;
  header?: Partial<SiteSettingsHeader>;
  footer?: Partial<SiteSettingsFooter>;
  seo?: Partial<SiteSettingsSeo>;
  contactInfo?: Partial<SiteSettingsContactInfo>;
}
