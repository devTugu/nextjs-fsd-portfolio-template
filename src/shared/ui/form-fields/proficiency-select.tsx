'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

const LEVELS = [1, 2, 3, 4, 5] as const;

interface ProficiencySelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  disabled?: boolean;
}

export function ProficiencySelect<T extends FieldValues>({
  control,
  name,
  label = 'Proficiency',
  disabled,
}: ProficiencySelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={String(field.value ?? 3)}
            onValueChange={(value) => field.onChange(Number(value))}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {LEVELS.map((level) => (
                <SelectItem key={level} value={String(level)}>
                  Level {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
