# Bun + NestJS + Next.js Ecosystem

A monorepo demonstrating a NestJS API and a Next.js frontend running on the Bun runtime, with JWT/API-key authentication, Swagger docs, and Docker Compose environments for local development.

## What's Inside

- **API** (`api/`) — NestJS 11 REST API with JWT auth, API-key auth, role-based guards, and Swagger/OpenAPI docs
- **Web** (`web/`) — Next.js 16 (React 19) frontend
- Bun workspaces tying both apps together with shared lint/format/typecheck scripts

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Bun | 1.3+ |
| API | NestJS | 11 |
| Web | Next.js | 16 |
| UI | React | 19 |
| Container | Docker | Multi-stage |

## Quick Start

```bash
# Install
bun install

# Development
bun run dev

# Docker
docker compose -f docker/compose.development.yml up --build
```

**URLs:**
- API: http://localhost:8000
- Web: http://localhost:3000
- Swagger: http://localhost:8000/api/docs

## Authentication

API routes are protected by default. Use `@Public()` decorator for public endpoints.

```bash
# Get demo token
curl -X POST http://localhost:8000/api/auth/demo-token

# Use JWT
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/users

# Use API Key
curl -H "X-API-Key: dev-api-key-1" http://localhost:8000/api/users
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/demo-token` | No | Get demo JWT |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/users` | Yes | List users |
| POST | `/api/users` | Yes | Create user |
| GET | `/api/users/:id` | Yes | Get user |
| PUT | `/api/users/:id` | Yes | Update user |
| DELETE | `/api/users/:id` | Yes | Delete user |

## Project Structure

```
bun-nestjs-nextjs/
├── api/          # NestJS REST API (auth, users, health modules)
├── web/          # Next.js frontend
├── docker/       # Compose files (development, production)
└── docs/         # Getting started, Docker, API reference, deployment guides
```

## Scripts

```bash
bun run dev          # Start development
bun run build        # Build all
bun run lint         # Lint all
bun run typecheck    # Type check
bun run format       # Format code
bun run test         # Run tests
```

## Environment

Environment files: `.env.development`, `.env.production`

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | JWT signing key |
| `API_KEYS` | Comma-separated API keys |
| `CORS_ORIGIN` | Allowed CORS origin |
| `NEXT_PUBLIC_API_URL` | API URL for frontend |

## Documentation

- [Getting Started](docs/getting-started.md)
- [Docker Guide](docs/docker.md)
- [API Reference](docs/api-reference.md)
- [Deployment](docs/deployment.md)

## License

MIT
