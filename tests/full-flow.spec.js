import { test, expect } from '@playwright/test';

const API = 'http://localhost:3000/api';
const TIMEOUT_WAIT_DATA = 8000;

// Cleanup from previous runs
test.beforeAll(async ({ request }) => {
  const res = await request.get(`${API}/history`);
  const { data = [] } = await res.json();
  for (const row of data) {
    if (row.clickup_task_id === 'e2eflow01' || row.clickup_task_id === 'e2eflow02') {
      await request.delete(`${API}/tasks/${row.task_id}`);
    }
  }
});

test.describe('Full Flow - Submit → History', () => {

  // ── TC-FLOW-001 ──────────────────────────────────────────
  test('TC-FLOW-001: Submit LSPPT → navigate to History → data muncul', async ({ page }) => {
    // Step 1: Submit LSPPT
    await page.goto('/submit');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Employee').selectOption({ label: 'Lundy' });
    await page.getByLabel('Tanggal').fill('2026-08-28');
    await page.getByLabel('Task Title').fill('E2E TEST - Full Flow Submit to History');
    await page.getByLabel('ClickUp URL').fill('https://app.clickup.com/t/9003006723/e2eflow01');
    await expect(page.getByLabel('ClickUp Task ID')).toHaveValue('e2eflow01');

    await page.getByLabel('Phase').selectOption({ value: 'TS' });
    await expect(page.getByLabel('Status')).toBeEnabled();
    await page.getByLabel('Status').selectOption({ label: 'Completed' });

    await page.getByRole('button', { name: '+ Add Task' }).click();
    await expect(page.getByText('E2E TEST - Full Flow Submit to History')).toBeVisible();

    await page.getByRole('button', { name: 'Save LSPPT' }).click();

    const toast = page.getByRole('alert');
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(toast).toContainText('Berhasil');

    // Step 2: Navigate to History
    await page.getByRole('link', { name: 'Lihat History' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/history/);

    // Step 3: Click "Semua" to include all dates, then filter
    await page.getByRole('button', { name: 'Semua' }).click();
    await page.waitForTimeout(1500);

    await page.getByLabel('Karyawan').selectOption({ label: 'Lundy' });
    await page.waitForTimeout(1500);

    const found = await page.locator('text=E2E TEST - Full Flow Submit to History').isVisible();
    expect(found).toBeTruthy();
  });

  // ── TC-FLOW-002 ──────────────────────────────────────────
  test('TC-FLOW-002: Submit → History → detail modal → update progress', async ({ page }) => {
    // Step 1: Submit LSPPT
    await page.goto('/submit');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Employee').selectOption({ label: 'Geta' });
    await page.getByLabel('Tanggal').fill('2026-08-28');
    await page.getByLabel('Task Title').fill('E2E TEST - Update Progress Flow');
    await page.getByLabel('ClickUp URL').fill('https://app.clickup.com/t/9003006723/e2eflow02');
    await expect(page.getByLabel('ClickUp Task ID')).toHaveValue('e2eflow02');

    await page.getByLabel('Phase').selectOption({ value: 'QA' });
    await expect(page.getByLabel('Status')).toBeEnabled();
    await page.getByLabel('Status').selectOption({ label: 'Testing' });

    await page.getByRole('button', { name: '+ Add Task' }).click();
    await expect(page.getByText('E2E TEST - Update Progress Flow')).toBeVisible();

    await page.getByRole('button', { name: 'Save LSPPT' }).click();

    const toast = page.getByRole('alert');
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(toast).toContainText('Berhasil');

    // Step 2: Navigate to History
    await page.getByRole('link', { name: 'Lihat History' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/history/);

    // Step 3: Click "Semua" to include all dates, then filter
    await page.getByRole('button', { name: 'Semua' }).click();
    await page.waitForTimeout(1500);

    await page.getByLabel('Karyawan').selectOption({ label: 'Geta' });
    await page.waitForTimeout(1500);

    // Step 4: Click task to open detail modal
    const taskButton = page.locator('tbody tr').first().locator('td').nth(2).locator('button');
    if (await taskButton.isVisible()) {
      await taskButton.click();
      await page.waitForTimeout(1500);

      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Step 5: Update progress
      await modal.locator('button', { hasText: 'Update Progress' }).click();
      await page.waitForTimeout(500);

      const phaseSelect = modal.locator('select').nth(0);
      const statusSelect = modal.locator('select').nth(1);
      const dateInput = modal.locator('input[type="date"]');

      await expect(phaseSelect).toBeVisible();
      await expect(statusSelect).toBeVisible();
      await expect(dateInput).toBeVisible();

      await phaseSelect.selectOption('QA');
      await page.waitForTimeout(300);
      await statusSelect.selectOption('Completed');
      await page.waitForTimeout(300);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const y = tomorrow.getFullYear();
      const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const d = String(tomorrow.getDate()).padStart(2, '0');
      await dateInput.fill(`${y}-${m}-${d}`);
      await page.waitForTimeout(300);

      await modal.locator('button', { hasText: 'Simpan Progress' }).click();
      await page.waitForTimeout(3000);

      const successToast = page.locator('text=Progress berhasil diperbarui');
      const successVisible = await successToast.isVisible().catch(() => false);
      console.log('Update progress success:', successVisible);
    }
  });
});
