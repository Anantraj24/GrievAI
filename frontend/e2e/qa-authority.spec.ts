import { test, expect } from '@playwright/test';
import { apiLogin, createGrievance, uiLogin, attachErrorCapture, DEMO_STUDENT, DEMO_AUTHORITY } from './helpers';

const DESCRIPTION =
  'QA authority: washroom flush valve in Block C has been leaking for three days and the floor stays wet, creating a slip hazard outside the physics lab.';

test.describe('Authority flows', () => {
  test('sees newly submitted grievance in the assigned queue and opens workspace', async ({ page, request }) => {
    const token = await apiLogin(request, DEMO_STUDENT);
    const { id } = await createGrievance(request, token, {
      title: 'QA queue flush valve leak',
    });

    await uiLogin(page, DEMO_AUTHORITY.role);
    await page.goto('/authority/queue');
    await page.getByPlaceholder('Search by case ID, student name, keyword...').fill('QA queue flush valve leak');
    const row = page.locator('tr', { hasText: 'QA queue flush valve leak' });
    await expect(row).toBeVisible({ timeout: 15000 });
    await row.getByRole('link', { name: /Open Case/ }).click();
    await expect(page).toHaveURL(new RegExp(`authority/workspace/${id}`), { timeout: 10000 });
    await expect(page.getByText('Authority Review Mode')).toBeVisible();
  });

  test('marks a case in progress', async ({ page, request }) => {
    const token = await apiLogin(request, DEMO_STUDENT);
    const { id } = await createGrievance(request, token, {
      title: 'QA mark in progress',
    });
    await uiLogin(page, DEMO_AUTHORITY.role);
    await page.goto(`/authority/workspace/${id}`);
    await page.getByRole('button', { name: 'Mark In Progress' }).click();
    await expect(page.getByText(/IN PROGRESS|status updated/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('resolves a case from the resolution workspace', async ({ page, request }) => {
    const capture = attachErrorCapture(page);
    const token = await apiLogin(request, DEMO_STUDENT);
    const { id } = await createGrievance(request, token, {
      title: 'QA resolve me',
    });
    await uiLogin(page, DEMO_AUTHORITY.role);
    await page.goto(`/authority/workspace/${id}/resolve`);
    await expect(page.getByRole('heading', { name: `Resolve Case #${id}` })).toBeVisible({ timeout: 10000 });
    await page
      .getByPlaceholder('Describe physical or administrative actions taken to solve the root problem...')
      .fill('Replaced the flush valve assembly and had the floor cleaned and sanitized by housekeeping.');
    await page
      .getByPlaceholder('Official letter explaining the completed solution to the student...')
      .fill('The washroom flush valve has been replaced and the area has been cleaned. We appreciate your patience.');
    await page.getByLabel('Dispatch Email Notice').check();
    await page.getByRole('button', { name: 'Authorize Case Resolution' }).click();
    await expect(page).toHaveURL(new RegExp(`authority/workspace/${id}$`), { timeout: 10000 });
    await expect(page.getByText(/RESOLVED/i).first()).toBeVisible({ timeout: 10000 });
    expect(capture.pageerrors, `pageerrors: ${capture.pageerrors.join(' | ')}`).toEqual([]);
  });

  test('escalates a case to a higher tier', async ({ page, request }) => {
    const token = await apiLogin(request, DEMO_STUDENT);
    const { id } = await createGrievance(request, token, {
      title: 'QA escalate me',
    });
    await uiLogin(page, DEMO_AUTHORITY.role);
    await page.goto(`/authority/workspace/${id}/escalate`);
    await expect(page.getByRole('heading', { name: `Escalate Case #${id}` })).toBeVisible({ timeout: 10000 });
    await page
      .getByPlaceholder('State the institutional impediment, safety risk, or policy exception necessitating higher authority intervention...')
      .fill('Recurring hazard persists across multiple floors; requires campus-wide maintenance program.');
    await page.getByRole('button', { name: 'Authorize Executive Escalation' }).click();
    await expect(page).toHaveURL(new RegExp(`authority/workspace/${id}$`), { timeout: 10000 });
    await expect(page.getByText(/ESCALATED/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('requests clarification from the student', async ({ page, request }) => {
    const token = await apiLogin(request, DEMO_STUDENT);
    const { id } = await createGrievance(request, token, {
      title: 'QA request info',
    });
    await uiLogin(page, DEMO_AUTHORITY.role);
    await page.goto(`/authority/request-info?id=${id}`);
    await expect(page.getByRole('heading', { name: 'Request Clarification from Student' })).toBeVisible({ timeout: 10000 });
    await page
      .getByPlaceholder('Specify the exact documentation or clarification required from student...')
      .fill('Please upload a dated photo of the washroom block and the floor area.');
    await page.getByRole('button', { name: 'Dispatch Request to Student' }).click();
    await expect(page).toHaveURL(new RegExp(`authority/workspace/${id}$`), { timeout: 10000 });
  });

  test('authority notifications page renders', async ({ page }) => {
    await uiLogin(page, DEMO_AUTHORITY.role);
    await page.goto('/authority/notifications');
    await expect(page.getByRole('heading', { name: 'Authority Alert Center' })).toBeVisible({ timeout: 10000 });
  });
});