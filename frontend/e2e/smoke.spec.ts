import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Login smoke & accessibility', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'GrievAI Intelligence' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Register here/i })).toBeVisible();
  });

  test('login page has no serious/critical accessibility violations', async ({ page }) => {
    await page.goto('/login');
    const results = await new AxeBuilder({ page }).analyze();
    const issues = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
  });
});