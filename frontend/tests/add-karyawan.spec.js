import { test, expect } from '@playwright/test';

test('Manage employee', async ({ page }) => {
    await page.goto('/submit', { waitUntil: 'networkidle' });

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
