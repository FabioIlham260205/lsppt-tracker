const { test, expect } = require('@playwright/test');

const HISTORY_URL = '/history';
const TIMEOUT_WAIT_DATA = 8000;

test.describe('History Page - Table, Export, Modal, Navigation', () => {

  // ── TC-HIST-008 ──────────────────────────────────────────────
  test('TC-HIST-008: Export Excel button', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const exportBtn = page.locator('button', { hasText: 'Export Excel' });
    await expect(exportBtn).toBeVisible();
    await expect(exportBtn).toBeEnabled();

    const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
    await exportBtn.click();
    const download = await downloadPromise;

    if (download) {
      expect(download.suggestedFilename()).toMatch(/lsppt-history|history-export/);
    }

    await page.waitForTimeout(3000);
  });

  // ── TC-HIST-009 ──────────────────────────────────────────────
  test('TC-HIST-009: Table entry count display', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const countText = page.locator('text=entri ditemukan');
    await expect(countText).toBeVisible();

    const text = await countText.textContent();
    const match = text.match(/^(\d+)\s+entri/);
    expect(match).toBeTruthy();
    const count = parseInt(match[1], 10);
    expect(count).toBeGreaterThan(0);

    const rows = await page.locator('tbody tr').count();
    expect(rows).toBe(count);

    const select = page.locator('select');
    await select.selectOption({ label: 'Geta' });
    await page.waitForTimeout(1500);

    const newCountText = await page.locator('text=entri ditemukan').textContent();
    const newMatch = newCountText.match(/^(\d+)\s+entri/);
    const newCount = parseInt(newMatch[1], 10);
    const newRows = await page.locator('tbody tr').count();
    expect(newRows).toBe(newCount);

    await select.selectOption('');
    await page.waitForTimeout(1000);
  });

  // ── TC-HIST-010 ──────────────────────────────────────────────
  test('TC-HIST-010: Table columns & data rendering', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const headers = await page.locator('th').allTextContents();
    expect(headers).toEqual(['Karyawan', 'Tanggal', 'Tugas', 'ClickUp ID', 'Phase', 'Status']);

    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0);

    for (let i = 0; i < rows; i++) {
      const row = page.locator('tbody tr').nth(i);
      const cells = await row.locator('td').count();
      expect(cells).toBe(6);

      const employee = await row.locator('td').nth(0).textContent();
      expect(employee.trim().length).toBeGreaterThan(0);

      const date = await row.locator('td').nth(1).textContent();
      expect(date.trim()).toMatch(/\d{1,2}\s\w+\s\d{4}/);

      const task = await row.locator('td').nth(2).textContent();
      expect(task.trim().length).toBeGreaterThan(0);

      const clickupId = await row.locator('td').nth(3).textContent();
      expect(clickupId.trim().length).toBeGreaterThan(0);

      const phase = await row.locator('td').nth(4).textContent();
      expect(phase.trim().length).toBeGreaterThan(0);

      const status = await row.locator('td').nth(5).textContent();
      expect(status.trim().length).toBeGreaterThan(0);
    }
  });

  // ── TC-HIST-011 ──────────────────────────────────────────────
  test('TC-HIST-011: Row click opens detail modal', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0);

    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1000);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    await expect(modal.locator('text=Karyawan')).toBeVisible();
    await expect(modal.locator('text=ClickUp ID')).toBeVisible();
    await expect(modal.locator('text=Phase saat ini')).toBeVisible();
    await expect(modal.locator('text=Status saat ini')).toBeVisible();
    await expect(modal.locator('text=Last Updated')).toBeVisible();
    await expect(modal.locator('text=Riwayat Progress')).toBeVisible();
  });

  // ── TC-HIST-012 ──────────────────────────────────────────────
  test('TC-HIST-012: Task button click opens detail modal', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0);

    const taskButton = page.locator('tbody tr').first().locator('td').nth(2).locator('button');
    await expect(taskButton).toBeVisible();

    const taskName = await taskButton.textContent();
    console.log(`Clicking task button: ${taskName.trim()}`);

    await taskButton.click();
    await page.waitForTimeout(1000);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const modalTitle = await modal.locator('h2').textContent();
    expect(modalTitle.trim()).toBe(taskName.trim());

    await modal.locator('button', { hasText: 'Tutup' }).click();
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();
  });

  // ── TC-HIST-013 ──────────────────────────────────────────────
  test('TC-HIST-013: Detail modal content & timeline', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(2000);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const infoLabels = await modal.locator('dt').allTextContents();
    const expectedLabels = ['Karyawan', 'ClickUp ID', 'Phase saat ini', 'Status saat ini', 'Last Updated'];
    for (const label of expectedLabels) {
      expect(infoLabels).toContainEqual(label);
    }

    const timeline = modal.locator('ol[aria-label="Riwayat progress"]');
    const timelineExists = await timeline.isVisible().catch(() => false);

    if (timelineExists) {
      const entries = await timeline.locator('li').count();
      expect(entries).toBeGreaterThan(0);
      console.log(`Timeline entries: ${entries}`);
    } else {
      const noHistory = await modal.locator('text=Task ini belum memiliki riwayat progress').isVisible();
      const errorMsg = await modal.locator('text=Riwayat progress tidak dapat dimuat').isVisible();
      expect(noHistory || errorMsg).toBeTruthy();
    }
  });

  // ── TC-HIST-014 ──────────────────────────────────────────────
  test('TC-HIST-014: Close detail modal (button & backdrop)', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1000);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    await modal.locator('button', { hasText: 'Tutup' }).click();
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();

    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1000);
    await expect(modal).toBeVisible();

    await page.locator('[role="dialog"]').locator('..').locator('[aria-label="Close"]').click();
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();

    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1000);
    await expect(modal).toBeVisible();

    const backdrop = page.locator('.bg-slate-900\\/50');
    if (await backdrop.isVisible()) {
      await backdrop.click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(500);
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  // ── TC-HIST-015 ──────────────────────────────────────────────
  test('TC-HIST-015: Navigation links', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');

    const backLink = page.locator('a', { hasText: 'Kembali ke Submit' });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/submit');

    await backLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/submit/);

    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/history/);
  });

  // ── TC-HIST-016 ──────────────────────────────────────────────
  test('TC-HIST-016: Keyboard accessibility (Enter/Space on row)', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0);

    const firstRow = page.locator('tbody tr').first();
    await firstRow.focus();

    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();

    await firstRow.focus();
    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    await expect(modal).toBeVisible();
  });
});
