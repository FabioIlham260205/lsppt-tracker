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
- [ ] Setup React + Vite
- [ ] Setup Tailwind CSS
- [ ] Setup React Router
- [ ] Setup Axios
- [ ] Setup Docker frontend
- [ ] Setup environment variables

### UI Components
- [ ] Button
- [ ] Input
- [ ] Select
- [ ] DatePicker
- [ ] Modal
- [ ] Table
- [ ] Badge
- [ ] Toast
- [ ] Loading
- [ ] Empty State

### Submit LSPPT
- [ ] Halaman `/submit`
- [ ] Employee dropdown
- [ ] Date picker
- [ ] Task Title
- [ ] ClickUp URL
- [ ] ClickUp Task ID
- [ ] Phase dropdown
- [ ] Dynamic Status dropdown
- [ ] `+ Add Task`
- [ ] Task list
- [ ] Remove task
- [ ] Save LSPPT
- [ ] Success/error notification

### API Integration
- [ ] Integrasi `/employees`
- [ ] Integrasi `/phases`
- [ ] Integrasi `/lsppt`

## Bagas — Frontend History & Testing

### History
- [ ] Halaman `/history`
- [ ] Employee filter
- [ ] From date
- [ ] To date
- [ ] Search
- [ ] History table
- [ ] Loading state
- [ ] Empty state
- [ ] Error state

### Task Progress
- [ ] Task clickable
- [ ] Task detail
- [ ] Progress timeline
- [ ] Tampilkan perubahan Phase/Status per tanggal
- [ ] Integrasi `/tasks/:id/history`

### Export
- [ ] Tombol Export Excel
- [ ] Kirim filter Employee & Date
- [ ] Download file `.xlsx`
- [ ] Integrasi `/history/export`

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

| Phase | Orang 1 | Orang 2 | Orang 3 |
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
