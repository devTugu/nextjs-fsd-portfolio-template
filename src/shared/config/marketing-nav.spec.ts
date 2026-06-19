import { describe, expect, it } from 'vitest';
import { MARKETING_FOOTER_COLUMNS, MARKETING_MEGA_NAV } from '@/shared/config/marketing-nav';
import { PUBLIC_ROUTES } from '@/shared/config/routes';

describe('marketing-nav', () => {
  it('defines mega nav groups with links', () => {
    expect(MARKETING_MEGA_NAV.length).toBeGreaterThan(0);
    for (const group of MARKETING_MEGA_NAV) {
      expect(group.items.length).toBeGreaterThan(0);
      for (const item of group.items) {
        expect(item.href.startsWith('/')).toBe(true);
      }
    }
  });

  it('includes brands in footer columns', () => {
    const companyColumn = MARKETING_FOOTER_COLUMNS.find(
      (column) => column.titleKey === 'company',
    );
    expect(companyColumn?.links.some((link) => link.href === PUBLIC_ROUTES.BRANDS)).toBe(true);
  });
});
