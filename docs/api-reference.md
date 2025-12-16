# API Reference

## Base URL

- Development: `http://localhost:8000`
- Swagger: `http://localhost:8000/api/docs`

## Authentication

API routes are protected by default. Use `@Public()` decorator for public endpoints.

### Methods

| Method | Header | Example |
|--------|--------|---------|
| JWT Bearer | `Authorization` | `Bearer <token>` |
| JWT Cookie | `access_token` | Cookie value |
| API Key | `X-API-Key` | `dev-api-key-1` |

### Get Demo Token

```bash
curl -X POST http://localhost:8000/api/auth/demo-token
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": "7d"
}
```

## Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/demo-token` | Get demo JWT |

### Protected Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Current user info |
| GET | `/api/users` | List users |
| POST | `/api/users` | Create user |
| GET | `/api/users/:id` | Get user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## Examples

### Health Check

```bash
curl http://localhost:8000/api/health
```

```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "runtime": "Bun",
  "version": "v1.3.x"
}
```

### List Users (JWT)

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/users
```

### List Users (API Key)

```bash
curl -H "X-API-Key: dev-api-key-1" http://localhost:8000/api/users
```

### Create User

```bash
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

## Error Responses

### Unauthorized (401)

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Not Found (404)

```json
{
  "statusCode": 404,
  "message": "User with ID xxx not found",
  "error": "Not Found"
}
```

### Validation Error (400)

```json
{
  "statusCode": 400,
  "message": ["Name must be at least 2 characters long"],
  "error": "Bad Request"
}
```
