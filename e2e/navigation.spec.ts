import { test, expect } from '@playwright/test';

const headerNav = (page: import('@playwright/test').Page) =>
  page.locator('header');

const footer = (page: import('@playwright/test').Page) =>
  page.locator('footer');

test.describe('Navigation CMS (public)', () => {
  test('header shows About mega menu from CMS', async ({ page }) => {
    await page.goto('/');
    await expect(headerNav(page).getByRole('button', { name: 'About' })).toBeVisible();
    await expect(
      headerNav(page).getByRole('link', { name: 'Brands', exact: true }).first(),
    ).toBeVisible();
  });

  test('about mega panel shows company links', async ({ page }) => {
    await page.goto('/');
    await headerNav(page).getByRole('button', { name: 'About' }).click();
    await expect(page.getByRole('link', { name: /About us/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'History' }).first()).toBeVisible();
  });

  test('footer columns render from CMS tree', async ({ page }) => {
    await page.goto('/');
    await expect(footer(page).getByRole('heading', { name: 'Company' })).toBeVisible();
    await expect(footer(page).getByRole('heading', { name: 'Brands' })).toBeVisible();
  });
});
