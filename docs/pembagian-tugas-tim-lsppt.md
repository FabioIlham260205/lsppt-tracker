# Pembagian Tugas Tim — LSPPT MVP

## Tim 3 Orang

| Anggota | Role | Fokus |
|---|---|---|
| Obit    | Backend Developer | NestJS, Prisma, PostgreSQL, API |
| Fabio    | Frontend Developer | React + Vite, Submit LSPPT, UI Components |
| Bagas   | Frontend Developer | React + Vite, History, Timeline, Testing |

## Obit  — Backend & Database

### Setup
- [ ] Setup NestJS
- [ ] Setup Prisma
- [ ] Setup PostgreSQL
- [ ] Setup Docker backend
- [ ] Setup environment variables

### Database
- [ ] Implementasi ERD ke Prisma Schema
- [ ] Migration database
- [ ] Seed employee
- [ ] Relationship Employee → Task → Task Progress
- [ ] Unique constraint `task_id + date`

### API
- [ ] `GET /api/employees`
- [ ] `GET /api/phases`
- [ ] `POST /api/lsppt`
- [ ] `GET /api/history`
- [ ] `GET /api/tasks/:id/history`
- [ ] `GET /api/history/export`

### Business Logic
- [ ] Validasi Phase & Status
- [ ] Find/Create Task berdasarkan ClickUp Task ID
- [ ] Simpan Task Progress harian
- [ ] Duplicate handling
- [ ] Database transaction
- [ ] Error handling

### Export
- [ ] Implementasi ExcelJS
- [ ] Filter export berdasarkan Employee & Date
- [ ] Generate `.xlsx`

### Testing
- [ ] Test seluruh API menggunakan Postman
- [ ] Pastikan API sesuai API Contract

## Fabio — Frontend Submit & UI Components

### Setup
- [x] Setup React + Vite
- [x] Setup Tailwind CSS
- [x] Setup React Router
- [x] Setup Axios
- [x] Setup Docker frontend
- [x] Setup environment variables

### UI Components
- [x] Button
- [x] Input
- [x] Select
- [x] DatePicker
- [x] Modal
- [x] Table
- [x] Badge
- [x] Toast
- [x] Loading
- [x] Empty State

### Submit LSPPT
- [x] Halaman `/submit`
- [x] Employee dropdown
- [x] Date picker
- [x] Task Title
- [x] ClickUp URL
- [x] ClickUp Task ID
- [x] Phase dropdown
- [x] Dynamic Status dropdown
- [x] `+ Add Task`
- [x] Task list
- [x] Remove task
- [x] Save LSPPT
- [x] Success/error notification

### API Integration

- [x] Integrasi `/employees`
- [x] Integrasi `/phases`
- [x] Integrasi `/lsppt`

## Bagas — Frontend History & Testing

### History
- [x] Halaman `/history`
- [x] Employee filter
- [x] From date
- [x] To date
- [x] Search
- [x] History table
- [x] Loading state
- [x] Empty state
- [x] Error state

### Task Progress
- [x] Task clickable
- [x] Task detail
- [x] Progress timeline
- [x] Tampilkan perubahan Phase/Status per tanggal
- [x] Integrasi `/tasks/:id/history`

### Export
- [x] Tombol Export Excel
- [x] Kirim filter Employee & Date
- [x] Download file `.xlsx`
- [x] Integrasi `/history/export`

### Integration Testing
- [ ] Test Submit → Database → History
- [ ] Test task yang sama pada tanggal berbeda
- [ ] Test duplicate task
- [ ] Test invalid Phase/Status
- [ ] Test filter History
- [ ] Test Task Timeline
- [ ] Test Export Excel
- [ ] Test responsive UI

## Pembagian Berdasarkan Phase

| Phase | Obit | Fabio | Bagas |
|---|:---:|:---:|:---:|
| Project Setup | ✓ | ✓ | ✓ |
| Docker Development | ✓ | ✓ | ✓ |
| Database | ✓ | | |
| Backend API | ✓ | | |
| API Testing | ✓ | | |
| UI Components | | ✓ | |
| Submit LSPPT | | ✓ | |
| History | | | ✓ |
| Task Timeline | | | ✓ |
| Excel Backend | ✓ | | |
| Excel Integration | | | ✓ |
| Integration Testing | ✓ | ✓ | ✓ |
| Production Docker | ✓ | | |
| Final Testing | ✓ | ✓ | ✓ |
| Deployment | ✓ | | Bantuan |

## Workflow Antar Anggota

```text
                API Contract
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
    Orang 1                   Orang 2 & 3
    Backend                   Frontend
        │                         │
        ▼                         ▼
    NestJS                    React
    Prisma                    Vite
    PostgreSQL                Tailwind
        │                         │
        └────────────┬────────────┘
                     ▼
                Integration
                     ↓
                  Testing
                     ↓
                  Deploy
```

## Aturan Kerja

1. Semua anggota mengikuti `api-contract.md`.
2. Perubahan API harus dikomunikasikan sebelum diubah.
3. Gunakan feature branch.
4. Pull Request masuk ke `develop`.
5. Jangan push langsung ke `main`.
6. Frontend dapat menggunakan mock data selama API belum selesai.
7. Integration dilakukan setelah endpoint terkait sudah tersedia.

## Git Branch

```text
main
└── develop
    ├── feature/backend
    ├── feature/submit
    └── feature/history
```

## Definition of Done

Setiap task dianggap selesai jika:

- [ ] Code selesai
- [ ] Tidak ada error
- [ ] Sesuai API Contract / desain
- [ ] Sudah dites
- [ ] Pull Request dibuat
- [ ] Sudah direview
- [ ] Berhasil diintegrasikan ke `develop`
