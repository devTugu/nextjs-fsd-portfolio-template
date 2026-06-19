import { describe, expect, it } from 'vitest';
import {
  resolveNavigationLabel,
  withHeaderNavFallback,
  FALLBACK_HEADER_NAV,
} from '@/entities/navigation';

describe('navigation-utils', () => {
  it('resolves locale label with en fallback', () => {
    expect(resolveNavigationLabel({ en: 'Pricing', mn: 'Үнэ' }, 'mn')).toBe('Үнэ');
    expect(resolveNavigationLabel({ en: 'Pricing', mn: '' }, 'mn')).toBe('Pricing');
  });

  it('returns fallback header when tree is empty', () => {
    expect(withHeaderNavFallback([])).toEqual(FALLBACK_HEADER_NAV);
    expect(withHeaderNavFallback(null)).toEqual(FALLBACK_HEADER_NAV);
  });
});
