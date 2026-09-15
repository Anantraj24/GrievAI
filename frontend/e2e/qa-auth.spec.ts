import { test, expect } from '@playwright/test';
import { uiLogin, uniqueEmail, DEMO_STUDENT, DEMO_ADMIN, DEMO_AUTHORITY } from './helpers';

test.describe('Auth flows', () => {
  test('logs in as student and lands on student dashboard', async ({ page }) => {
    await uiLogin(page, DEMO_STUDENT.role);
    await expect(page).toHaveURL(/\/student\/dashboard/);
  });

  test('rejects invalid credentials with an error toast', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('e.g. student@example.com').fill(DEMO_STUDENT.email);
    await page.getByPlaceholder('••••••••').fill('wrong-password');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.getByText(/Invalid|incorrect|error/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('logged-out users are redirected to login for protected pages', async ({ page }) => {
    await page.goto('/student/dashboard');
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('student cannot access admin portal (RBAC redirect)', async ({ page }) => {
    await uiLogin(page, DEMO_STUDENT.role);
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/unauthorized/);
  });

  test('admin can access admin portal', async ({ page }) => {
    await uiLogin(page, DEMO_ADMIN.role);
    await page.goto('/admin/dashboard');
    await expect(page).not.toHaveURL(/\/unauthorized/);
  });

  test('authority can access authority portal', async ({ page }) => {
    await uiLogin(page, DEMO_AUTHORITY.role);
    await page.goto('/authority/dashboard');
    await expect(page).not.toHaveURL(/\/unauthorized/);
  });

  test('registers a new student account', async ({ page }) => {
    const email = uniqueEmail('qa_reg');
    await page.goto('/register');
    await page.getByPlaceholder('e.g. ANANT RAJ').fill('QA Registered Student');
    await page.getByPlaceholder('student@example.com').fill(email);
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Create Account & Sign In' }).click();
    await expect(page).toHaveURL(/\/student\/dashboard/, { timeout: 15000 });
  });

  test('logs out and returns to login', async ({ page }) => {
    await uiLogin(page, DEMO_STUDENT.role);
    await page.getByRole('button', { name: /logout|sign out/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});