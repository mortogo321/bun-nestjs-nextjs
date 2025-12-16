# Docker Guide

## Quick Start

```bash
# Development
docker compose -f docker/compose.development.yml up --build

# Production
docker compose -f docker/compose.production.yml up -d
```

## Architecture

```
┌─────────────────────────────────────────────┐
│              Docker Network                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │
│  │   API   │  │   Web   │  │    Nginx    │  │
│  │  :8000  │  │  :3000  │  │  :80/:443   │  │
│  └─────────┘  └─────────┘  └─────────────┘  │
└─────────────────────────────────────────────┘
```

## Development

### Features

- Hot reload via volume mounts
- Auto secret generation
- OS detection for native dependencies
- Environment file mounting

### Volume Mounts

| Host | Container | Purpose |
|------|-----------|---------|
| `api/src` | `/app/src` | Source code |
| `api/.env.development` | `/app/.env` | Environment |
| `api/entrypoint.sh` | `/entrypoint.sh` | Startup script |

### Commands

```bash
# View logs
docker compose -f docker/compose.development.yml logs -f api

# Restart service
docker compose -f docker/compose.development.yml restart api

# Clean rebuild
docker compose -f docker/compose.development.yml down -v
docker compose -f docker/compose.development.yml up --build
```

## Production

### With Nginx

```bash
docker compose -f docker/compose.production.yml --profile with-nginx up -d
```

### Resource Limits

| Resource | Limit | Reservation |
|----------|-------|-------------|
| CPU | 1 core | 0.25 core |
| Memory | 512MB | 128MB |

## Entrypoint Features

### API Entrypoint

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Auto-generated if not set |
| `API_KEYS` | Auto-generated if not set |
| `DATABASE_HOST` | Wait for database |
| `RUN_MIGRATIONS` | Run migrations on start |
| `RUN_SEEDERS` | Run seeders on start |
| `GENERATE_KEYS` | Generate RSA keys |

### Secret Generation

In development mode, secrets are auto-generated if not provided:

```
🔐 Checking secrets...
   JWT_SECRET: generated (abc123...)
   API_KEYS: generated (key1..., key2...)
✅ Secrets ready!
```

To use custom secrets, set them in `.env.development`:

```env
JWT_SECRET=your-secret
API_KEYS=key1,key2
```

## Troubleshooting

### Port in Use

```bash
lsof -i :8000
kill -9 <PID>
```

### Stale Dependencies

```bash
docker compose -f docker/compose.development.yml down -v
docker compose -f docker/compose.development.yml up --build
```
