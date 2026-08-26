# Docker Development Selesai

## 1. Status Development

Docker development environment berhasil dijalankan dengan **3 container**.

| Container        | Status  |   Port |
| ---------------- | ------- | -----: |
| `lsppt-postgres` | healthy | `5432` |
| `lsppt-backend`  | running | `3000` |
| `lsppt-frontend` | running | `5173` |

---

## 2. Hot Reload Terbukti

| Service        | Mekanisme                                    | Status              |
| -------------- | -------------------------------------------- | ------------------- |
| NestJS Backend | Webpack polling `1000` + `--watch --webpack` | ✅ Auto-recompile    |
| Vite Frontend  | `CHOKIDAR_USEPOLLING=true`                   | ✅ HMR via WebSocket |

### Catatan Backend

`nest start --watch` menggunakan mode **TypeScript compiler (tsc)** tidak mendeteksi perubahan file dengan baik pada Docker Desktop Windows menggunakan bind mount.

Solusi yang digunakan:

* NestJS menggunakan **Webpack mode**
* Webpack menggunakan **explicit polling**
* Polling interval: `1000ms`

Dengan konfigurasi tersebut, perubahan source code di host akan terdeteksi dan backend melakukan **auto-recompile**.

---

## 3. Struktur File

```text
├── docker-compose.dev.yml          # Orchestration 3 services
├── .env                            # Variabel environment
├── .env.example                    # Template environment
├── .gitignore                      # node_modules, .env, dist
│
├── backend/
│   ├── Dockerfile                  # Node 22-alpine + openssl
│   ├── package.json                # NestJS + webpack + ts-loader
│   ├── tsconfig.json
│   ├── nest-cli.json               # Webpack mode
│   ├── webpack.config.js           # Polling: 1000ms
│   │
│   └── src/
│       ├── main.ts                 # Bootstrap + global prefix /api
│       ├── app.module.ts
│       └── app.controller.ts       # GET /api + /health
│
└── frontend/
    ├── Dockerfile                  # Node 22-alpine
    ├── package.json                # React 19 + Vite 6
    ├── vite.config.js              # host: true, poll, port 5173
    ├── index.html
    │
    └── src/
        ├── main.jsx
        └── App.jsx                 # VITE_API_URL
```

---

## 4. Cara Menjalankan

### Start Development

```bash
docker compose -f docker-compose.dev.yml up -d
```

### Rebuild Container

Gunakan ketika terdapat perubahan pada `Dockerfile`, `package.json`, atau konfigurasi build:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

### Stop Development

```bash
docker compose -f docker-compose.dev.yml down
```

### Melihat Log Backend

```bash
docker compose -f docker-compose.dev.yml logs -f backend
```

### Melihat Log Semua Service

```bash
docker compose -f docker-compose.dev.yml logs -f
```

---

## 5. Kesimpulan

Environment Docker untuk **development** sudah berhasil:

* ✅ PostgreSQL berjalan dan healthy
* ✅ NestJS backend berjalan di port `3000`
* ✅ React + Vite frontend berjalan di port `5173`
* ✅ Backend memiliki auto-recompile
* ✅ Frontend memiliki HMR
* ✅ Bind mount Windows sudah dapat mendeteksi perubahan file
* ✅ Environment sudah dipisahkan menggunakan `.env`
* ✅ Struktur project siap dilanjutkan ke tahap pengembangan aplikasi