'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useSiteSettings, useUpdateSiteSettings } from '@/entities/site-settings';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { ROUTES } from '@/shared/config/routes';
import { getErrorMessage } from '@/shared/api';
import { MediaUploadField } from '@/entities/media';
import {
  LocalizedTagInputField,
  LocalizedTextField,
  LocalizedTextareaField,
  ColorPickerField,
} from '@/shared/ui/form-fields';
import { normalizeHexColor } from '@/shared/lib/normalize-hex-color';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  emptySiteSettingsFormValues,
  toSiteSettingsFormValues,
  type SiteSettingsFormValues,
} from './site-settings-form.utils';
import { emptyLocalizedText } from '@/shared/i18n/localized-content';
import { AdminContentLocaleProvider } from '@/shared/i18n/admin-content-locale-context';
import { AdminContentLocaleTabs } from '@/widgets/admin-content-locale-tabs';

export function SiteSettingsForm() {
  const t = useTranslations('entities.siteSettings');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const tTable = useTranslations('table');
  const { can } = useAuthPermissions();
  const canUpdate = can(PERMISSION_CODES.SITE_SETTING_UPDATE);
  const { data, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const form = useForm<SiteSettingsFormValues>({
    defaultValues: emptySiteSettingsFormValues,
  });

  const socialLinks = useFieldArray({
    control: form.control,
    name: 'footer.socialLinks',
  });

  useEffect(() => {
    if (!data) return;
    form.reset(toSiteSettingsFormValues(data));
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const location = values.contactInfo.location ?? emptyLocalizedText();
    const address = values.contactInfo.address ?? emptyLocalizedText();
    const workHours = values.contactInfo.workHours ?? emptyLocalizedText();
    const hasText = (value: string | null | undefined) =>
      Boolean(value?.trim());
    const normalizedLocation =
      hasText(location.en) || hasText(location.mn) ? location : null;
    const normalizedAddress =
      hasText(address.en) || hasText(address.mn) ? address : null;
    const normalizedWorkHours =
      hasText(workHours.en) || hasText(workHours.mn) ? workHours : null;
    const normalizeUrl = (value: string | null | undefined) =>
      hasText(value) ? value!.trim() : null;

    try {
      await updateSettings.mutateAsync({
        ...values,
        header: {
          ...values.header,
          logoUrl: normalizeUrl(values.header.logoUrl),
          logoDarkUrl: normalizeUrl(values.header.logoDarkUrl),
          adminLogoUrl: normalizeUrl(values.header.adminLogoUrl),
          faviconUrl: normalizeUrl(values.header.faviconUrl),
        },
        footer: {
          ...values.footer,
          socialLinks: values.footer.socialLinks.filter(
            (link) => hasText(link.platform) && hasText(link.url),
          ),
        },
        theme: {
          brandColor: normalizeHexColor(values.theme.brandColor),
        },
        contactInfo: {
          ...values.contactInfo,
          location: normalizedLocation,
          address: normalizedAddress,
          workHours: normalizedWorkHours,
        },
      });
      toast.success(t('toastSaved'));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <AdminContentLocaleProvider resetKey={data.updatedAt}>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {t('lastUpdated', {
                date: new Date(data.updatedAt).toLocaleString(),
              })}
            </p>
            {canUpdate ? (
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                {tCommon('saveChanges')}
              </Button>
            ) : null}
          </div>

          <AdminContentLocaleTabs className="rounded-lg border px-4" />

          <Tabs defaultValue="hero">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7">
            <TabsTrigger value="hero">{t('tabHero')}</TabsTrigger>
            <TabsTrigger value="about">{t('tabAbout')}</TabsTrigger>
            <TabsTrigger value="theme">{t('tabTheme')}</TabsTrigger>
            <TabsTrigger value="header">{t('tabHeader')}</TabsTrigger>
            <TabsTrigger value="footer">{t('tabFooter')}</TabsTrigger>
            <TabsTrigger value="seo">{t('tabSeo')}</TabsTrigger>
            <TabsTrigger value="contact">{t('tabContact')}</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('heroSectionTitle')}</CardTitle>
                <CardDescription>{t('heroSectionDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <LocalizedTextField
                  control={form.control}
                  name="hero.title"
                  label={tTable('title')}
                  disabled={!canUpdate}
                />
                <LocalizedTextField
                  control={form.control}
                  name="hero.subtitle"
                  label={t('subtitle')}
                  disabled={!canUpdate}
                />
                <LocalizedTextareaField
                  control={form.control}
                  name="hero.description"
                  label={tTable('description')}
                  disabled={!canUpdate}
                  rows={3}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <LocalizedTextField
                    control={form.control}
                    name="hero.ctaLabel"
                    label={t('ctaLabel')}
                    disabled={!canUpdate}
                  />
                  <FormField
                    control={form.control}
                    name="hero.ctaUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('ctaUrl')}</FormLabel>
                        <FormControl>
                          <Input disabled={!canUpdate} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <LocalizedTextField
                    control={form.control}
                    name="hero.secondaryCtaLabel"
                    label={t('secondaryCtaLabel')}
                    disabled={!canUpdate}
                  />
                  <FormField
                    control={form.control}
                    name="hero.secondaryCtaUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('secondaryCtaUrl')}</FormLabel>
                        <FormControl>
                          <Input disabled={!canUpdate} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <MediaUploadField
                  control={form.control}
                  name="hero.imageUrl"
                  label={t('heroImageUrl')}
                  disabled={!canUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('aboutSectionTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LocalizedTextareaField
                  control={form.control}
                  name="about.brief"
                  label={t('aboutBrief')}
                  disabled={!canUpdate}
                  rows={3}
                />
                <LocalizedTextareaField
                  control={form.control}
                  name="about.mission"
                  label={t('aboutMission')}
                  disabled={!canUpdate}
                  rows={3}
                />
                <LocalizedTextareaField
                  control={form.control}
                  name="about.vision"
                  label={t('aboutVision')}
                  disabled={!canUpdate}
                  rows={3}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('themeSectionTitle')}</CardTitle>
                <CardDescription>{t('themeSectionDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ColorPickerField
                  control={form.control}
                  name="theme.brandColor"
                  label={t('brandColor')}
                  description={t('brandColorDescription')}
                  disabled={!canUpdate}
                  placeholder="#635BFF"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="header" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('headerSectionTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MediaUploadField
                  control={form.control}
                  name="header.logoUrl"
                  label={t('logoUrl')}
                  disabled={!canUpdate}
                />
                <MediaUploadField
                  control={form.control}
                  name="header.logoDarkUrl"
                  label={t('logoDarkUrl')}
                  disabled={!canUpdate}
                />
                <MediaUploadField
                  control={form.control}
                  name="header.adminLogoUrl"
                  label={t('adminLogoUrl')}
                  disabled={!canUpdate}
                />
                <MediaUploadField
                  control={form.control}
                  name="header.faviconUrl"
                  label={t('faviconUrl')}
                  disabled={!canUpdate}
                />
                <LocalizedTextField
                  control={form.control}
                  name="header.siteName"
                  label={t('siteName')}
                  disabled={!canUpdate}
                />
                <div className="rounded-lg border p-4">
                  <p className="text-muted-foreground text-sm">{t('manageNavigation')}</p>
                  <Button type="button" variant="link" className="mt-2 h-auto p-0" asChild>
                    <Link href={ROUTES.NAVIGATION}>{t('manageNavigationLink')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('footerSectionTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LocalizedTextField
                  control={form.control}
                  name="footer.copyright"
                  label={t('copyright')}
                  disabled={!canUpdate}
                />
                <LocalizedTextField
                  control={form.control}
                  name="footer.tagline"
                  label={t('tagline')}
                  disabled={!canUpdate}
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('socialLinks')}</FormLabel>
                    {canUpdate ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          socialLinks.append({ platform: '', url: '' })
                        }
                      >
                        <Plus className="mr-1 size-4" />
                        {t('addSocial')}
                      </Button>
                    ) : null}
                  </div>
                  {socialLinks.fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 rounded-lg border p-3">
                      <FormField
                        control={form.control}
                        name={`footer.socialLinks.${index}.platform`}
                        render={({ field: platformField }) => (
                          <FormItem className="flex-1">
                            <FormLabel>{t('platform')}</FormLabel>
                            <FormControl>
                              <Input disabled={!canUpdate} {...platformField} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`footer.socialLinks.${index}.url`}
                        render={({ field: urlField }) => (
                          <FormItem className="flex-1">
                            <FormLabel>{t('href')}</FormLabel>
                            <FormControl>
                              <Input disabled={!canUpdate} {...urlField} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {canUpdate ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-8"
                          onClick={() => socialLinks.remove(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('seoSectionTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LocalizedTextField
                  control={form.control}
                  name="seo.title"
                  label={t('metaTitle')}
                  disabled={!canUpdate}
                />
                <LocalizedTextareaField
                  control={form.control}
                  name="seo.description"
                  label={t('metaDescription')}
                  disabled={!canUpdate}
                  rows={3}
                />
                <MediaUploadField
                  control={form.control}
                  name="seo.ogImageUrl"
                  label={t('ogImageUrl')}
                  disabled={!canUpdate}
                />
                <LocalizedTagInputField
                  control={form.control}
                  name="seo.keywords"
                  label={t('keywords')}
                  disabled={!canUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('contactSectionTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contactInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tAuth('email')}</FormLabel>
                      <FormControl>
                        <Input type="email" disabled={!canUpdate} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phone')}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!canUpdate}
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <LocalizedTextField
                  control={form.control}
                  name="contactInfo.location"
                  label={t('location')}
                  disabled={!canUpdate}
                />
                <LocalizedTextField
                  control={form.control}
                  name="contactInfo.address"
                  label={t('address')}
                  disabled={!canUpdate}
                />
                <LocalizedTextField
                  control={form.control}
                  name="contactInfo.workHours"
                  label={t('workHours')}
                  disabled={!canUpdate}
                />
                <FormField
                  control={form.control}
                  name="contactInfo.showForm"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <FormLabel>{t('showContactForm')}</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!canUpdate}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
    </AdminContentLocaleProvider>
  );
}
