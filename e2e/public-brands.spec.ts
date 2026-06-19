import { test, expect } from '@playwright/test';

test.describe('Public brands', () => {
  test('brands list shows published brands', async ({ page }) => {
    await page.goto('/brands');
    await expect(page.getByRole('heading', { level: 2, name: 'Brands' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Kitchen|Hall|Restaurant|Event/i }).first()).toBeVisible();
  });

  test('brand detail page loads for seeded slug', async ({ page }) => {
    await page.goto('/brands/nomad-kitchen');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('about us page loads mission content', async ({ page }) => {
    await page.goto('/about/us');
    await expect(page.getByRole('heading', { name: 'About us' })).toBeVisible();
  });
});
