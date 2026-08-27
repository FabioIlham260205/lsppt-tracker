const { test, expect } = require('@playwright/test');

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

    const entryCountBefore = await page.locator('text=entri ditemukan').textContent();

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
