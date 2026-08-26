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