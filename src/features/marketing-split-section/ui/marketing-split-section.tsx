import type { MarketingColumnIndex } from '@/shared/lib/marketing/grid-layout';
import {
  MarketingLayoutCell,
  MarketingLayoutGrid,
} from '@/shared/ui/marketing';
import { cn } from '@/shared/lib/utils';
import type { MarketingSplitSectionProps } from '../model/types';

function resolveMediaColStart(
  isMediaLeft: boolean,
  mediaColumns: 1 | 2,
): MarketingColumnIndex {
  if (isMediaLeft) {
    return 1;
  }

  return (5 - mediaColumns) as MarketingColumnIndex;
}

function resolveContentColStart(
  isMediaLeft: boolean,
  mediaColumns: 1 | 2,
): MarketingColumnIndex {
  if (isMediaLeft) {
    return (mediaColumns + 1) as MarketingColumnIndex;
  }

  return 1;
}

export function MarketingSplitSection({
  media,
  mediaPosition = 'left',
  mediaColumns = 2,
  contentColumns = 2,
  mediaBleed,
  children,
  className,
}: MarketingSplitSectionProps) {
  const hasMedia = media != null;
  const isMediaLeft = mediaPosition === 'left';

  const resolvedMediaBleed =
    mediaBleed ?? (isMediaLeft ? 'right' : 'left');

  if (!hasMedia) {
    return (
      <MarketingLayoutGrid className={className}>
        <MarketingLayoutCell colStart={1} colSpan={4}>
          {children}
        </MarketingLayoutCell>
      </MarketingLayoutGrid>
    );
  }

  return (
    <MarketingLayoutGrid className={cn('items-center gap-y-10 lg:gap-y-0', className)}>
      <MarketingLayoutCell
        colStart={resolveMediaColStart(isMediaLeft, mediaColumns)}
        colSpan={mediaColumns}
        bleed={resolvedMediaBleed}
        layer="media"
        mobileOrder={isMediaLeft ? 1 : 2}
      >
        {media}
      </MarketingLayoutCell>
      <MarketingLayoutCell
        colStart={resolveContentColStart(isMediaLeft, mediaColumns)}
        colSpan={contentColumns}
        layer="content"
        mobileOrder={isMediaLeft ? 2 : 1}
      >
        {children}
      </MarketingLayoutCell>
    </MarketingLayoutGrid>
  );
}
