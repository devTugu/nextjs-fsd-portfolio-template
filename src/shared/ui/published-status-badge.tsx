import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface PublishedStatusBadgeProps {
  isPublished: boolean;
  className?: string;
}

export function PublishedStatusBadge({
  isPublished,
  className,
}: PublishedStatusBadgeProps) {
  return (
    <Badge
      variant={isPublished ? 'default' : 'secondary'}
      className={cn(className)}
    >
      {isPublished ? 'Published' : 'Draft'}
    </Badge>
  );
}
