# Web - Next.js Frontend

Next.js 16 frontend with React 19 running on Bun runtime.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Bundler**: Turbopack
- **Styling**: CSS Modules

## Getting Started

```bash
# Install dependencies
bun install

# Development (with Turbopack)
bun run dev

# Build
bun run build

# Production
bun run start
```

## Project Structure

```
src/
├── app/                    # App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── page.module.css     # Page styles
├── components/             # React components
│   ├── HealthStatus.tsx    # API health display
│   ├── HealthStatus.module.css
│   ├── UserList.tsx        # Users CRUD component
│   └── UserList.module.css
└── lib/                    # Utilities
    └── api.ts              # API client
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Environment mode |
| `NEXT_PUBLIC_API_URL` | http://localhost:8000 | API base URL |

## Features

- **Server Components**: React Server Components support
- **Turbopack**: Fast development builds
- **Standalone Output**: Optimized production builds
- **API Integration**: Fetch users and health status from API

## Docker

```bash
# Development (with hot reload)
docker build --target development -t web:dev .
docker run -p 3000:3000 -v $(pwd)/src:/app/src web:dev

# Production
docker build --target production -t web:prod .
docker run -p 3000:3000 web:prod
```

## Entrypoint Features

The `entrypoint.sh` supports:

- **API wait** (optional): Set `WAIT_FOR_API=true` and `API_INTERNAL_URL` for SSR
- **Config generation**: Set `GENERATE_CONFIG=true` to generate runtime config
- **Custom scripts**: Add `/app/scripts/startup.sh` for custom initialization

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server with Turbopack |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run Next.js linter |
| `bun run test` | Run tests |
