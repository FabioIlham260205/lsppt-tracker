# Panduan Testing API dengan Apidog — LSPPT MVP

Panduan eksekusi testing backend LSPPT menggunakan [Apidog](https://apidog.com).
Spesifikasi API tersedia di `docs/openapi.yaml` (OpenAPI 3.0) dan contract aslinya
di `api-contract-lsppt.md`.

---

## 1. Prasyarat

- Docker Compose stack berjalan:

  ```bash
  docker compose -f docker-compose.dev.yml up -d
  ```

- Backend siap di `http://localhost:3000/api`
  (cek cepat: buka `http://localhost:3000/api/health`)

## 2. Import Spec ke Apidog

1. Buka Apidog → **New Project** → beri nama `LSPPT Tracker`
2. Klik **Import Data** (atau ⚙ Settings → Import Data)
3. Pilih format **OpenAPI/Swagger** → tab **File** → upload `docs/openapi.yaml`
   (atau paste isinya lewat tab **Clipboard**)
4. Klik **Import** → semua endpoint + schema + contoh payload ter-import otomatis
5. Base URL `http://localhost:3000/api` sudah terisi otomatis dari field `servers`

> Jika spec diperbarui, ulangi import dan pilih opsi overwrite.

## 3. Checklist Test Case (11 Skenario)

Jalankan **berurutan dari atas ke bawah** karena kasus 03–05 saling membangun data.

| # | Nama Kasus | Request | Expected |
|---|---|---|---|
| 01 | List karyawan | `GET /employees` | `200`, 3 karyawan: Geta, Arifin, Lundy |
| 02 | Phase & status | `GET /phases` | `200`, map TS (5 status) & QA (6 status) |
| 03 | Submit 1 task | `POST /lsppt` | `201`, `{ "message": "LSPPT saved successfully" }` |
| 04 | Submit multi-task | `POST /lsppt` | `201`, semua task tersimpan |
| 05 | Task sama, hari lain | `POST /lsppt` | `201`, progress terpisah per tanggal |
| 06 | Duplicate hari sama | `POST /lsppt` (ulang kasus 03 persis) | `409 Conflict` |
| 07 | Phase tidak valid | `POST /lsppt`, phase `"XX"` | `400` |
| 08 | Status salah untuk phase | `POST /lsppt`, TS + Testing | `400`, `"Invalid status for phase"` |
| 09 | History + filter | `GET /history?employee_id=1&from=...&to=...` | `200`, urut tanggal DESC |
| 10 | History satu task | `GET /tasks/1/history` lalu `/tasks/999/history` | `200` ASC; `404` `"Task not found"` |
| 11 | Export Excel | `GET /history/export?...` | `200`, file `.xlsx` valid |

### Detail Payload

Kasus 03 — submit pertama (simpan sebagai contoh request di Apidog):

```json
{
  "employee_id": 1,
  "date": "2026-08-21",
  "tasks": [
    {
      "title": "CTMS - Issue List Report",
      "clickup_url": "https://app.clickup.com/t/86d43h365",
      "clickup_task_id": "86d43h365",
      "phase": "QA",
      "status": "Plan"
    }
  ]
}
```

Kasus 04 — multi-task dalam satu request:

```json
{
  "employee_id": 2,
  "date": "2026-08-21",
  "tasks": [
    { "title": "eTMF - Document Upload", "clickup_task_id": "86d43h366", "phase": "TS", "status": "In Progress" },
    { "title": "CTMS - Randomization Report", "clickup_task_id": "86d43h367", "phase": "QA", "status": "On Queue Testing" }
  ]
}
```

Kasus 05 — task yang sama dengan kasus 03, tapi `date: "2026-08-22"`
dan status lanjutan (`"Testing"`). Hasil benar = dua baris progress:
21 Aug → Plan, 22 Aug → Testing (verifikasi via kasus 10).

Kasus 07 — phase invalid:

```json
{
  "employee_id": 1,
  "date": "2026-08-23",
  "tasks": [
    { "title": "X", "phase": "XX", "status": "Plan" }
  ]
}
```

Kasus 08 — status tidak sesuai phase:

```json
{
  "employee_id": 1,
  "date": "2026-08-23",
  "tasks": [
    { "title": "X", "phase": "TS", "status": "Testing" }
  ]
}
```

Kasus 10 — verifikasi timeline:

```
GET /tasks/1/history     → 200: [{date:"2026-08-21", phase:"QA", status:"Plan"},
                                  {date:"2026-08-22", phase:"QA", status:"Testing"}]
GET /tasks/9999/history  → 404: { "message": "Task not found" }
```

## 4. Catatan Penting

### Export Excel (kasus 11)

Endpoint `/history/export` mengembalikan binary file. Di Apidog gunakan tombol
**Send** dropdown → **Send and Download**, atau klik **Save response as file**
pada panel response agar `.xlsx` tersimpan utuh. Buka file untuk memastikan
kolom Employee, Date, Task, ClickUp ID, ClickUp URL, Phase, Status terisi benar.

### Data bertahan antar run

Database persisten (Docker volume). Menjalankan ulang kasus 03 tanpa mengubah
tanggal akan menghasilkan `409`. Dua cara reset:

- Ubah `date` pada payload ke tanggal lain, **atau**
- Reset total database:

  ```bash
  docker compose -f docker-compose.dev.yml exec postgres \
    psql -U lsppt -d lsppt_tracker -c \
    "TRUNCATE task_progress, tasks, employees RESTART IDENTITY CASCADE;"
  docker compose -f docker-compose.dev.yml exec backend npx prisma db seed
  ```

### Format error standar

Semua error (termasuk validation error) konsisten berbentuk:

```json
{ "message": "Error description" }
```

## 5. Definisi Selesai

Backend dianggap lolos bila 11/11 test case hijau dan hasil export sesuai filter.
