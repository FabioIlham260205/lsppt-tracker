# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: submit.spec.js >> Submit Page - Form & Employee CRUD >> TC-SUB-001: Page load & initial render
- Location: tests\submit.spec.js:21:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Belum ada task')
Expected: visible
Error: strict mode violation: locator('text=Belum ada task') resolved to 2 elements:
    1) <p class="text-sm font-medium text-slate-700">Belum ada task</p> aka getByText('Belum ada task', { exact: true })
    2) <p class="text-xs text-slate-500">Belum ada task yang ditambahkan.</p> aka getByText('Belum ada task yang')

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Belum ada task')

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - banner [ref=e5]:
    - generic [ref=e6]:
      - heading "LSPPT Tracker" [level=1] [ref=e7]
      - paragraph [ref=e8]: Laporan Status Progress Pekerjaan Karyawan
    - link "Lihat History →" [ref=e9] [cursor=pointer]:
      - /url: /history
  - generic [ref=e10]:
    - heading "Informasi Umum" [level=2] [ref=e11]
    - generic [ref=e12]:
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]: Employee
          - combobox "Employee" [ref=e16]:
            - option "Pilih karyawan" [selected]
            - option "Geta"
            - option "Arifin"
            - option "Lundy"
        - button "⚙ Kelola Karyawan" [ref=e17]
      - generic [ref=e18]:
        - generic [ref=e19]: Tanggal
        - textbox "Tanggal" [ref=e20]
  - generic [ref=e21]:
    - heading "Tambah Task" [level=2] [ref=e22]
    - generic [ref=e23]:
      - generic [ref=e25]:
        - generic [ref=e26]: Task Title
        - textbox "Task Title" [ref=e27]:
          - /placeholder: "Contoh: CTMS - Issue List Report"
      - generic [ref=e28]:
        - generic [ref=e29]: ClickUp URL
        - textbox "ClickUp URL" [ref=e30]:
          - /placeholder: https://app.clickup.com/t/9003006723/86d41c8ur
      - generic [ref=e31]:
        - generic [ref=e32]: ClickUp Task ID
        - textbox "ClickUp Task ID" [ref=e33]:
          - /placeholder: Otomatis terisi dari URL
      - generic [ref=e34]:
        - generic [ref=e35]: Phase
        - combobox "Phase" [ref=e36]:
          - option "Pilih phase" [selected]
          - option "TS"
          - option "QA"
      - generic [ref=e37]:
        - generic [ref=e38]: Status
        - combobox "Status" [disabled] [ref=e39]:
          - option "Pilih phase terlebih dahulu" [selected]
    - button "+ Add Task" [ref=e41]
  - generic [ref=e42]:
    - heading "Daftar Task (0)" [level=2] [ref=e44]
    - generic [ref=e46]:
      - paragraph [ref=e49]: Belum ada task
      - paragraph [ref=e50]: Isi form di atas lalu klik “+ Add Task” untuk menambahkan task ke daftar.
    - generic [ref=e51]:
      - paragraph [ref=e52]: Belum ada task yang ditambahkan.
      - button "Save LSPPT" [ref=e53]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const API = 'http://localhost:3000/api';
  4   | const SUBMIT_URL = '/submit';
  5   | const TIMEOUT_WAIT = 8000;
  6   | 
  7   | // ── Setup: cleanup test data ──────────────────────────────
  8   | test.beforeAll(async ({ request }) => {
  9   |   const res = await request.get(`${API}/history`);
  10  |   const { data = [] } = await res.json();
  11  |   for (const row of data) {
  12  |     if (row.clickup_task_id === '86d412pzq') {
  13  |       await request.delete(`${API}/tasks/${row.task_id}`);
  14  |     }
  15  |   }
  16  | });
  17  | 
  18  | test.describe('Submit Page - Form & Employee CRUD', () => {
  19  | 
  20  |   // ── TC-SUB-001 ──────────────────────────────────────────
  21  |   test('TC-SUB-001: Page load & initial render', async ({ page }) => {
  22  |     await page.goto(SUBMIT_URL);
  23  |     await page.waitForLoadState('networkidle');
  24  | 
  25  |     await expect(page.locator('h1')).toHaveText('LSPPT Tracker');
  26  |     await expect(page.locator('text=Laporan Status Progress Pekerjaan Karyawan')).toBeVisible();
  27  |     await expect(page.locator('a', { hasText: 'Lihat History' })).toBeVisible();
  28  |     await expect(page.locator('a', { hasText: 'Lihat History' })).toHaveAttribute('href', '/history');
  29  | 
  30  |     await expect(page.locator('label', { hasText: 'Employee' })).toBeVisible();
  31  |     await expect(page.locator('label', { hasText: 'Tanggal' })).toBeVisible();
  32  |     await expect(page.locator('button', { hasText: /Kelola Karyawan/ })).toBeVisible();
  33  | 
  34  |     await expect(page.locator('label', { hasText: 'Task Title' })).toBeVisible();
  35  |     await expect(page.locator('label', { hasText: 'ClickUp URL' })).toBeVisible();
  36  |     await expect(page.locator('label', { hasText: 'ClickUp Task ID' })).toBeVisible();
  37  |     await expect(page.locator('label', { hasText: 'Phase' })).toBeVisible();
  38  |     await expect(page.locator('label', { hasText: 'Status' })).toBeVisible();
  39  |     await expect(page.locator('button', { hasText: '+ Add Task' })).toBeVisible();
  40  |     await expect(page.locator('button', { hasText: 'Save LSPPT' })).toBeVisible();
  41  | 
  42  |     await expect(page.locator('text=Daftar Task')).toBeVisible();
> 43  |     await expect(page.locator('text=Belum ada task')).toBeVisible();
      |                                                       ^ Error: expect(locator).toBeVisible() failed
  44  |   });
  45  | 
  46  |   // ── TC-SUB-002 ──────────────────────────────────────────
  47  |   test('TC-SUB-002: Form submission — add task & save', async ({ page }) => {
  48  |     await page.goto(SUBMIT_URL);
  49  |     await page.waitForLoadState('networkidle');
  50  | 
  51  |     await page.getByLabel('Employee').selectOption({ label: 'Lundy' });
  52  |     await page.getByLabel('Tanggal').fill('2026-09-30');
  53  |     await page.getByLabel('Task Title').fill('PEER PRD - ACME - Report template (docx) for Excavation');
  54  |     await page.getByLabel('ClickUp URL').fill('https://app.clickup.com/t/9003006723/86d412pzq');
  55  |     await expect(page.getByLabel('ClickUp Task ID')).toHaveValue('86d412pzq');
  56  | 
  57  |     await page.getByLabel('Phase').selectOption({ value: 'TS' });
  58  |     await expect(page.getByLabel('Status')).toBeEnabled();
  59  |     await page.getByLabel('Status').selectOption({ label: 'Completed' });
  60  | 
  61  |     await page.getByRole('button', { name: '+ Add Task' }).click();
  62  | 
  63  |     await expect(page.getByText('PEER PRD - ACME - Report template (docx) for Excavation')).toBeVisible();
  64  |     await expect(page.getByText('86d412pzq', { exact: true })).toBeVisible();
  65  | 
  66  |     const saveButton = page.getByRole('button', { name: 'Save LSPPT' });
  67  |     await expect(saveButton).toBeEnabled();
  68  |     await saveButton.click();
  69  | 
  70  |     const toast = page.getByRole('alert');
  71  |     await expect(toast).toBeVisible({ timeout: 10000 });
  72  |     await expect(toast).toContainText('Berhasil');
  73  |   });
  74  | 
  75  |   // ── TC-SUB-003 ──────────────────────────────────────────
  76  |   test('TC-SUB-003: Add karyawan via modal', async ({ page }) => {
  77  |     await page.goto(SUBMIT_URL);
  78  |     await page.waitForLoadState('networkidle');
  79  | 
  80  |     const empsRes = await page.evaluate(async () => {
  81  |       const res = await fetch('http://localhost:3000/api/employees');
  82  |       return res.json();
  83  |     });
  84  |     const argi = empsRes.data?.find((e) => e.name === 'Argi');
  85  |     if (argi) {
  86  |       await page.evaluate((id) =>
  87  |         fetch(`http://localhost:3000/api/employees/${id}`, { method: 'DELETE' })
  88  |       , argi.id);
  89  |     }
  90  | 
  91  |     await page.getByRole('button', { name: /Kelola Karyawan/ }).click();
  92  |     await page.getByRole('button', { name: '+ Tambah Karyawan' }).click();
  93  |     await page.getByLabel('Nama Karyawan').fill('Argi');
  94  |     await page.getByRole('button', { name: 'Simpan' }).click();
  95  | 
  96  |     const toast = page.getByRole('alert');
  97  |     await expect(toast).toBeVisible({ timeout: 10000 });
  98  |     await expect(toast).toContainText('Berhasil');
  99  |   });
  100 | 
  101 |   // ── TC-SUB-004 ──────────────────────────────────────────
  102 |   test('TC-SUB-004: Delete karyawan via confirm modal', async ({ page }) => {
  103 |     await page.goto(SUBMIT_URL);
  104 |     await page.waitForLoadState('networkidle');
  105 | 
  106 |     const empsRes = await page.evaluate(async () => {
  107 |       const res = await fetch('http://localhost:3000/api/employees');
  108 |       return res.json();
  109 |     });
  110 |     const argi = empsRes.data?.find((e) => e.name === 'Argi');
  111 |     if (!argi) {
  112 |       await page.evaluate(async () => {
  113 |         await fetch('http://localhost:3000/api/employees', {
  114 |           method: 'POST',
  115 |           headers: { 'Content-Type': 'application/json' },
  116 |           body: JSON.stringify({ name: 'Argi' }),
  117 |         });
  118 |       });
  119 |     }
  120 | 
  121 |     await page.getByRole('button', { name: /Kelola Karyawan/ }).click();
  122 | 
  123 |     const argiRow = page.getByRole('row', { name: /Argi/ });
  124 |     await expect(argiRow).toBeVisible();
  125 |     await argiRow.getByRole('button', { name: 'Edit' }).click();
  126 | 
  127 |     await page.getByRole('button', { name: 'Hapus Karyawan' }).click();
  128 | 
  129 |     const confirmModal = page.getByRole('dialog', { name: 'Hapus Karyawan' });
  130 |     await expect(confirmModal).toBeVisible();
  131 |     await expect(confirmModal).toContainText('Argi');
  132 |     await confirmModal.getByRole('button', { name: 'Hapus' }).click();
  133 | 
  134 |     const toast = page.getByRole('alert');
  135 |     await expect(toast).toBeVisible({ timeout: 10000 });
  136 |     await expect(toast).toContainText('Berhasil');
  137 | 
  138 |     await expect(page.getByRole('row', { name: /Argi/ })).toHaveCount(0);
  139 |   });
  140 | });
  141 | 
```