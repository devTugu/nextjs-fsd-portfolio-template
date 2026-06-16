import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('Experiences', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('shows experiences table', async ({ page }) => {
    await page.getByRole('link', { name: 'Experiences' }).click();
    await expect(page).toHaveURL(/\/dashboard\/experiences/);
    await expect(page.getByRole('columnheader', { name: 'Company' })).toBeVisible({
      timeout: 15_000,
    });
  });
});
