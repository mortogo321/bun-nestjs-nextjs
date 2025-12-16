# Deployment Guide

## Environment Variables

### API

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `production` |
| `PORT` | No | Default: 8000 |
| `JWT_SECRET` | Yes | JWT signing key |
| `API_KEYS` | Yes | Comma-separated API keys |
| `CORS_ORIGIN` | No | Allowed origin |

### Web

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `production` |
| `NEXT_PUBLIC_API_URL` | Yes | Public API URL |

## Docker Compose

### Build and Start

```bash
# Set environment variables
export JWT_SECRET="your-secure-secret"
export API_KEYS="key1,key2"

# Build
docker compose -f docker/compose.production.yml build

# Start
docker compose -f docker/compose.production.yml up -d
```

### With Nginx

```bash
docker compose -f docker/compose.production.yml --profile with-nginx up -d
```

## Kubernetes

### API Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    spec:
      containers:
      - name: api
        image: your-registry/api:latest
        ports:
        - containerPort: 8000
        env:
        - name: NODE_ENV
          value: "production"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: jwt-secret
        - name: API_KEYS
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: api-keys
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8000
```

### Secrets

```bash
kubectl create secret generic api-secrets \
  --from-literal=jwt-secret='your-secret' \
  --from-literal=api-keys='key1,key2'
```

## Scaling

```bash
# Docker Compose
docker compose -f docker/compose.production.yml up -d --scale api=3

# Kubernetes
kubectl scale deployment api --replicas=3
```

## Security Checklist

- [ ] Use HTTPS
- [ ] Set strong JWT_SECRET
- [ ] Rotate API_KEYS regularly
- [ ] Configure CORS_ORIGIN
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Keep images updated
