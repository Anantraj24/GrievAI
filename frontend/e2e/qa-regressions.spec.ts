import { test, expect } from '@playwright/test';
import { API_BASE, apiLogin, authHeaders, DEMO_STUDENT } from './helpers';

test.describe('QA regressions', () => {
  test('concurrent grievance submissions do not fail under load', async ({ request }) => {
    // Regression: the SQLite engine (no WAL / busy timeout) raised
    // "database is locked" / 500 when multiple writers committed at once.
    const token = await apiLogin(request, DEMO_STUDENT);
    const submits = Array.from({ length: 12 }, (_, i) =>
      request.post(`${API_BASE}/grievances`, {
        headers: authHeaders(token),
        data: {
          title: `QA concurrency ${i}`,
          description: `QA concurrency regression payload number ${i} for washroom leak.`,
          location: 'Academic Block A',
        },
      }),
    );
    const results = await Promise.all(submits);
    const failed = results.filter((r) => r.status() !== 201);
    expect(failed, `some concurrent creates failed: ${failed.map((r) => `${r.status()}: ${r.url()}`).join(', ')}`).toEqual([]);
  });
});