import { test, expect, request } from '@playwright/test';
import { API_BASE, apiLogin, createGrievance, authHeaders, uniqueEmail, DEMO_STUDENT, DEMO_ADMIN, DEMO_AUTHORITY } from './helpers';

test.describe('API contract, RBAC and security', () => {
  let studentToken: string;
  let authorityToken: string;
  let adminToken: string;
  let ownerId: string;

  test.beforeAll(async ({ request }) => {
    studentToken = await apiLogin(request, DEMO_STUDENT);
    authorityToken = await apiLogin(request, DEMO_AUTHORITY);
    adminToken = await apiLogin(request, DEMO_ADMIN);
    ownerId = (await createGrievance(request, studentToken, { title: 'QA api owner grievance' })).id;
  });

  test('health endpoint is unauthenticated and healthy', async ({ request }) => {
    const res = await request.get(`${API_BASE}/health`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe('ok');
  });

  test('protected endpoints reject missing/invalid tokens with 401', async ({ request }) => {
    const noAuth = await request.get(`${API_BASE}/grievances`);
    expect(noAuth.status()).toBe(401);

    const badAuth = await request.get(`${API_BASE}/grievances`, {
      headers: { Authorization: 'Bearer fake.invalid.token' },
    });
    expect(badAuth.status()).toBe(401);
  });

  test('login with wrong password is rejected', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/login`, {
      data: { email: DEMO_STUDENT.email, password: 'definitely-wrong' },
    });
    expect(res.ok()).toBeFalsy();
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('register rejects weak password and duplicate email', async ({ request }) => {
    const weak = await request.post(`${API_BASE}/auth/register`, {
      data: { email: uniqueEmail('pw'), password: 'short', full_name: 'QA User' },
    });
    expect(weak.status()).toBe(422);

    const dup = await request.post(`${API_BASE}/auth/register`, {
      data: { email: DEMO_STUDENT.email, password: 'password123', full_name: 'Duplicate' },
    });
    expect(dup.status()).toBe(400);
  });

  test('create grievance rejects empty/invalid payloads with 422', async ({ request }) => {
    const empty = await request.post(`${API_BASE}/grievances`, {
      headers: authHeaders(studentToken),
      data: { description: '', location: '' },
    });
    expect(empty.status()).toBe(422);
  });

  test('RBAC: student is forbidden from admin endpoints', async ({ request }) => {
    for (const path of ['/admin/users', '/admin/departments', '/admin/categories', '/admin/sla-rules']) {
      const res = await request.get(`${API_BASE}${path}`, { headers: authHeaders(studentToken) });
      expect(res.status(), `student GET ${path} should be 403, got ${res.status()}`).toBe(403);
    }
  });

  test('RBAC: authority is forbidden from admin endpoints', async ({ request }) => {
    const res = await request.get(`${API_BASE}/admin/users`, { headers: authHeaders(authorityToken) });
    expect(res.status()).toBe(403);
  });

  test('RBAC: admin can manage departments, categories, users, SLA', async ({ request }) => {
    const dept = await request.post(`${API_BASE}/admin/departments`, {
      headers: authHeaders(adminToken),
      data: { name: `QA Dept ${Date.now().toString(36)}` },
    });
    expect(dept.status(), `create dept: ${await dept.text()}`).toBe(201);

    const cat = await request.post(`${API_BASE}/admin/categories`, {
      headers: authHeaders(adminToken),
      data: { name: `QA Category ${Date.now().toString(36)}` },
    });
    expect(cat.status(), `create category: ${await cat.text()}`).toBe(201);

    const sla = await request.put(`${API_BASE}/admin/sla-rules/HIGH`, {
      headers: authHeaders(adminToken),
      data: { hours: 24 },
    });
    expect(sla.status(), `sla update: ${await sla.text()}`).toBe(200);

    const users = await request.get(`${API_BASE}/admin/users`, { headers: authHeaders(adminToken) });
    expect(users.ok()).toBeTruthy();
  });

  test('IDOR: another student cannot read a foreign grievance', async ({ request }) => {
    const otherEmail = uniqueEmail('idor');
    const reg = await request.post(`${API_BASE}/auth/register`, {
      data: { email: otherEmail, password: 'password123', full_name: 'IDOR Tester' },
    });
    expect(reg.ok()).toBeTruthy();
    const other = await apiLogin(request, { email: otherEmail, password: 'password123', role: 'student' });

    const read = await request.get(`${API_BASE}/grievances/${ownerId}`, { headers: authHeaders(other) });
    expect([403, 404]).toContain(read.status());

    // SUBMITTED -> CLOSED is a valid student-owned transition in the state
    // machine, so a successful call implies an ownership-bypass (IDOR).
    const statusChange = await request.post(`${API_BASE}/grievances/${ownerId}/status`, {
      headers: authHeaders(other),
      data: { status: 'CLOSED', reason: 'IDOR attempt' },
    });
    expect([400, 403]).toContain(statusChange.status());
  });

  test('status updates with an invalid status value are rejected with 422', async ({ request }) => {
    const res = await request.post(`${API_BASE}/grievances/${ownerId}/status`, {
      headers: authHeaders(authorityToken),
      data: { status: 'NOT_A_REAL_STATUS', reason: 'test' },
    });
    expect(res.status()).toBe(422);
  });

  test('authority can create grievances (documented behavior, see BUG_REPORT observation)', async ({ request }) => {
    const res = await request.post(`${API_BASE}/grievances`, {
      headers: authHeaders(authorityToken),
      data: { title: 'Attempted authority submission', description: 'x'.repeat(40), location: 'Campus' },
    });
    // POST /grievances is not role-restricted to students. Flagged as a low-severity
    // observation: authorities/admins can file grievances that store their user id
    // as the grievance student_id. Test documents current behavior.
    expect(res.status()).toBe(201);
  });

  test('evidence upload rejects dangerous content types and files', async ({ request }) => {
    const badMime = await request.post(`${API_BASE}/grievances/${ownerId}/evidence`, {
      headers: authHeaders(studentToken),
      multipart: {
        file: { name: 'malware.jpg.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('MZ........') },
      },
    });
    expect([400, 415]).toContain(badMime.status());

    const exeName = await request.post(`${API_BASE}/grievances/${ownerId}/evidence`, {
      headers: authHeaders(studentToken),
      multipart: {
        file: { name: 'run.bat', mimeType: 'image/jpeg', buffer: Buffer.from('X') },
      },
    });
    expect([400, 415]).toContain(exeName.status());

    const success = await request.post(`${API_BASE}/grievances/${ownerId}/evidence`, {
      headers: authHeaders(studentToken),
      multipart: {
        file: { name: 'proof.png', mimeType: 'image/png', buffer: Buffer.from('PNGDATA') },
      },
    });
    expect(success.status()).toBe(201);
  });

  test('student cannot request AI response drafts (authority only)', async ({ request }) => {
    const res = await request.post(`${API_BASE}/grievances/${ownerId}/response-draft`, {
      headers: authHeaders(studentToken),
      data: {},
    });
    expect([403, 405, 422]).toContain(res.status());
  });

  test('analytics dashboard is authority/admin only', async ({ request }) => {
    const denied = await request.get(`${API_BASE}/analytics/dashboard`, { headers: authHeaders(studentToken) });
    expect(denied.status()).toBe(403);

    const allowed = await request.get(`${API_BASE}/analytics/dashboard`, { headers: authHeaders(authorityToken) });
    expect(allowed.ok()).toBeTruthy();
  });

  test('submit -> resolve lifecycle works via API as an authority', async ({ request }) => {
    const created = await request.post(`${API_BASE}/grievances`, {
      headers: authHeaders(studentToken),
      data: { title: 'QA lifecycle case', description: 'QA lifecycle: repeated power cut in hostel room 221.', location: 'Hostel Block 2' },
    });
    expect(created.status()).toBe(201);
    const gid = (await created.json()).id;

    const started = await request.post(`${API_BASE}/grievances/${gid}/status`, {
      headers: authHeaders(authorityToken),
      data: { status: 'IN_PROGRESS', reason: 'QA lifecycle: investigating' },
    });
    expect(started.ok()).toBeTruthy();

    const resolved = await request.post(`${API_BASE}/grievances/${gid}/status`, {
      headers: authHeaders(authorityToken),
      data: { status: 'RESOLVED', reason: 'QA lifecycle: power restored via stabilizer replacement' },
    });
    expect(resolved.ok()).toBeTruthy();

    const detail = await request.get(`${API_BASE}/grievances/${gid}`, { headers: authHeaders(studentToken) });
    expect(detail.ok()).toBeTruthy();
    const body = await detail.json();
    expect(body.status).toBe('RESOLVED');
  });
});