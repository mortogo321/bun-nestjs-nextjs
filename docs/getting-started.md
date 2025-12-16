# Getting Started

## Prerequisites

- **Bun** >= 1.3.0
- **Docker** >= 24.x (optional)

## Installation

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Clone and install
git clone <repository-url>
cd bun-nestjs-nextjs
bun install
```

## Running

### Local Development

```bash
bun run dev
```

### Docker Development

```bash
docker compose -f docker/compose.development.yml up --build
```

## Verify Installation

```bash
# Health check (public)
curl http://localhost:8000/api/health

# Get demo token
curl -X POST http://localhost:8000/api/auth/demo-token

# Access protected endpoint
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/users
```

**URLs:**
- API: http://localhost:8000
- Web: http://localhost:3000
- Swagger: http://localhost:8000/api/docs

## Project Structure

```
bun-nestjs-nextjs/
├── api/          # NestJS backend
├── web/          # Next.js frontend
├── docker/       # Docker configs
└── docs/         # Documentation
```

## Next Steps

- [API Reference](api-reference.md)
- [Docker Guide](docker.md)
- [Deployment](deployment.md)
