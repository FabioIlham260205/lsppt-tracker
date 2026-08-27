# LSPPT Tracker

Laporan Status Progress Pekerjaan Karyawan

## Halaman Submit (`/submit`)

### Isi Informasi Umum
1. Pilih **Employee** dari dropdown
2. Pilih **Tanggal**

### Tambah Task
1. Isi **Task Title**
2. Isi **ClickUp URL** → Task ID terisi otomatis
3. Pilih **Phase** (TS / QA)
4. Pilih **Status** sesuai phase
5. Klik **+ Add Task**
6. Ulangi untuk task lainnya
7. Klik **Save LSPPT** untuk menyimpan

### Kelola Karyawan
- Klik **⚙ Kelola Karyawan**
- **Tambah**: klik **+ Tambah Karyawan** → isi nama → Simpan
- **Edit**: klik **Edit** pada daftar → ubah nama → Simpan
- **Hapus**: klik **Edit** → **Hapus Karyawan** (hanya jika belum punya task)

---

## Halaman History (`/history`)

### Filter
- Filter by **Karyawan**, **rentang tanggal**, atau **kata kunci**
- Quick filter: Minggu Ini, Bulan Ini, Tahun Ini, Semua
- Klik **Reset Filter** untuk menghapus semua filter

### Lihat Detail Task
- Klik **nama task** di tabel → modal detail terbuka
- Tampilkan: karyawan, phase, status, timeline progress

### Update Progress
- Di modal detail, klik **Update Progress**
- Pilih **Phase**, **Status**, **Tanggal**
- Klik **Simpan Progress**

### Export Excel
- Klik **Export Excel** → file `.xlsx` terunduh

---

### Tech Stack

- Backend: NestJS 11 + Prisma + PostgreSQL 16
- Frontend: React 19 + Vite + Tailwind CSS 4
- Testing: Jest (backend) + Vitest (frontend)

### Cara Menjalankan

1. Pastikan Docker sudah terinstall
2. Jalankan:
   ```bash
   docker compose -f docker-compose.dev.yml up -d
3. Buka http://localhost:5173
Database
#### Reset database + seed
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate reset --force

#### Seed ulang
docker compose -f docker-compose.dev.yml exec backend npx prisma db seed