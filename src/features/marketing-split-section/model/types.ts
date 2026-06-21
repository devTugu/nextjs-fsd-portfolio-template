import type { ReactNode } from 'react';
import type { LayoutBleed } from '@/shared/lib/marketing/grid-layout';

export type SplitMediaPosition = 'left' | 'right';
export type SplitColumnSpan = 1 | 2;

export interface MarketingSplitSectionProps {
  media?: ReactNode;
  mediaPosition?: SplitMediaPosition;
  mediaColumns?: SplitColumnSpan;
  contentColumns?: SplitColumnSpan;
  mediaBleed?: LayoutBleed;
  children: ReactNode;
  className?: string;
}
