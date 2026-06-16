import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('lists projects table', async ({ page }) => {
    await page.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/dashboard\/projects/);
    await expect(page.getByRole('columnheader', { name: 'Title' })).toBeVisible({
      timeout: 15_000,
    });
  });
});
