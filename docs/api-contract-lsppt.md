# API Contract — LSPPT MVP

**Base URL:** `/api`  
**Format:** JSON  
**Auth:** Tidak ada

## 1. Endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/employees` | List karyawan |
| GET | `/phases` | List Phase & Status |
| POST | `/lsppt` | Submit LSPPT |
| GET | `/history` | History progress |
| GET | `/tasks/:id/history` | History satu task |
| GET | `/history/export` | Export Excel |

## 2. GET `/employees`

**Response:**

```json
{
  "data": [
    { "id": 1, "name": "Geta" },
    { "id": 2, "name": "Arifin" },
    { "id": 3, "name": "Lundy" }
  ]
}
```

## 3. GET `/phases`

**Response:**

```json
{
  "data": {
    "TS": [
      "Completed",
      "Documentation",
      "On Hold",
      "In Progress",
      "Plan"
    ],
    "QA": [
      "Completed",
      "Completed Testing",
      "Completed with Feedback",
      "Testing",
      "On Queue Testing",
      "Plan"
    ]
  }
}
```

Status **wajib sesuai Phase**.

## 4. POST `/lsppt`

**Request:**

```json
{
  "employee_id": 1,
  "date": "2026-08-24",
  "tasks": [
    {
      "title": "CTMS - Issue List Report",
      "clickup_url": "https://app.clickup.com/t/86d43h365",
      "clickup_task_id": "86d43h365",
      "phase": "QA",
      "status": "Testing"
    }
  ]
}
```

**Success — `201`:**

```json
{
  "message": "LSPPT saved successfully"
}
```

**Error — `400`:**

```json
{
  "message": "Invalid status for phase"
}
```

Duplicate task pada tanggal yang sama → **`409 Conflict`**.

## 5. GET `/history`

**Query:**

```text
/history?employee_id=1&from=2026-08-01&to=2026-08-31
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "task_id": 3,
      "employee": "Geta",
      "date": "2026-08-21",
      "task": "CTMS - Issue List Report",
      "clickup_task_id": "86d43h365",
      "phase": "QA",
      "status": "Plan"
    }
  ]
}
```

## 6. GET `/tasks/:id/history`

**Request:**

```text
/tasks/3/history
```

**Response:**

```json
{
  "data": [
    {
      "date": "2026-08-21",
      "phase": "QA",
      "status": "Plan"
    },
    {
      "date": "2026-08-22",
      "phase": "QA",
      "status": "Testing"
    },
    {
      "date": "2026-08-23",
      "phase": "QA",
      "status": "Completed Testing"
    }
  ]
}
```

## 7. GET `/history/export`

**Query:**

```text
/history/export?employee_id=1&from=2026-08-01&to=2026-08-31
```

**Response:** `.xlsx`

Kolom:

```text
Employee
Date
Task
ClickUp ID
ClickUp URL
Phase
Status
```

## 8. Standar Error

Gunakan format yang sama untuk semua endpoint:

```json
{
  "message": "Error description"
}
```

## Pegangan Tim

```text
API Contract
     ↓
Backend Go
     ↓
Frontend React
     ↓
Integration Test
```

**Aturan utama:** frontend dan backend harus mengikuti contract ini. Jika ada perubahan endpoint atau format JSON, update contract terlebih dahulu.
