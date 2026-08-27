import { test, expect } from '@playwright/test';

const API = 'http://localhost:3000/api';

test('Delete employee - hapus karyawan Argi', async ({ page }) => {
  await page.goto('/submit', { waitUntil: 'networkidle' });

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

  const toast = page.getByRole('alert');
  await expect(toast).toBeVisible({ timeout: 10000 });
  await expect(toast).toContainText('Berhasil');

  await expect(page.getByRole('row', { name: /Argi/ })).toHaveCount(0);
});
