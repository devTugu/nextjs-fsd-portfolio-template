'use client';

import { type Control, type UseFieldArrayReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { CreateProjectFormValues } from '@/entities/project';
import { MediaUploadField } from '@/entities/media';
import {
  PublishedSwitch,
  SortOrderField,
  TagInputField,
  UrlField,
} from '@/shared/ui/form-fields';
import { Button } from '@/shared/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';
import { Textarea } from '@/shared/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

interface ProjectFormTabsProps {
  control: Control<CreateProjectFormValues>;
  images: UseFieldArrayReturn<CreateProjectFormValues, 'images'>;
  disabled?: boolean;
}

export function ProjectFormTabs({
  control,
  images,
  disabled,
}: ProjectFormTabsProps) {
  return (
    <Tabs defaultValue="general">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="links">Links</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="space-y-4 pt-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input disabled={disabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="auto-generated if empty"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short description</FormLabel>
              <FormControl>
                <Input disabled={disabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={5} disabled={disabled} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TagInputField
          control={control}
          name="techStack"
          label="Tech stack"
          disabled={disabled}
        />
        <FormField
          control={control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <FormLabel>Featured</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <PublishedSwitch control={control} name="isPublished" disabled={disabled} />
        <SortOrderField control={control} name="sortOrder" disabled={disabled} />
      </TabsContent>
      <TabsContent value="media" className="space-y-4 pt-4">
        <MediaUploadField
          control={control}
          name="thumbnailUrl"
          label="Thumbnail URL"
          disabled={disabled}
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FormLabel>Gallery images</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => images.append({ url: '', alt: '' })}
            >
              <Plus className="mr-1 size-4" />
              Add image
            </Button>
          </div>
          {images.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 rounded-lg border p-3">
              <div className="grid flex-1 gap-2">
                <FormField
                  control={control}
                  name={`images.${index}.url`}
                  render={({ field: urlField }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input disabled={disabled} {...urlField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`images.${index}.alt`}
                  render={({ field: altField }) => (
                    <FormItem>
                      <FormLabel>Alt text</FormLabel>
                      <FormControl>
                        <Input disabled={disabled} {...altField} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                onClick={() => images.remove(index)}
                aria-label="Remove image"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="links" className="space-y-4 pt-4">
        <UrlField control={control} name="liveUrl" label="Live URL" disabled={disabled} />
        <UrlField control={control} name="repoUrl" label="Repository URL" disabled={disabled} />
      </TabsContent>
    </Tabs>
  );
}
