import { cn } from '@/shared/lib/utils';

interface MarketingGridProps {
  className?: string;
  children: React.ReactNode;
  showDividers?: boolean;
}

export function MarketingGrid({
  className,
  children,
  showDividers = true,
}: MarketingGridProps) {
  return (
    <div
      className={cn(
        'relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        showDividers &&
          'md:divide-border/60 md:divide-x lg:[&>*:not(:last-child)]:border-r lg:[&>*:not(:last-child)]:border-border/60',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface MarketingGridCellProps {
  className?: string;
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4;
}

export function MarketingGridCell({
  className,
  children,
  span = 1,
}: MarketingGridCellProps) {
  const spanClass =
    span === 2
      ? 'lg:col-span-2'
      : span === 3
        ? 'lg:col-span-3'
        : span === 4
          ? 'lg:col-span-4'
          : '';

  return (
    <div className={cn('relative px-4 py-8 md:px-6 lg:px-4', spanClass, className)}>
      {children}
    </div>
  );
}
