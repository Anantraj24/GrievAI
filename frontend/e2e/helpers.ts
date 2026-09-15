import { expect, type APIRequestContext, type Page } from '@playwright/test';

export const API_BASE = 'http://127.0.0.1:8000/api/v1';
export const APP_BASE = 'http://127.0.0.1:5173';

export interface HostUser {
  email: string;
  password: string;
  role: 'student' | 'authority' | 'admin';
}

export const DEMO_STUDENT: HostUser = { email: 'student@example.com', password: 'password123', role: 'student' };
export const DEMO_AUTHORITY: HostUser = { email: 'ramesh.sharma@institution.edu', password: 'password123', role: 'authority' };
export const DEMO_ADMIN: HostUser = { email: 'admin@example.com', password: 'password123', role: 'admin' };

export function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export async function apiLogin(request: APIRequestContext, user: HostUser): Promise<string> {
  const res = await request.post(`${API_BASE}/auth/login`, {
    data: { email: user.email, password: user.password },
  });
  if (!res.ok()) {
    throw new Error(`Login failed for ${user.email}: ${res.status()} ${await res.text()}`);
  }
  const body = (await res.json()) as { access_token: string };
  return body.access_token;
}

export async function createGrievance(
  request: APIRequestContext,
  token: string,
  data?: Partial<{
    title: string;
    description: string;
    location: string;
    category_id: string;
    subcategory_id: string;
    is_anonymous: boolean;
  }>,
): Promise<{ id: string; code: string }> {
  const payload = {
    title: data?.title ?? 'QA Flush Valve Broken in Block C Washroom',
    description:
      data?.description ??
      'The flush valve in the third floor washroom of Block C has been broken for three days. Water keeps leaking onto the floor and creating a slip hazard for students.',
    location: data?.location ?? 'Academic Block C, Floor 3',
    category_id: data?.category_id,
    subcategory_id: data?.subcategory_id,
    is_anonymous: data?.is_anonymous ?? false,
  };
  const res = await request.post(`${API_BASE}/grievances`, {
    headers: authHeaders(token),
    data: payload,
  });
  if (!res.ok()) {
    throw new Error(`createGrievance failed: ${res.status()} ${JSON.stringify(payload)} -> ${await res.text()}`);
  }
  const body = (await res.json()) as { id: string; grievance_code?: string };
  return { id: body.id, code: body.grievance_code ?? body.id };
}

export function uniqueEmail(prefix: string): string {
  const stamp = Date.now().toString(36);
  return `${prefix}_${stamp}@qa.institution.edu`;
}

export async function uiLogin(page: Page, role: HostUser['role']) {
  await page.goto('/login');
  // The header nav also exposes role-labelled buttons; the quick-fill login
  // buttons are rendered later in the DOM, so target the last match.
  await page.getByRole('button', { name: role }).last().click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
  return page;
}

export function attachErrorCapture(page: Page): { errors: string[]; pageerrors: string[] } {
  const errors: string[] = [];
  const pageerrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().startsWith('Failed to load resource')) {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => pageerrors.push(err.message));
  return { errors, pageerrors };
}