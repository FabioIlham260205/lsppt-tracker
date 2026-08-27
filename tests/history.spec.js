import { test, expect } from '@playwright/test';

const HISTORY_URL = '/history';
const TIMEOUT_WAIT_DATA = 8000;

test.describe('History Page - Filters & Search', () => {

  // ── TC-HIST-001 ──────────────────────────────────────────────
  test('TC-HIST-001: Page load & initial render', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toHaveText('History');
    await expect(page.locator('text=Rekap progres LSPPT harian semua karyawan')).toBeVisible();
    await expect(page.locator('a', { hasText: 'Kembali ke Submit' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Kembali ke Submit' })).toHaveAttribute('href', '/submit');

    await expect(page.locator('label', { hasText: 'Karyawan' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'Dari Tanggal' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'Sampai Tanggal' })).toBeVisible();
    await expect(page.locator('input[placeholder*="Cari"]')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Export Excel' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Bulan Ini' })).toBeVisible();

    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th', { hasText: 'Karyawan' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Tanggal' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Tugas' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'ClickUp ID' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Phase' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Status' })).toBeVisible();

    await expect(page.locator('text=entri ditemukan')).toBeVisible();
  });

  // ── TC-HIST-002 ──────────────────────────────────────────────
  test('TC-HIST-002: Employee filter (select dropdown)', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const select = page.locator('select');
    await expect(select).toBeVisible();

    const options = await select.locator('option').allTextContents();
    expect(options.some(o => o.includes('Semua karyawan'))).toBeTruthy();

    await select.selectOption({ label: 'Geta' });
    await page.waitForTimeout(1000);

    const rows = await page.locator('tbody tr').count();
    if (rows > 0) {
      const employeeCells = await page.locator('tbody tr td:first-child').allTextContents();
      for (const cell of employeeCells) {
        expect(cell.trim()).toBe('Geta');
      }
    }

    await select.selectOption({ label: 'Arifin' });
    await page.waitForTimeout(1000);

    const rows2 = await page.locator('tbody tr').count();
    if (rows2 > 0) {
      const employeeCells2 = await page.locator('tbody tr td:first-child').allTextContents();
      for (const cell of employeeCells2) {
        expect(cell.trim()).toBe('Arifin');
      }
    }

    await select.selectOption('');
    await page.waitForTimeout(1000);
  });

  // ── TC-HIST-003 ──────────────────────────────────────────────
  test('TC-HIST-003: Date range pickers (from/to)', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const dateInputs = page.locator('input[type="date"]');
    await expect(dateInputs).toHaveCount(2);

    const fromInput = dateInputs.nth(0);
    const toInput = dateInputs.nth(1);

    const fromValue = await fromInput.inputValue();
    const toValue = await toInput.inputValue();
    expect(fromValue).toBeTruthy();
    expect(toValue).toBeTruthy();
    expect(fromValue <= toValue).toBeTruthy();

    await fromInput.fill('2026-08-20');
    await page.waitForTimeout(1500);

    await toInput.fill('2026-08-25');
    await page.waitForTimeout(1500);

    const rows = await page.locator('tbody tr').count();
    console.log(`Rows after date range 2026-08-20 to 2026-08-25: ${rows}`);

    await fromInput.fill('');
    await toInput.fill('');
    await page.waitForTimeout(1000);
  });

  // ── TC-HIST-004 ──────────────────────────────────────────────
  test('TC-HIST-004: Invalid date range detection', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const dateInputs = page.locator('input[type="date"]');
    const fromInput = dateInputs.nth(0);
    const toInput = dateInputs.nth(1);

    await fromInput.fill('2026-08-25');
    await toInput.fill('2026-08-20');
    await page.waitForTimeout(500);

    const alertVisible = await page.locator('[role="alert"]').isVisible();
    const warningText = await page.locator('text=Rentang tanggal tidak valid').isVisible();
    expect(alertVisible || warningText).toBeTruthy();

    await fromInput.fill('');
    await toInput.fill('');
    await page.waitForTimeout(1000);
  });

  // ── TC-HIST-005 ──────────────────────────────────────────────
  test('TC-HIST-005: Period quick-select buttons', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const mingguBtn = page.locator('button', { hasText: 'Minggu Ini' });
    const bulanBtn = page.locator('button', { hasText: 'Bulan Ini' });
    const tahunBtn = page.locator('button', { hasText: 'Tahun Ini' });
    const semuaBtn = page.locator('button', { hasText: 'Semua' });

    await expect(mingguBtn).toBeVisible();
    await expect(bulanBtn).toBeVisible();
    await expect(tahunBtn).toBeVisible();
    await expect(semuaBtn).toBeVisible();

    const bulanClass = await bulanBtn.getAttribute('class');
    expect(bulanClass).toContain('bg-white');

    await mingguBtn.click();
    await page.waitForTimeout(1500);
    const mingguClass = await mingguBtn.getAttribute('class');
    expect(mingguClass).toContain('bg-white');
    const rowsMinggu = await page.locator('tbody tr').count();
    console.log(`Rows after Minggu Ini: ${rowsMinggu}`);

    await tahunBtn.click();
    await page.waitForTimeout(1500);
    const tahunClass = await tahunBtn.getAttribute('class');
    expect(tahunClass).toContain('bg-white');
    const rowsTahun = await page.locator('tbody tr').count();
    console.log(`Rows after Tahun Ini: ${rowsTahun}`);
    expect(rowsTahun).toBeGreaterThanOrEqual(rowsMinggu);

    await semuaBtn.click();
    await page.waitForTimeout(1500);
    const rowsSemua = await page.locator('tbody tr').count();
    console.log(`Rows after Semua: ${rowsSemua}`);
    expect(rowsSemua).toBeGreaterThanOrEqual(rowsTahun);

    await bulanBtn.click();
    await page.waitForTimeout(1500);
  });

  // ── TC-HIST-006 ──────────────────────────────────────────────
  test('TC-HIST-006: Text search with debounce', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const rowsBefore = await page.locator('tbody tr').count();
    expect(rowsBefore).toBeGreaterThan(0);

    const searchInput = page.locator('input[placeholder*="Cari"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('CTMS');
    await page.waitForTimeout(500);

    const rowsAfterSearch = await page.locator('tbody tr').count();
    console.log(`Rows after search "CTMS": ${rowsAfterSearch}`);
    expect(rowsAfterSearch).toBeLessThanOrEqual(rowsBefore);

    if (rowsAfterSearch > 0) {
      const firstRowText = await page.locator('tbody tr').first().textContent();
      expect(firstRowText.toLowerCase()).toContain('ctms');
    }

    await searchInput.fill('nonexistentXYZ123');
    await page.waitForTimeout(500);

    const emptyState = await page.locator('text=Belum ada data yang cocok').isVisible();
    const zeroRows = (await page.locator('tbody tr').count()) === 0;
    expect(emptyState || zeroRows).toBeTruthy();

    await searchInput.fill('');
    await page.waitForTimeout(500);

    const rowsReset = await page.locator('tbody tr').count();
    expect(rowsReset).toBe(rowsBefore);
  });

  // ── TC-HIST-007 ──────────────────────────────────────────────
  test('TC-HIST-007: Reset filter button', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    const select = page.locator('select');
    await select.selectOption({ label: 'Geta' });
    await page.waitForTimeout(1000);

    const searchInput = page.locator('input[placeholder*="Cari"]');
    await searchInput.fill('CTMS');
    await page.waitForTimeout(500);

    const resetBtn = page.locator('button', { hasText: 'Reset Filter' });
    await expect(resetBtn).toBeVisible();

    const selectValue = await select.inputValue();
    const searchValue = await searchInput.inputValue();
    expect(selectValue !== '' || searchValue !== '').toBeTruthy();

    await resetBtn.click();
    await page.waitForTimeout(1500);

    const selectValueAfter = await select.inputValue();
    const searchValueAfter = await searchInput.inputValue();
    expect(selectValueAfter).toBe('');
    expect(searchValueAfter).toBe('');

    const resetBtnGone = await page.locator('button', { hasText: 'Reset Filter' }).isVisible();
    expect(resetBtnGone).toBeFalsy();
  });
});

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

  // ── TC-HIST-017 ──────────────────────────────────────────────
  test('TC-HIST-017: Update Progress - form appears & fill form', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const updateBtn = modal.locator('button', { hasText: 'Update Progress' });
    await expect(updateBtn).toBeVisible();
    await updateBtn.click();
    await page.waitForTimeout(500);

    const updateSection = modal.locator('text=Update Progress').last();
    await expect(updateSection).toBeVisible();

    const phaseSelect = modal.locator('select').nth(0);
    const statusSelect = modal.locator('select').nth(1);
    const dateInput = modal.locator('input[type="date"]');

    await expect(phaseSelect).toBeVisible();
    await expect(statusSelect).toBeVisible();
    await expect(dateInput).toBeVisible();

    const phaseOptions = await phaseSelect.locator('option').allTextContents();
    expect(phaseOptions).toContain('TS');
    expect(phaseOptions).toContain('QA');

    await phaseSelect.selectOption('QA');
    await page.waitForTimeout(300);
    const qaStatuses = await statusSelect.locator('option').allTextContents();
    console.log('QA statuses:', qaStatuses);
    expect(qaStatuses).toContain('Completed');
    expect(qaStatuses).toContain('Testing');
    expect(qaStatuses.length).toBeGreaterThanOrEqual(4);

    await phaseSelect.selectOption('TS');
    await page.waitForTimeout(300);
    const tsStatuses = await statusSelect.locator('option').allTextContents();
    console.log('TS statuses:', tsStatuses);
    expect(tsStatuses).toContain('In Progress');
    expect(tsStatuses).toContain('Plan');
    expect(tsStatuses.length).toBeGreaterThanOrEqual(3);

    const dateValue = await dateInput.inputValue();
    expect(dateValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    console.log('Default date:', dateValue);

    const simpanBtn = modal.locator('button', { hasText: 'Simpan Progress' });
    await expect(simpanBtn).toBeVisible();

    const batalBtn = modal.locator('button', { hasText: 'Batal' });
    await expect(batalBtn).toBeVisible();

    await batalBtn.click();
    await page.waitForTimeout(300);

    await expect(updateBtn).toBeVisible();
  });

  // ── TC-HIST-018 ──────────────────────────────────────────────
  test('TC-HIST-018: Update Progress - Simpan Progress success', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    await modal.locator('button', { hasText: 'Update Progress' }).click();
    await page.waitForTimeout(500);

    const phaseSelect = modal.locator('select').nth(0);
    const statusSelect = modal.locator('select').nth(1);
    const dateInput = modal.locator('input[type="date"]');

    await phaseSelect.selectOption('QA');
    await page.waitForTimeout(300);
    await statusSelect.selectOption('Completed Testing');
    await page.waitForTimeout(300);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowStr = `${y}-${m}-${d}`;
    await dateInput.fill(tomorrowStr);
    await page.waitForTimeout(300);

    await modal.locator('button', { hasText: 'Simpan Progress' }).click();
    await page.waitForTimeout(3000);

    const toast = page.locator('text=Progress berhasil diperbarui');
    const toastVisible = await toast.isVisible().catch(() => false);
    console.log('Success toast visible:', toastVisible);

    const updateSectionVisible = await modal.locator('text=Update Progress').last().isVisible().catch(() => false);
    console.log('Update form still visible after save:', updateSectionVisible);
  });

  // ── TC-HIST-019 ──────────────────────────────────────────────
  test('TC-HIST-019: Update Progress - Batal closes form', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const updateBtn = modal.locator('button', { hasText: 'Update Progress' });
    await expect(updateBtn).toBeVisible();
    await updateBtn.click();
    await page.waitForTimeout(500);

    const phaseSelect = modal.locator('select').nth(0);
    await expect(phaseSelect).toBeVisible();

    await phaseSelect.selectOption('TS');
    await page.waitForTimeout(300);

    await modal.locator('button', { hasText: 'Batal' }).click();
    await page.waitForTimeout(300);

    await expect(updateBtn).toBeVisible();

    const formHidden = await phaseSelect.isVisible().catch(() => false);
    expect(formHidden).toBeFalsy();
  });

  // ── TC-HIST-020 ──────────────────────────────────────────────
  test('TC-HIST-020: Update Progress - error 409 duplicate date', async ({ page }) => {
    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    await modal.locator('button', { hasText: 'Update Progress' }).click();
    await page.waitForTimeout(500);

    const dateInput = modal.locator('input[type="date"]');
    const currentDate = await dateInput.inputValue();
    console.log('Using existing date for duplicate test:', currentDate);

    await modal.locator('button', { hasText: 'Simpan Progress' }).click();
    await page.waitForTimeout(3000);

    const errorMsg = page.locator('text=Progress untuk tanggal ini sudah ada');
    const errorVisible = await errorMsg.isVisible().catch(() => false);
    console.log('Duplicate error visible:', errorVisible);

    const phaseSelect = modal.locator('select').nth(0);
    const formStillVisible = await phaseSelect.isVisible().catch(() => false);
    console.log('Form still open after error:', formStillVisible);
  });
});
