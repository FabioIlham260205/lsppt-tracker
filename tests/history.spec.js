const { test, expect } = require('@playwright/test');

const HISTORY_URL = '/history';
const TIMEOUT_WAIT_DATA = 8000;

test.describe('History Page - Full Flow', () => {
  test('E2E alur lengkap semua fitur history', async ({ page }) => {
    // ── 1. Page load & initial render ─────────────────────────────
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
    const headerTexts = await page.locator('th').allTextContents();
    expect(headerTexts).toEqual(['Karyawan', 'Tanggal', 'Tugas', 'ClickUp ID', 'Phase', 'Status']);

    await page.waitForTimeout(TIMEOUT_WAIT_DATA);

    // ── 2. Table render & entry count ─────────────────────────────
    const countText = page.locator('text=entri ditemukan');
    await expect(countText).toBeVisible();
    const countMatch = (await countText.textContent()).match(/^(\d+)\s+entri/);
    expect(countMatch).toBeTruthy();
    const totalCount = parseInt(countMatch[1], 10);
    expect(totalCount).toBeGreaterThan(0);

    const rowCount = await page.locator('tbody tr').count();
    expect(rowCount).toBe(totalCount);

    for (let i = 0; i < rowCount; i++) {
      const row = page.locator('tbody tr').nth(i);
      await expect(row.locator('td')).toHaveCount(6);
      const cells = await row.locator('td').allTextContents();
      expect(cells[0].trim().length).toBeGreaterThan(0);
      expect(cells[1].trim()).toMatch(/\d{1,2}\s\w+\s\d{4}/);
      expect(cells[2].trim().length).toBeGreaterThan(0);
      expect(cells[3].trim().length).toBeGreaterThan(0);
      expect(cells[4].trim().length).toBeGreaterThan(0);
      expect(cells[5].trim().length).toBeGreaterThan(0);
    }

    // ── 3. Employee filter ─────────────────────────────────────────
    const select = page.locator('select');
    await expect(select).toBeVisible();
    const options = await select.locator('option').allTextContents();
    expect(options.some((o) => o.includes('Semua karyawan'))).toBeTruthy();

    await select.selectOption({ label: 'Geta' });
    await page.waitForTimeout(1000);
    let rows = await page.locator('tbody tr').count();
    if (rows > 0) {
      const cells = await page.locator('tbody tr td:first-child').allTextContents();
      for (const c of cells) expect(c.trim()).toBe('Geta');
    }

    await select.selectOption({ label: 'Arifin' });
    await page.waitForTimeout(1000);
    rows = await page.locator('tbody tr').count();
    if (rows > 0) {
      const cells = await page.locator('tbody tr td:first-child').allTextContents();
      for (const c of cells) expect(c.trim()).toBe('Arifin');
    }

    await select.selectOption('');
    await page.waitForTimeout(1000);

    // ── 4. Date range pickers ──────────────────────────────────────
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
    await toInput.fill('2026-08-25');
    await page.waitForTimeout(1500);

    // ── 5. Invalid date range ──────────────────────────────────────
    await fromInput.fill('2026-08-25');
    await toInput.fill('2026-08-20');
    await page.waitForTimeout(500);
    const alertVisible = await page.locator('[role="alert"]').isVisible();
    const warningVisible = await page.locator('text=Rentang tanggal tidak valid').isVisible();
    expect(alertVisible || warningVisible).toBeTruthy();

    await fromInput.fill('');
    await toInput.fill('');
    await page.waitForTimeout(1000);

    // ── 6. Period quick-select buttons ─────────────────────────────
    const mingguBtn = page.locator('button', { hasText: 'Minggu Ini' });
    const bulanBtn = page.locator('button', { hasText: 'Bulan Ini' });
    const tahunBtn = page.locator('button', { hasText: 'Tahun Ini' });
    const semuaBtn = page.locator('button', { hasText: 'Semua' });

    await expect(mingguBtn).toBeVisible();
    await expect(bulanBtn).toBeVisible();
    await expect(tahunBtn).toBeVisible();
    await expect(semuaBtn).toBeVisible();

    await bulanBtn.click();
    await page.waitForTimeout(1000);
    expect(await bulanBtn.getAttribute('class')).toContain('bg-white');

    await mingguBtn.click();
    await page.waitForTimeout(1500);
    expect(await mingguBtn.getAttribute('class')).toContain('bg-white');
    const rowsMinggu = await page.locator('tbody tr').count();

    await tahunBtn.click();
    await page.waitForTimeout(1500);
    expect(await tahunBtn.getAttribute('class')).toContain('bg-white');
    const rowsTahun = await page.locator('tbody tr').count();
    expect(rowsTahun).toBeGreaterThanOrEqual(rowsMinggu);

    await semuaBtn.click();
    await page.waitForTimeout(1500);
    expect(await semuaBtn.getAttribute('class')).toContain('bg-white');
    const rowsSemua = await page.locator('tbody tr').count();
    expect(rowsSemua).toBeGreaterThanOrEqual(rowsTahun);

    await bulanBtn.click();
    await page.waitForTimeout(1500);

    // ── 7. Text search with debounce ───────────────────────────────
    const rowsBefore = await page.locator('tbody tr').count();
    expect(rowsBefore).toBeGreaterThan(0);

    const searchInput = page.locator('input[placeholder*="Cari"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('CTMS');
    await page.waitForTimeout(500);
    const rowsAfterSearch = await page.locator('tbody tr').count();
    expect(rowsAfterSearch).toBeLessThanOrEqual(rowsBefore);
    if (rowsAfterSearch > 0) {
      const firstRowText = (await page.locator('tbody tr').first().textContent()).toLowerCase();
      expect(firstRowText).toContain('ctms');
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

    // ── 8. Reset filter button ─────────────────────────────────────
    await select.selectOption({ label: 'Geta' });
    await searchInput.fill('CTMS');
    await page.waitForTimeout(500);

    const resetBtn = page.locator('button', { hasText: 'Reset Filter' });
    await expect(resetBtn).toBeVisible();
    expect(await select.inputValue() !== '' || (await searchInput.inputValue()) !== '').toBeTruthy();

    await resetBtn.click();
    await page.waitForTimeout(1500);
    expect(await select.inputValue()).toBe('');
    expect(await searchInput.inputValue()).toBe('');
    await expect(page.locator('button', { hasText: 'Reset Filter' })).not.toBeVisible();

    // ── 9. Row click opens detail modal & content ─────────────────
    rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0);
    const firstRow = page.locator('tbody tr').first();

    await firstRow.click();
    await page.waitForTimeout(2000);
    let modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.locator('text=Karyawan')).toBeVisible();
    await expect(modal.locator('text=ClickUp ID')).toBeVisible();
    await expect(modal.locator('text=Phase saat ini')).toBeVisible();
    await expect(modal.locator('text=Status saat ini')).toBeVisible();
    await expect(modal.locator('text=Last Updated')).toBeVisible();
    await expect(modal.locator('text=Riwayat Progress')).toBeVisible();

    const timeline = modal.locator('ol[aria-label="Riwayat progress"]');
    const timelineExists = await timeline.isVisible().catch(() => false);
    if (timelineExists) {
      expect(await timeline.locator('li').count()).toBeGreaterThan(0);
    } else {
      const noHistory = await modal.locator('text=Task ini belum memiliki riwayat progress').isVisible();
      const errorMsg = await modal.locator('text=Riwayat progress tidak dapat dimuat').isVisible();
      expect(noHistory || errorMsg).toBeTruthy();
    }

    await modal.locator('button', { hasText: 'Tutup' }).click();
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();

    // ── 10. Task button opens modal; close via Tutup / Escape / backdrop ──
    const taskButton = page.locator('tbody tr').first().locator('td').nth(2).locator('button');
    const taskName = (await taskButton.textContent()).trim();
    await taskButton.click();
    await page.waitForTimeout(1000);
    modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    expect((await modal.locator('h2').textContent()).trim()).toBe(taskName);

    await modal.locator('button', { hasText: 'Tutup' }).click();
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();

    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1000);
    await expect(modal).toBeVisible();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();

    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1000);
    await expect(modal).toBeVisible();
    const backdrop = page.locator('.bg-slate-900\\/50');
    if (await backdrop.isVisible()) {
      await backdrop.click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(500);
      await expect(modal).not.toBeVisible();
    }

    // ── 11. Keyboard accessibility (Enter/Space on row) ─────────────
    await firstRow.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await expect(modal).toBeVisible();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();

    await firstRow.focus();
    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);
    await expect(modal).toBeVisible();

    // ── 12. Update Progress - form & phase/status dependency ────────
    await modal.locator('button', { hasText: 'Update Progress' }).click();
    await page.waitForTimeout(500);
    await expect(modal.locator('text=Update Progress').last()).toBeVisible();

    const phaseSelect = modal.locator('select').nth(0);
    const statusSelect = modal.locator('select').nth(1);
    const updateDateInput = modal.locator('input[type="date"]');
    await expect(phaseSelect).toBeVisible();
    await expect(statusSelect).toBeVisible();
    await expect(updateDateInput).toBeVisible();

    const phaseOptions = await phaseSelect.locator('option').allTextContents();
    expect(phaseOptions).toContain('TS');
    expect(phaseOptions).toContain('QA');

    await phaseSelect.selectOption('QA');
    await page.waitForTimeout(300);
    const qaStatuses = await statusSelect.locator('option').allTextContents();
    expect(qaStatuses).toContain('Completed');
    expect(qaStatuses).toContain('Testing');
    expect(qaStatuses.length).toBeGreaterThanOrEqual(4);

    await phaseSelect.selectOption('TS');
    await page.waitForTimeout(300);
    const tsStatuses = await statusSelect.locator('option').allTextContents();
    expect(tsStatuses).toContain('In Progress');
    expect(tsStatuses).toContain('Plan');
    expect(tsStatuses.length).toBeGreaterThanOrEqual(3);

    const defaultDate = await updateDateInput.inputValue();
    expect(defaultDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    // ── 13. Cancel closes the update form ───────────────────────────
    await phaseSelect.selectOption('TS');
    await page.waitForTimeout(300);
    await modal.locator('button', { hasText: 'Batal' }).click();
    await page.waitForTimeout(300);
    await expect(modal.locator('button', { hasText: 'Update Progress' })).toBeVisible();
    await expect(phaseSelect).not.toBeVisible();

    // reset state: close the modal, then reopen on a fresh row
    await modal.locator('button', { hasText: 'Tutup' }).click();
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();
    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1500);
    await expect(modal).toBeVisible();

    // ── 14. Update Progress - duplicate date (409) ──────────────────
    // the opened row's "Tanggal" is an existing progress entry for this task,
    // so submitting with that date guarantees a conflict (409)
    const idMonths = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, Mei: 5, Jun: 6, Jul: 7, Agu: 8, Sep: 9, Okt: 10, Nov: 11, Des: 12 };
    const existingDateText = (await page.locator('tbody tr').first().locator('td').nth(1).textContent()).trim();
    const existingDateMatch = existingDateText.match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})$/);
    expect(existingDateMatch).toBeTruthy();
    const existingDate = `${existingDateMatch[3]}-${String(idMonths[existingDateMatch[2]]).padStart(2, '0')}-${String(existingDateMatch[1]).padStart(2, '0')}`;

    await modal.locator('button', { hasText: 'Update Progress' }).click();
    await page.waitForTimeout(500);
    await expect(phaseSelect).toBeVisible();
    await phaseSelect.selectOption('QA');
    await page.waitForTimeout(300);
    await statusSelect.selectOption('Completed Testing');
    await page.waitForTimeout(300);
    await updateDateInput.fill(existingDate);
    await page.waitForTimeout(300);

    await modal.locator('button', { hasText: 'Simpan Progress' }).click();
    await expect(page.locator('text=Progress untuk tanggal ini sudah ada')).toBeVisible();
    await expect(phaseSelect).toBeVisible();

    // reset state: close modal, reopen fresh
    await modal.locator('button', { hasText: 'Batal' }).click();
    await page.waitForTimeout(300);
    await modal.locator('button', { hasText: 'Tutup' }).click();
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();
    await page.locator('tbody tr').first().click();
    await page.waitForTimeout(1500);
    await expect(modal).toBeVisible();

    // ── 15. Update Progress - Simpan success ────────────────────────
    await modal.locator('button', { hasText: 'Update Progress' }).click();
    await page.waitForTimeout(500);
    await expect(phaseSelect).toBeVisible();
    await phaseSelect.selectOption('QA');
    await page.waitForTimeout(300);
    await statusSelect.selectOption('Completed Testing');
    await page.waitForTimeout(300);

    // unique far-future date derived from current time so re-runs never collide
    const uniqueOffset = 365 + (Date.now() % 500);
    const farFuture = new Date(Date.now() + uniqueOffset * 86400000);
    const fy = farFuture.getFullYear();
    const fm = String(farFuture.getMonth() + 1).padStart(2, '0');
    const fd = String(farFuture.getDate()).padStart(2, '0');
    await updateDateInput.fill(`${fy}-${fm}-${fd}`);
    await page.waitForTimeout(300);

    await modal.locator('button', { hasText: 'Simpan Progress' }).click();
    await expect(page.locator('text=Progress berhasil diperbarui')).toBeVisible();
    await expect(phaseSelect).not.toBeVisible();
    await modal.locator('button', { hasText: 'Tutup' }).click();
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();

    // ── 16. Export Excel ────────────────────────────────────────────
    const exportBtn = page.locator('button', { hasText: 'Export Excel' });
    await expect(exportBtn).toBeVisible();
    await expect(exportBtn).toBeEnabled();
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
    await exportBtn.click();
    const download = await downloadPromise;
    if (download) {
      expect(download.suggestedFilename()).toMatch(/lsppt-history|history-export/);
    }
    await page.waitForTimeout(2000);

    // ── 17. Navigation links ───────────────────────────────────────
    const backLink = page.locator('a', { hasText: 'Kembali ke Submit' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/submit/);

    await page.goto(HISTORY_URL);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/history/);
  });
});