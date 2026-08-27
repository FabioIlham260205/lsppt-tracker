# Laporan Setup Unit Testing - Frontend LSPPT Tracker

## Ringkasan

Berhasil melakukan setup unit testing pada project **LSPPT Tracker Frontend** menggunakan **Vitest** + **React Testing Library**. Total **26 test cases** dibuat dan semuanya berhasil pass.

---

## Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|---|---|---|
| Vitest | v4.1.11 | Test runner (menggantikan Jest, lebih cepat untuk Vite) |
| @testing-library/react | - | Render & interaksi komponen React |
| @testing-library/jest-dom | - | Custom matcher DOM (toBeInTheDocument, dll) |
| @testing-library/user-event | - | Simulasi interaksi user (klik, ketik, select) |
| jsdom | - | Environment browser virtual untuk testing |

---

## File yang Diubah/Dibuat

### File Konfigurasi

| File | Status | Keterangan |
|---|---|---|
| `package.json` | Diubah | Menambah dependencies testing + script `test` & `test:run` |
| `vite.config.js` | Diubah | Menambah blok `test` (environment, setup file, globals) |
| `src/test-setup.js` | Baru | Setup file untuk import jest-dom matchers |

### File Test

| File | Jumlah Test | Tipe |
|---|---|---|
| `src/components/ui/__tests__/Button.test.jsx` | 11 | Unit test komponen |
| `src/components/ui/__tests__/Input.test.jsx` | 9 | Unit test komponen |
| `src/pages/__tests__/SubmitPage.test.jsx` | 6 | Integrasi test halaman |

---

## Detail Test Cases

### Button Component (11 tests)

| # | Test | Keterangan |
|---|---|---|
| 1 | renders children text | Button menampilkan teks anak |
| 2 | calls onClick when clicked | Fungsi onClick terpanggil saat diklik |
| 3 | is disabled when disabled prop | Button tidak aktif saat prop disabled |
| 4 | is disabled and shows spinner when loading | Button nonaktif + menampilkan spinner saat loading |
| 5 | does not call onClick when disabled | onClick tidak terpanggil saat disabled |
| 6 | does not call onClick when loading | onClick tidak terpanggil saat loading |
| 7 | renders with default primary variant | Variant default adalah primary (biru) |
| 8 | renders outline variant | Variant outline berhasil dirender |
| 9 | renders danger variant | Variant danger (merah) berhasil dirender |
| 10 | applies custom className | CSS kustom diterapkan dengan benar |
| 11 | passes through additional props | Props tambahan (type, data-testid) diteruskan |

### Input Component (9 tests)

| # | Test | Keterangan |
|---|---|---|
| 1 | renders without label | Input tanpa label dirender dengan benar |
| 2 | renders with label | Input dengan label ditampilkan |
| 3 | associates label with input | Label terhubung ke input via htmlFor |
| 4 | calls onChange when typing | Fungsi onChange terpanggil saat mengetik |
| 5 | displays error message | Pesan error ditampilkan |
| 6 | applies error styling | Style error (border merah) diterapkan |
| 7 | applies normal styling | Style normal (border abu-abu) diterapkan |
| 8 | supports custom id | ID kustom diterapkan ke input |
| 9 | passes through additional props | Props tambahan diteruskan |

### SubmitPage (6 tests)

| # | Test | Keterangan |
|---|---|---|
| 1 | shows loading initially | Loading spinner muncul saat data dimuat |
| 2 | renders form after loading | Form lengkap muncul setelah loading selesai |
| 3 | shows empty state when no tasks | Empty state muncul jika belum ada task |
| 4 | shows validation errors on save | Toast error muncul saat save tanpa data |
| 5 | adds a task to the list | Task berhasil ditambahkan ke daftar |
| 6 | removes a task from the list | Task berhasil dihapus dari daftar |

---

## Perintah yang Tersedia

```bash
npm test          # Menjalankan test dalam mode watch (otomatis rerun saat file berubah)
npm run test:run  # Menjalankan test sekali saja (untuk CI/CD)
```

---

## Konvensi Naming yang Diterapkan

### Struktur File Test

```
src/
├── components/ui/
│   ├── Button.jsx
│   └── __tests__/
│       └── Button.test.jsx      # Test file di folder __tests__
├── pages/
│   ├── SubmitPage.jsx
│   └── __tests__/
│       └── SubmitPage.test.jsx
```

### Penamaan Test

```javascript
describe('NamaKomponen', () => {
  it('should deskripsi perilaku yang diharapkan', () => {
    // Arrange → Act → Assert
  });
});
```

---

## Hasil Akhir

```
 Test Files  3 passed (3)
      Tests  26 passed (26)
   Duration  5.23s
```

Semua test berhasil pass tanpa error.
