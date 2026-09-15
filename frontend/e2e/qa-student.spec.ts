import { test, expect } from '@playwright/test';
import { apiLogin, createGrievance, uiLogin, attachErrorCapture, DEMO_STUDENT } from './helpers';

const DESCRIPTION =
  'QA e2e: The server room AC unit on the fourth floor is leaking condensation onto the cable trays. Students have slipped twice near Lab 401 exit.';

test.describe('Student flows', () => {
  test('submits a grievance end-to-end through the UI and tracks it', async ({ page, request }) => {
    const capture = attachErrorCapture(page);
    await uiLogin(page, DEMO_STUDENT.role);
    await page.goto('/student/submit');

    await page.getByPlaceholder('e.g. AC leaking water in Lab 402 onto computer desks').fill(DESCRIPTION.slice(0, 60));
    await page.getByPlaceholder('Describe what happened in detail, including time of incident, equipment or courses affected, and any safety hazards...').fill(DESCRIPTION);
    await page.getByPlaceholder('e.g. Academic Block 4, Lab 402').fill('Academic Block 4, Server Room');

    await page.getByRole('button', { name: 'Submit Grievance Docket' }).click();

    await expect(page).toHaveURL(/\/student\/success/, { timeout: 15000 });
    await expect(page.getByText('Submission Confirmed')).toBeVisible();
    const caseId = await page.getByText(/GRV-|TRK-/).first().textContent();
    expect(caseId).toBeTruthy();

    await page.getByRole('link', { name: /Track Case Live/ }).click();
    await expect(page).toHaveURL(/\/student\/grievance\/.+/, { timeout: 10000 });
    await expect(page.getByText(/Live Status Timeline|Complaint Overview|Status/i).first()).toBeVisible({ timeout: 10000 });

    expect(capture.pageerrors, `pageerrors: ${capture.pageerrors.join(' | ')}`).toEqual([]);
  });

  test('disables the submit button until a description is provided', async ({ page }) => {
    await uiLogin(page, DEMO_STUDENT.role);
    await page.goto('/student/submit');
    const submit = page.getByRole('button', { name: /Submit Grievance Docket/ });
    await expect(submit).toBeDisabled();
    await page.getByPlaceholder('Describe what happened in detail, including time of incident, equipment or courses affected, and any safety hazards...').fill('Broken chair in exam hall blocks.');
    await expect(submit).toBeEnabled();
  });

  test('shows a newly submitted grievance in My Grievances list', async ({ page, request }) => {
    const token = await apiLogin(request, DEMO_STUDENT);
    const { id } = await createGrievance(request, token, {
      title: 'QA MyGrievances plumbing leak visible',
    });

    await uiLogin(page, DEMO_STUDENT.role);
    await page.goto('/student/grievances');
    const searchRow = page.locator('tr', { hasText: 'QA MyGrievances plumbing leak visible' });
    await expect(searchRow).toBeVisible({ timeout: 15000 });
    await searchRow.getByRole('link').first().click();
    await expect(page).toHaveURL(new RegExp(id));
  });

  test('rates a resolved grievance', async ({ page, request }) => {
    const token = await apiLogin(request, DEMO_STUDENT);
    const { id } = await createGrievance(request, token, {
      title: 'QA resolved for rating',
    });

    const authToken = await apiLogin(request, { email: 'ramesh.sharma@institution.edu', password: 'password123', role: 'authority' });
    const resolveRes = await request.post(`http://127.0.0.1:8000/api/v1/grievances/${id}/status`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { status: 'RESOLVED', reason: 'QA rate flow resolution' },
    });
    expect(resolveRes.ok()).toBeTruthy();

    await uiLogin(page, DEMO_STUDENT.role);
    await page.goto('/student/grievances'); // populate cache
    await page.goto(`/student/rate/${id}`);
    await expect(page.getByRole('button', { name: 'Submit Official Rating' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'star', exact: true }).nth(4).click();
    await page.getByPlaceholder('Share any specific notes about response speed, staff conduct, or resolution quality...').fill('Quick and professional.');
    await page.getByRole('button', { name: 'Submit Official Rating' }).click();
    await expect(page).toHaveURL(new RegExp(`student/grievance/${id}`), { timeout: 10000 });
  });

  test('student notifications page renders', async ({ page }) => {
    await uiLogin(page, DEMO_STUDENT.role);
    await page.goto('/student/notifications');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 10000 });
  });

  test('student profile page renders with email', async ({ page }) => {
    await uiLogin(page, DEMO_STUDENT.role);
    await page.goto('/student/profile');
    await expect(page.getByText(DEMO_STUDENT.email)).toBeVisible({ timeout: 10000 });
  });
});