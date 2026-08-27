# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: submit.spec.js >> Submit Page - Form & Employee CRUD >> TC-SUB-004: Delete karyawan via confirm modal
- Location: tests\submit.spec.js:102:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog', { name: 'Hapus Karyawan' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('dialog', { name: 'Hapus Karyawan' })

```

```yaml
- banner:
  - heading "LSPPT Tracker" [level=1]
  - paragraph: Laporan Status Progress Pekerjaan Karyawan
  - link "Lihat History →":
    - /url: /history
- heading "Informasi Umum" [level=2]
- text: Employee
- combobox "Employee":
  - option "Pilih karyawan" [selected]
  - option "Geta"
  - option "Arifin"
  - option "Lundy"
- button "⚙ Kelola Karyawan"
- text: Tanggal
- textbox "Tanggal"
- heading "Tambah Task" [level=2]
- text: Task Title
- textbox "Task Title":
  - /placeholder: "Contoh: CTMS - Issue List Report"
- text: ClickUp URL
- textbox "ClickUp URL":
  - /placeholder: https://app.clickup.com/t/9003006723/86d41c8ur
- text: ClickUp Task ID
- textbox "ClickUp Task ID":
  - /placeholder: Otomatis terisi dari URL
- text: Phase
- combobox "Phase":
  - option "Pilih phase" [selected]
  - option "TS"
  - option "QA"
- text: Status
- combobox "Status" [disabled]:
  - option "Pilih phase terlebih dahulu" [selected]
- button "+ Add Task"
- heading "Daftar Task (0)" [level=2]
- img
- paragraph: Belum ada task
- paragraph: Isi form di atas lalu klik “+ Add Task” untuk menambahkan task ke daftar.
- paragraph: Belum ada task yang ditambahkan.
- button "Save LSPPT"
- dialog:
  - heading "Kelola Karyawan" [level=2]
  - button "Close":
    - img
  - table:
    - rowgroup:
      - row "# Nama":
        - columnheader "#"
        - columnheader "Nama"
        - columnheader
    - rowgroup:
      - row "1 Geta Edit":
        - cell "1"
        - cell "Geta"
        - cell "Edit":
          - button "Edit"
      - row "2 Arifin Edit":
        - cell "2"
        - cell "Arifin"
        - cell "Edit":
          - button "Edit"
      - row "3 Lundy Edit":
        - cell "3"
        - cell "Lundy"
        - cell "Edit":
          - button "Edit"
  - button "+ Tambah Karyawan"
```

# Test source

```ts
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
  43  |     await expect(page.locator('text=Belum ada task')).toBeVisible();
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
> 130 |     await expect(confirmModal).toBeVisible();
      |                                ^ Error: expect(locator).toBeVisible() failed
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