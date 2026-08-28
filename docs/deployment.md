# Deployment Guide - LSPPT Tracker

## Prerequisites

- Proxmox VM dengan Ubuntu 22.04/24.04
- Docker & Docker Compose terinstall
- SSH access ke VM
- Git
- Port 80 terbuka (HTTP)

## Step 1: Setup VM (Ubuntu)

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose plugin (sudah include di Docker modern)
docker compose version

# Logout & login lagi supaya group docker aktif
logout
```

## Step 2: Clone Repository

```bash
git clone https://github.com/<username>/lsppt-tracker.git
cd lsppt-tracker
```

## Step 3: Konfigurasi Environment

```bash
cp .env.production .env
nano .env
```

Isi `.env` dengan credentials production:

```env
POSTGRES_USER=lsppt
POSTGRES_PASSWORD=ganti_dengan_password_yang_kuat
POSTGRES_DB=lsppt_tracker
POSTGRES_PORT=5432
VITE_API_URL=/api
```

## Step 4: Build & Jalankan

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Status check:
```bash
docker compose -f docker-compose.prod.yml ps
```

## Step 5: Database Setup

```bash
# Jalankan migration
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed data (opsional - hanya employee)
docker compose -f docker-compose.prod.yml exec backend npx prisma db seed
```

## Step 6: Verifikasi

Buka browser:
```
http://<VM_IP_ADDRESS>
```

Test alur:
1. Buka `/submit` → pilih karyawan → tambah task → save
2. Buka `/history` → verifikasi data muncul

---

## Commands Reference

| Command | Fungsi |
|---|---|
| `docker compose -f docker-compose.prod.yml up -d --build` | Build & jalankan |
| `docker compose -f docker-compose.prod.yml down` | Hentikan semua container |
| `docker compose -f docker-compose.prod.yml logs -f` | Lihat log semua service |
| `docker compose -f docker-compose.prod.yml logs -f backend` | Log backend saja |
| `docker compose -f docker-compose.prod.yml ps` | Cek status container |
| `docker compose -f docker-compose.prod.yml restart backend` | Restart backend |

## Update Code

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

## Reset Database

```bash
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate reset --force
docker compose -f docker-compose.prod.yml exec backend npx prisma db seed
```

---

## Troubleshooting

### Container tidak mau start
```bash
docker compose -f docker-compose.prod.yml logs backend
```

### Database connection refused
- Pastikan postgres container running: `docker compose -f docker-compose.prod.yml ps`
- Cek log postgres: `docker compose -f docker-compose.prod.yml logs postgres`

### Frontend tidak bisa akses API
- Pastikan nginx config benar (proxy /api ke backend:3000)
- Cek log nginx: `docker compose -f docker-compose.prod.yml logs nginx`

### Port 80 sudah terpakai
Ubah port di `docker-compose.prod.yml`:
```yaml
nginx:
  ports:
    - "8080:80"  # ganti ke port lain
```

---

## Architecture (Production)

```
Browser → Nginx (:80)
              ├── /api/*  → Backend (:3000) → PostgreSQL (:5432)
              └── /*      → Static files (frontend build)
```

## File Structure

```
lsppt-tracker/
├── docker-compose.prod.yml    # Production compose
├── nginx.conf                 # Nginx config
├── .env.production            # Environment template
├── backend/
│   ├── Dockerfile.prod        # Multi-stage build backend
│   └── ...
├── frontend/
│   ├── Dockerfile.prod        # Multi-stage build frontend
│   └── ...
└── docs/
    └── deployment.md          # Dokumentasi ini
```
