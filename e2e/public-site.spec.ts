import { test, expect } from '@playwright/test';

const headerNav = (page: import('@playwright/test').Page) =>
  page.locator('header');

const footer = (page: import('@playwright/test').Page) =>
  page.locator('footer');

test.describe('Public site', () => {
  test('home page loads with hero and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      headerNav(page).getByRole('link', { name: 'Brands', exact: true }).first(),
    ).toBeVisible();
    await expect(
      headerNav(page).getByRole('link', { name: 'Contact', exact: true }).first(),
    ).toBeVisible();
  });

  test('header shows brand site name link to home', async ({ page }) => {
    await page.goto('/');
    const homeBrandLink = page.locator('header a[href="/"]').first();
    await expect(homeBrandLink).toBeVisible();
    await expect(homeBrandLink).not.toBeEmpty();
  });

  test('brands page loads', async ({ page }) => {
    await page.goto('/brands');
    await expect(page.getByRole('heading', { level: 2, name: 'Brands' })).toBeVisible();
  });

  test('news page loads', async ({ page }) => {
    await page.goto('/news');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('legacy /blog redirects to /news', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveURL(/\/news/);
  });

  test('footer shows link columns', async ({ page }) => {
    await page.goto('/');
    await expect(footer(page).getByRole('heading', { name: 'Company' })).toBeVisible();
    await expect(footer(page).getByRole('heading', { name: 'Brands' })).toBeVisible();
  });

  test('mobile menu opens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(
      page.locator('header .border-t').getByRole('link', { name: 'Brands', exact: true }),
    ).toBeVisible();
  });

  test('home shows multi-brand sections when CMS is seeded', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#brands')).toBeVisible();
  });

  test('header is transparent at top and solid after scroll on home', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toHaveClass(/bg-transparent/);
    await page.evaluate(() => window.scrollTo(0, 120));
    await expect(header).toHaveClass(/bg-background/);
  });
});
