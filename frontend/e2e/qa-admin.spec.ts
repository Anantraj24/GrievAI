import { test, expect } from '@playwright/test';
import { uiLogin, attachErrorCapture, DEMO_ADMIN } from './helpers';

const ADMIN_PAGES: Array<{ path: string; heading: string | RegExp }> = [
  { path: '/admin/dashboard', heading: 'Executive Command Center' },
  { path: '/admin/analytics', heading: 'Systemic Institutional Analytics' },
  { path: '/admin/insights', heading: 'Systemic Anomaly Detection' },
  { path: '/admin/issues', heading: 'Institutional Issue Clusters' },
  { path: '/admin/users', heading: 'User Access Management' },
  { path: '/admin/departments', heading: 'Institutional Departments' },
  { path: '/admin/categories', heading: 'Grievance Category Taxonomy' },
  { path: '/admin/sla', heading: 'SLA Policies & Escalation Matrix' },
  { path: '/admin/audit-logs', heading: 'Institutional Audit Trail' },
  { path: '/admin/settings', heading: 'System & AI Engine Configuration' },
];

test.describe('Admin portal renders', () => {
  for (const { path, heading } of ADMIN_PAGES) {
    test(`renders ${path} without page errors`, async ({ page }) => {
      const capture = attachErrorCapture(page);
      await uiLogin(page, DEMO_ADMIN.role);
      await page.goto(path);
      await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible({ timeout: 15000 });
      expect(capture.pageerrors, `pageerrors on ${path}: ${capture.pageerrors.join(' | ')}`).toEqual([]);
    });
  }

  test('admin dashboard shows live statistics', async ({ page }) => {
    await uiLogin(page, DEMO_ADMIN.role);
    await page.goto('/admin/dashboard');
    await expect(page.getByText(/Resolved Cases/).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Pending|Critical|Active/i).first()).toBeVisible();
  });

  test('admin users list shows seeded users', async ({ page }) => {
    await uiLogin(page, DEMO_ADMIN.role);
    await page.goto('/admin/users');
    const row = page.locator('tr', { hasText: 'student@example.com' });
    await expect(row).toBeVisible({ timeout: 15000 });
  });
});