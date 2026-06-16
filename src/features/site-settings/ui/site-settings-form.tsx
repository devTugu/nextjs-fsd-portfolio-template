'use client';

import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings, useUpdateSiteSettings } from '@/entities/site-settings';
import { useAuthPermissions } from '@/features/auth';
import { PERMISSION_CODES } from '@/shared/config/permissions';
import { getErrorMessage } from '@/shared/api';
import { MediaUploadField } from '@/entities/media';
import {
  TagInputField,
} from '@/shared/ui/form-fields';
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
import { Textarea } from '@/shared/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  emptySiteSettingsFormValues,
  toSiteSettingsFormValues,
  type SiteSettingsFormValues,
} from './site-settings-form.utils';

export function SiteSettingsForm() {
  const { can } = useAuthPermissions();
  const canUpdate = can(PERMISSION_CODES.SITE_SETTING_UPDATE);
  const { data, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const form = useForm<SiteSettingsFormValues>({
    defaultValues: emptySiteSettingsFormValues,
  });

  const navLinks = useFieldArray({ control: form.control, name: 'header.navLinks' });
  const socialLinks = useFieldArray({
    control: form.control,
    name: 'footer.socialLinks',
  });

  useEffect(() => {
    if (!data) return;
    form.reset(toSiteSettingsFormValues(data));
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateSettings.mutateAsync(values);
      toast.success('Site settings saved');
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
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Site settings</h2>
            <p className="text-sm text-muted-foreground">
              Last updated {new Date(data.updatedAt).toLocaleString()}
            </p>
          </div>
          {canUpdate ? (
            <Button type="submit" disabled={updateSettings.isPending}>
              {updateSettings.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Save changes
            </Button>
          ) : null}
        </div>

        <Tabs defaultValue="hero">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Hero section</CardTitle>
                <CardDescription>Homepage hero content.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="hero.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input disabled={!canUpdate} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hero.subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input disabled={!canUpdate} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hero.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} disabled={!canUpdate} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="hero.ctaLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA label</FormLabel>
                        <FormControl>
                          <Input disabled={!canUpdate} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hero.ctaUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA URL</FormLabel>
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
                  label="Hero image URL"
                  disabled={!canUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="header" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Header</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MediaUploadField
                  control={form.control}
                  name="header.logoUrl"
                  label="Logo URL"
                  disabled={!canUpdate}
                />
                <FormField
                  control={form.control}
                  name="header.siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site name</FormLabel>
                      <FormControl>
                        <Input disabled={!canUpdate} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Navigation links</FormLabel>
                    {canUpdate ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navLinks.append({ label: '', href: '' })}
                      >
                        <Plus className="mr-1 size-4" />
                        Add link
                      </Button>
                    ) : null}
                  </div>
                  {navLinks.fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 rounded-lg border p-3">
                      <FormField
                        control={form.control}
                        name={`header.navLinks.${index}.label`}
                        render={({ field: labelField }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                              <Input disabled={!canUpdate} {...labelField} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`header.navLinks.${index}.href`}
                        render={({ field: hrefField }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Href</FormLabel>
                            <FormControl>
                              <Input disabled={!canUpdate} {...hrefField} />
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
                          onClick={() => navLinks.remove(index)}
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

          <TabsContent value="footer" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Footer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="footer.copyright"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Copyright</FormLabel>
                      <FormControl>
                        <Input disabled={!canUpdate} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="footer.tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl>
                        <Input disabled={!canUpdate} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Social links</FormLabel>
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
                        Add social
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
                            <FormLabel>Platform</FormLabel>
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
                            <FormLabel>URL</FormLabel>
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
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="seo.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta title</FormLabel>
                      <FormControl>
                        <Input disabled={!canUpdate} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seo.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} disabled={!canUpdate} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <MediaUploadField
                  control={form.control}
                  name="seo.ogImageUrl"
                  label="OG image URL"
                  disabled={!canUpdate}
                />
                <TagInputField
                  control={form.control}
                  name="seo.keywords"
                  label="Keywords"
                  disabled={!canUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contactInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
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
                      <FormLabel>Phone</FormLabel>
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
                <FormField
                  control={form.control}
                  name="contactInfo.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
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
                <FormField
                  control={form.control}
                  name="contactInfo.showForm"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <FormLabel>Show contact form</FormLabel>
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
  );
}
