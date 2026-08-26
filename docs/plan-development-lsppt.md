# Plan Development LSPPT

## 0. Final Stack

- Frontend: React + Vite
- UI: Tailwind CSS
- Backend: NestJS
- ORM: Prisma
- Database: PostgreSQL
- Excel: ExcelJS
- Development: Docker Compose + Hot Reload
- Production: Docker Compose + Nginx
- Repository: GitHub

### Arsitektur


```text
React + Vite
     ↓
REST API
     ↓
NestJS
     ↓
Prisma
     ↓
PostgreSQL
```

---

## 1. Project Planning

### Repository

```text
lsppt/
├── backend/
├── frontend/
├── docs/
├── docker/
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── .gitignore
└── README.md
```

### Dokumentasi

```text
docs/
├── api-contract.md
└── erd.dbml
```

API Contract dan ERD menjadi acuan seluruh tim.

---

## 2. Git Workflow

```text
main
└── develop
    ├── feature/backend
    ├── feature/submit
    └── feature/history
```

Workflow:

```text
Feature branch
      ↓
Pull Request
      ↓
develop
      ↓
Testing
      ↓
main
```

Jangan langsung push ke `main`.

---

## 3. Docker Development

Buat `docker-compose.dev.yml`.

Container:

```text
React + Vite
    ↓
NestJS
    ↓
PostgreSQL
```

Development menggunakan:

- Bind mount
- Hot reload NestJS
- Vite HMR

Perubahan source code tidak perlu rebuild image.

---

## 4. Backend Setup

Gunakan NestJS.

Struktur awal:

```text
backend/
├── src/
│   ├── employees/
│   ├── lsppt/
│   ├── tasks/
│   ├── history/
│   └── common/
├── prisma/
├── package.json
└── Dockerfile
```

Library utama:

- NestJS
- Prisma
- PostgreSQL Client
- class-validator
- class-transformer
- ExcelJS

---

## 5. Database

Implementasikan ERD:

```text
employees
     │
     ▼
tasks
     │
     ▼
task_progress
```

Gunakan Prisma:

```text
Prisma Schema
      ↓
Migration
      ↓
PostgreSQL
```

Seed employee:

- Geta
- Arifin
- Lundy

---

## 6. Backend API

Implementasikan sesuai API Contract.

Urutan:

### Employees

```http
GET /api/employees
```

### Phase & Status

```http
GET /api/phases
```

### Submit

```http
POST /api/lsppt
```

Logic:

```text
Request
 ↓
Validation
 ↓
Find/Create Task
 ↓
Create Task Progress
 ↓
Transaction
 ↓
Response
```

### History

```http
GET /api/history
```

### Task History

```http
GET /api/tasks/:id/history
```

### Export

```http
GET /api/history/export
```

---

## 7. Backend Testing

Test menggunakan Postman/Insomnia:

```text
✓ GET employees
✓ GET phases
✓ POST LSPPT
✓ Multiple tasks
✓ Same task next day
✓ Duplicate task
✓ Invalid phase
✓ Invalid status
✓ History filter
✓ Task history
✓ Excel export
```

Backend dianggap siap jika API sudah stabil dan sesuai API Contract.

---

## 8. Frontend Setup

Gunakan React + Vite.

Struktur:

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── SubmitLSPPT/
│   │   └── History/
│   ├── services/
│   ├── hooks/
│   └── App.jsx
├── package.json
└── Dockerfile
```

Library:

- React
- Vite
- Tailwind CSS
- React Router
- Axios

---

## 9. UI Components

Buat reusable components:

```text
Button
Input
Select
DatePicker
Modal
Table
Badge
Toast
Loading
EmptyState
```

Orang 2 membuat komponen dasar agar Orang 3 dapat menggunakannya kembali.

---

## 10. Submit LSPPT

Halaman:

```text
/submit
```

Flow:

```text
Employee
    ↓
Date
    ↓
Task Form
    ↓
Phase
    ↓
Status
    ↓
+ Add Task
    ↓
Task List
    ↓
Save LSPPT
```

API:

```text
GET /api/employees
GET /api/phases
POST /api/lsppt
```

---

## 11. History

Halaman:

```text
/history
```

Fitur:

```text
Employee filter
From date
To date
Search
History table
```

API:

```text
GET /api/history
```

---

## 12. Task Progress

Ketika task diklik:

```text
CTMS Issue Report

21 Aug
QA → Plan

22 Aug
QA → On Queue Testing

23 Aug
QA → Testing

24 Aug
QA → Completed Testing
```

API:

```http
GET /api/tasks/:id/history
```

---

## 13. Export Excel

Backend menggunakan ExcelJS.

Frontend menyediakan:

```text
[ Export Excel ]
```

Request:

```text
GET /api/history/export
```

Export mengikuti filter:

```text
Employee
From
To
```

---

## 14. Frontend ↔ Backend Integration

Gunakan environment variable:

```text
VITE_API_URL=http://localhost:3000/api
```

Flow:

```text
React
  ↓
HTTP
  ↓
NestJS
  ↓
Prisma
  ↓
PostgreSQL
```

Jangan hardcode URL API di component.

---

## 15. Integration Testing

### Case 1 — Submit

```text
Geta
21 Aug
3 tasks
    ↓
Save
    ↓
Database
```

### Case 2 — Hari berikutnya

```text
Geta
22 Aug
Task yang sama
Status berbeda
```

Pastikan:

```text
21 Aug → status lama
22 Aug → status baru
```

### Case 3 — Duplicate

Task sama + tanggal sama:

```text
→ 409 Conflict
```

### Case 4 — Invalid Status

```text
TS + Testing
```

Harus ditolak.

---

## 16. UI/UX Testing

Periksa:

```text
✓ Loading state
✓ Empty history
✓ Error API
✓ Success notification
✓ Form validation
✓ Date validation
✓ Responsive layout
✓ Table overflow
✓ Task history
```

---

## 17. Production Docker

Buat:

```text
docker-compose.prod.yml
```

Production:

```text
React
 ↓
Build
 ↓
Nginx

NestJS
 ↓
Node.js production

PostgreSQL
 ↓
Docker Volume
```

Production tidak menggunakan:

```text
✗ Hot reload
✗ Bind mount source
✗ Development dependency
```

---

## 18. Production Deployment

Flow:

```text
Developer
    ↓
Git Push
    ↓
GitHub
    ↓
Production Server
    ↓
Git Pull
    ↓
Docker Compose Build
    ↓
Docker Compose Up
    ↓
Application
```

Command:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 19. Production Configuration

Sebelum production:

```text
✓ Environment variables
✓ Database password
✓ CORS
✓ Production API URL
✓ PostgreSQL volume
✓ Error handling
✓ No secrets in Git
✓ .gitignore
```

Authentication belum diperlukan untuk MVP.

---

## 20. Final Acceptance Test

### Submit

```text
✓ Pilih employee
✓ Pilih tanggal
✓ Tambah task
✓ Phase
✓ Status otomatis
✓ Multiple task
✓ Save
```

### History

```text
✓ Filter employee
✓ Filter tanggal
✓ Search
✓ Tampilkan history
```

### Task History

```text
✓ Klik task
✓ Timeline progress
✓ History tidak berubah
```

### Export

```text
✓ Excel
✓ Filter sesuai
✓ Data benar
```

### System

```text
✓ Docker development
✓ Hot reload
✓ Production build
✓ Database persistent
```

---

## 21. Pembagian Tim

| Tahap | Orang 1 | Orang 2 | Orang 3 |
|---|---|---|---|
| Setup | Backend | Frontend | Frontend |
| Database | ✓ | | |
| API | ✓ | | |
| UI Components | | ✓ | |
| Submit | | ✓ | |
| History | | | ✓ |
| Task Timeline | | | ✓ |
| Excel Backend | ✓ | | |
| Excel Integration | | | ✓ |
| Integration Test | ✓ | ✓ | ✓ |
| Deployment | ✓ | | Bantuan |

---

## 22. Urutan Pengerjaan

```text
01. GitHub Repository
        ↓
02. Project Structure
        ↓
03. Docker Development
        ↓
04. NestJS Setup
        ↓
05. React + Vite Setup
        ↓
06. PostgreSQL + Prisma
        ↓
07. Prisma Migration
        ↓
08. Backend Employees API
        ↓
09. Backend Phase API
        ↓
10. Backend Submit API
        ↓
11. Backend History API
        ↓
12. Backend Task History API
        ↓
13. Backend Excel Export
        ↓
14. Frontend Submit
        ↓
15. Frontend History
        ↓
16. Frontend Task Timeline
        ↓
17. Frontend API Integration
        ↓
18. Integration Testing
        ↓
19. Production Docker
        ↓
20. Deployment
        ↓
21. Final Testing
        ↓
      DONE
```

## Current Position

API Contract: **✓**  
ERD: **✓**  
Next step: **Project Setup + Docker Development Environment**
