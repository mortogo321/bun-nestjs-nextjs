# API - NestJS Backend

NestJS 11 REST API running on Bun runtime.

## Tech Stack

- **Runtime**: Bun
- **Framework**: NestJS 11
- **Documentation**: Swagger/OpenAPI 3.0
- **Validation**: class-validator, class-transformer

## Getting Started

```bash
# Install dependencies
bun install

# Development (with hot reload)
bun run dev

# Build
bun run build

# Production
bun run start:prod
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## Swagger Documentation

**URL**: http://localhost:8000/api/docs

### Features

- **Interactive UI**: Try out endpoints directly in browser
- **Multiple Examples**: Request body examples for POST/PUT
- **Authorization**: JWT Bearer and API Key support
- **Search/Filter**: Find endpoints quickly
- **Request Duration**: See response times
- **Dark Theme**: Monokai syntax highlighting

### Authentication Support

The API is configured with two authentication methods (for future use):

```typescript
// JWT Bearer Token
Authorization: Bearer <token>

// API Key
X-API-Key: <api-key>
```

## Project Structure

```
src/
├── main.ts                 # Application entry point + Swagger config
├── app.module.ts           # Root module
├── common/
│   └── dto/
│       └── error-response.dto.ts  # Standard error responses
├── modules/
│   ├── health/
│   │   ├── dto/
│   │   │   └── health-response.dto.ts
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   └── users/
│       ├── dto/
│       │   ├── create-user.dto.ts
│       │   └── update-user.dto.ts
│       ├── entities/
│       │   └── user.entity.ts
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── users.module.ts
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Environment mode |
| `PORT` | 8000 | Server port |
| `CORS_ORIGIN` | http://localhost:3000 | Allowed CORS origin |

## Docker

```bash
# Development (with hot reload)
docker build --target development -t api:dev .
docker run -p 8000:8000 -v $(pwd)/src:/app/src api:dev

# Production
docker build --target production -t api:prod .
docker run -p 8000:8000 api:prod
```

## Entrypoint Features

The `entrypoint.sh` supports:

- **Database wait**: Set `DATABASE_HOST` to wait for DB
- **Migrations**: Set `RUN_MIGRATIONS=true` to run migrations
- **Seeders**: Set `RUN_SEEDERS=true` to run seeders
- **Key generation**: Set `GENERATE_KEYS=true` to generate RSA keys

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start:prod` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run test` | Run tests |
