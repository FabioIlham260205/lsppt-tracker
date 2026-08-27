import { test, expect } from '@playwright/test';

const API = 'http://localhost:3000/api';
const SUBMIT_URL = '/submit';
const TIMEOUT_WAIT = 8000;

// ── Setup: cleanup test data ──────────────────────────────
test.beforeAll(async ({ request }) => {
  const res = await request.get(`${API}/history`);
  const { data = [] } = await res.json();
  for (const row of data) {
    if (row.clickup_task_id === '86d412pzq') {
      await request.delete(`${API}/tasks/${row.task_id}`);
    }
  }
});

test.describe('Submit Page - Form & Employee CRUD', () => {

  // ── TC-SUB-001 ──────────────────────────────────────────
  test('TC-SUB-001: Page load & initial render', async ({ page }) => {
    await page.goto(SUBMIT_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toHaveText('LSPPT Tracker');
    await expect(page.locator('text=Laporan Status Progress Pekerjaan Karyawan')).toBeVisible();
    await expect(page.locator('a', { hasText: 'Lihat History' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Lihat History' })).toHaveAttribute('href', '/history');

    await expect(page.locator('label', { hasText: 'Employee' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'Tanggal' })).toBeVisible();
    await expect(page.locator('button', { hasText: /Kelola Karyawan/ })).toBeVisible();

    await expect(page.locator('label', { hasText: 'Task Title' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'ClickUp URL' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'ClickUp Task ID' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'Phase' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'Status' })).toBeVisible();
    await expect(page.locator('button', { hasText: '+ Add Task' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Save LSPPT' })).toBeVisible();

    await expect(page.locator('text=Daftar Task')).toBeVisible();
    await expect(page.getByText('Belum ada task', { exact: true })).toBeVisible();
  });

  // ── TC-SUB-002 ──────────────────────────────────────────
  test('TC-SUB-002: Form submission — add task & save', async ({ page }) => {
    await page.goto(SUBMIT_URL);
    await page.waitForLoadState('networkidle');

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

  // ── TC-SUB-003 ──────────────────────────────────────────
  test('TC-SUB-003: Add karyawan via modal', async ({ page }) => {
    await page.goto(SUBMIT_URL);
    await page.waitForLoadState('networkidle');

    const empsRes = await page.evaluate(async () => {
      const res = await fetch('http://localhost:3000/api/employees');
      return res.json();
    });
    const argi = empsRes.data?.find((e) => e.name === 'Argi');
    if (argi) {
      await page.evaluate((id) =>
        fetch(`http://localhost:3000/api/employees/${id}`, { method: 'DELETE' })
      , argi.id);
    }

    await page.getByRole('button', { name: /Kelola Karyawan/ }).click();
    await page.getByRole('button', { name: '+ Tambah Karyawan' }).click();
    await page.getByLabel('Nama Karyawan').fill('Argi');
    await page.getByRole('button', { name: 'Simpan' }).click();

    const toast = page.getByRole('alert');
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(toast).toContainText('Berhasil');
  });

  // ── TC-SUB-004 ──────────────────────────────────────────
  test('TC-SUB-004: Delete karyawan via confirm modal', async ({ page }) => {
    await page.goto(SUBMIT_URL);
    await page.waitForLoadState('networkidle');

    const empsRes = await page.evaluate(async () => {
      const res = await fetch('http://localhost:3000/api/employees');
      return res.json();
    });
    const argi = empsRes.data?.find((e) => e.name === 'Argi');
    if (!argi) {
      await page.evaluate(async () => {
        await fetch('http://localhost:3000/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Argi' }),
        });
      });
    }

    await page.getByRole('button', { name: /Kelola Karyawan/ }).click();

    const argiRow = page.getByRole('row', { name: /Argi/ });
    await expect(argiRow).toBeVisible();
    await argiRow.getByRole('button', { name: 'Edit' }).click();

    await page.getByRole('button', { name: 'Hapus Karyawan' }).click();

    const confirmModal = page.locator('[role="dialog"]').filter({ hasText: 'Yakin ingin menghapus' });
    await expect(confirmModal).toBeVisible();
    await expect(confirmModal).toContainText('Argi');
    await confirmModal.getByRole('button', { name: 'Hapus' }).click();

    const toast = page.getByRole('alert');
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(toast).toContainText('Berhasil');

    await expect(page.getByRole('row', { name: /Argi/ })).toHaveCount(0);
  });
});
