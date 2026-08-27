import { test, expect } from '@playwright/test';

const API = 'http://localhost:3000/api';

test.describe('SubmitPage - Form Fill & Save', () => {
  test.beforeAll(async ({ request }) => {
    const res = await request.get(`${API}/history`);
    const { data = [] } = await res.json();
    for (const row of data) {
      if (row.clickup_task_id === '86d412pzq') {
        await request.delete(`${API}/tasks/${row.task_id}`);
      }
    }
  });

  test('Test form submission', async ({ page }) => {
    await page.goto('/submit', { waitUntil: 'networkidle' });

    await page.getByLabel('Employee').selectOption({ label: 'Lundy' });
    await page.getByLabel('Tanggal').fill('2026-09-30');
    await page.getByLabel('Task Title').fill('PEER PRD - ACME - Report template (docx) for Excavation');
    await page.getByLabel('ClickUp URL').fill('https://app.clickup.com/t/9003006723/86d412pzq');
    await expect(page.getByLabel('ClickUp Task ID')).toHaveValue('86d412pzq');

    await page.getByLabel('Phase').selectOption({ value: 'TS' });
    await expect(page.getByLabel('Status')).toBeEnabled();
    await page.getByLabel('Status').selectOption({ label: 'Completed' });

    await page.getByRole('button', { name: '+ Add Task' }).click();

    await expect(page.getByText('PEER PRD - ACME - Report template (docx) for Excavation')).toBeVisible();
    await expect(page.getByText('86d412pzq', { exact: true })).toBeVisible();

    const saveButton = page.getByRole('button', { name: 'Save LSPPT' });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    const toast = page.getByRole('alert');
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(toast).toContainText('Berhasil');
  });
});
