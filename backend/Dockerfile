# Development image — source code di-inject via bind mount,
# jadi perubahan code TIDAK butuh rebuild image.
FROM node:22-alpine

WORKDIR /app

# openssl untuk kebutuhan Prisma engine di Alpine (tahap database)
RUN apk add --no-cache openssl

EXPOSE 3000

# Dependency di-install saat container start (lihat docker-compose.dev.yml):
# menambah/mengubah package.json cukup restart container, tanpa rebuild image.
CMD ["sh", "-c", "npm install --no-audit --no-fund && npm run start:dev"]
