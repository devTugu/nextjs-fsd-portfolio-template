import { test, expect } from '@playwright/test';

test.describe('Public contact', () => {
  test('contact page shows sales form', async ({ page }) => {
    await page.goto('/contact');
    await expect(
      page.getByRole('heading', { name: "Let's get you to the right place" }),
    ).toBeVisible();
    await expect(page.getByLabel('Work email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  });

  test('submits contact form', async ({ page }) => {
    await page.goto('/contact');
    const email = `test-${Date.now()}@example.com`;

    await page.getByLabel('Work email').fill(email);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Name').fill('Public Site Tester');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page
      .getByLabel('Message')
      .fill('This is a test message from Playwright E2E.');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText('Message sent successfully')).toBeVisible({
      timeout: 15_000,
    });
  });
});
