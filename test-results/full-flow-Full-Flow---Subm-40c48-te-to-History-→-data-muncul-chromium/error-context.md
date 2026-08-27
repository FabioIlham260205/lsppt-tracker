# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-flow.spec.js >> Full Flow - Submit → History >> TC-FLOW-001: Submit LSPPT → navigate to History → data muncul
- Location: tests\full-flow.spec.js:9:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - heading "History" [level=1] [ref=e7]
      - paragraph [ref=e8]: Rekap progres LSPPT harian semua karyawan.
    - link "← Kembali ke Submit" [ref=e9] [cursor=pointer]:
      - /url: /submit
  - generic [ref=e11]:
    - generic [ref=e12]:
      - generic [ref=e13]: Karyawan
      - combobox "Karyawan" [ref=e14]:
        - option "Semua karyawan"
        - option "Geta"
        - option "Arifin"
        - option "Lundy" [selected]
    - generic [ref=e15]:
      - generic [ref=e16]: Dari Tanggal
      - textbox "Dari Tanggal" [ref=e17]: 2026-08-01
    - generic [ref=e18]:
      - generic [ref=e19]: Sampai Tanggal
      - textbox "Sampai Tanggal" [ref=e20]: 2026-08-27
    - generic [ref=e21]:
      - generic [ref=e22]: Cari
      - textbox "Cari" [ref=e23]:
        - /placeholder: Cari tugas atau ClickUp ID…
    - button "Reset Filter" [ref=e24]
  - generic [ref=e25]:
    - generic [ref=e26]:
      - paragraph [ref=e27]: 1 entri ditemukan
      - generic [ref=e28]:
        - generic [ref=e29]:
          - button "Minggu Ini" [ref=e30]
          - button "Bulan Ini" [ref=e31]
          - button "Tahun Ini" [ref=e32]
          - button "Semua" [ref=e33]
        - paragraph [ref=e34]: 1 Agu 2026 – 27 Agu 2026
        - button "Export Excel" [ref=e35]
    - table [ref=e37]:
      - rowgroup [ref=e38]:
        - row [ref=e39]:
          - columnheader "Karyawan" [ref=e40]
          - columnheader "Tanggal" [ref=e41]
          - columnheader "Tugas" [ref=e42]
          - columnheader "ClickUp ID" [ref=e43]
          - columnheader "Phase" [ref=e44]
          - columnheader "Status" [ref=e45]
      - rowgroup [ref=e46]:
        - row "Buka detail tugas Portal - User Management" [ref=e47] [cursor=pointer]:
          - cell "Lundy" [ref=e48]
          - cell "16 Agu 2026" [ref=e49]
          - cell [ref=e50]:
            - button "Portal - User Management" [ref=e51]
          - cell "86d43h41c" [ref=e53]
          - cell "QA" [ref=e54]
          - cell "Plan" [ref=e55]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const API = 'http://localhost:3000/api';
  4   | const TIMEOUT_WAIT_DATA = 8000;
  5   | 
  6   | test.describe('Full Flow - Submit → History', () => {
  7   | 
  8   |   // ── TC-FLOW-001 ──────────────────────────────────────────
  9   |   test('TC-FLOW-001: Submit LSPPT → navigate to History → data muncul', async ({ page }) => {
  10  |     // Step 1: Submit LSPPT
  11  |     await page.goto('/submit');
  12  |     await page.waitForLoadState('networkidle');
  13  | 
  14  |     await page.getByLabel('Employee').selectOption({ label: 'Lundy' });
  15  |     await page.getByLabel('Tanggal').fill('2026-08-28');
  16  |     await page.getByLabel('Task Title').fill('E2E TEST - Full Flow Submit to History');
  17  |     await page.getByLabel('ClickUp URL').fill('https://app.clickup.com/t/9003006723/e2eflow01');
  18  |     await expect(page.getByLabel('ClickUp Task ID')).toHaveValue('e2eflow01');
  19  | 
  20  |     await page.getByLabel('Phase').selectOption({ value: 'TS' });
  21  |     await expect(page.getByLabel('Status')).toBeEnabled();
  22  |     await page.getByLabel('Status').selectOption({ label: 'Completed' });
  23  | 
  24  |     await page.getByRole('button', { name: '+ Add Task' }).click();
  25  |     await expect(page.getByText('E2E TEST - Full Flow Submit to History')).toBeVisible();
  26  | 
  27  |     await page.getByRole('button', { name: 'Save LSPPT' }).click();
  28  | 
  29  |     const toast = page.getByRole('alert');
  30  |     await expect(toast).toBeVisible({ timeout: 10000 });
  31  |     await expect(toast).toContainText('Berhasil');
  32  | 
  33  |     // Step 2: Navigate to History
  34  |     await page.getByRole('link', { name: 'Lihat History' }).click();
  35  |     await page.waitForLoadState('networkidle');
  36  |     await expect(page).toHaveURL(/\/history/);
  37  |     await page.waitForTimeout(TIMEOUT_WAIT_DATA);
  38  | 
  39  |     // Step 3: Verify data muncul di tabel
  40  |     await page.getByLabel('Karyawan').selectOption({ label: 'Lundy' });
  41  |     await page.waitForTimeout(1500);
  42  | 
  43  |     const rows = await page.locator('tbody tr').count();
  44  |     expect(rows).toBeGreaterThan(0);
  45  | 
  46  |     const found = await page.locator('text=E2E TEST - Full Flow Submit to History').isVisible();
> 47  |     expect(found).toBeTruthy();
      |                   ^ Error: expect(received).toBeTruthy()
  48  |   });
  49  | 
  50  |   // ── TC-FLOW-002 ──────────────────────────────────────────
  51  |   test('TC-FLOW-002: Submit → History → detail modal → update progress', async ({ page }) => {
  52  |     // Step 1: Submit LSPPT
  53  |     await page.goto('/submit');
  54  |     await page.waitForLoadState('networkidle');
  55  | 
  56  |     await page.getByLabel('Employee').selectOption({ label: 'Geta' });
  57  |     await page.getByLabel('Tanggal').fill('2026-08-28');
  58  |     await page.getByLabel('Task Title').fill('E2E TEST - Update Progress Flow');
  59  |     await page.getByLabel('ClickUp URL').fill('https://app.clickup.com/t/9003006723/e2eflow02');
  60  |     await expect(page.getByLabel('ClickUp Task ID')).toHaveValue('e2eflow02');
  61  | 
  62  |     await page.getByLabel('Phase').selectOption({ value: 'QA' });
  63  |     await expect(page.getByLabel('Status')).toBeEnabled();
  64  |     await page.getByLabel('Status').selectOption({ label: 'Testing' });
  65  | 
  66  |     await page.getByRole('button', { name: '+ Add Task' }).click();
  67  |     await expect(page.getByText('E2E TEST - Update Progress Flow')).toBeVisible();
  68  | 
  69  |     await page.getByRole('button', { name: 'Save LSPPT' }).click();
  70  | 
  71  |     const toast = page.getByRole('alert');
  72  |     await expect(toast).toBeVisible({ timeout: 10000 });
  73  |     await expect(toast).toContainText('Berhasil');
  74  | 
  75  |     // Step 2: Navigate to History
  76  |     await page.getByRole('link', { name: 'Lihat History' }).click();
  77  |     await page.waitForLoadState('networkidle');
  78  |     await expect(page).toHaveURL(/\/history/);
  79  |     await page.waitForTimeout(TIMEOUT_WAIT_DATA);
  80  | 
  81  |     // Step 3: Filter by Geta
  82  |     await page.getByLabel('Karyawan').selectOption({ label: 'Geta' });
  83  |     await page.waitForTimeout(1500);
  84  | 
  85  |     // Step 4: Click task to open detail modal
  86  |     const taskButton = page.locator('tbody tr').first().locator('td').nth(2).locator('button');
  87  |     if (await taskButton.isVisible()) {
  88  |       await taskButton.click();
  89  |       await page.waitForTimeout(1500);
  90  | 
  91  |       const modal = page.locator('[role="dialog"]');
  92  |       await expect(modal).toBeVisible();
  93  | 
  94  |       // Step 5: Update progress
  95  |       await modal.locator('button', { hasText: 'Update Progress' }).click();
  96  |       await page.waitForTimeout(500);
  97  | 
  98  |       const phaseSelect = modal.locator('select').nth(0);
  99  |       const statusSelect = modal.locator('select').nth(1);
  100 |       const dateInput = modal.locator('input[type="date"]');
  101 | 
  102 |       await expect(phaseSelect).toBeVisible();
  103 |       await expect(statusSelect).toBeVisible();
  104 |       await expect(dateInput).toBeVisible();
  105 | 
  106 |       await phaseSelect.selectOption('QA');
  107 |       await page.waitForTimeout(300);
  108 |       await statusSelect.selectOption('Completed');
  109 |       await page.waitForTimeout(300);
  110 | 
  111 |       const tomorrow = new Date();
  112 |       tomorrow.setDate(tomorrow.getDate() + 2);
  113 |       const y = tomorrow.getFullYear();
  114 |       const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
  115 |       const d = String(tomorrow.getDate()).padStart(2, '0');
  116 |       await dateInput.fill(`${y}-${m}-${d}`);
  117 |       await page.waitForTimeout(300);
  118 | 
  119 |       await modal.locator('button', { hasText: 'Simpan Progress' }).click();
  120 |       await page.waitForTimeout(3000);
  121 | 
  122 |       const successToast = page.locator('text=Progress berhasil diperbarui');
  123 |       const successVisible = await successToast.isVisible().catch(() => false);
  124 |       console.log('Update progress success:', successVisible);
  125 |     }
  126 |   });
  127 | });
  128 | 
```