# ==========================================
# Stage 1: Base - Node.js LTS Alpine with Bun
# ==========================================
FROM node:lts-alpine AS base

# Install Bun and utilities (shared across all stages)
RUN apk add --no-cache curl bash netcat-openbsd openssl && \
    curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app

# ==========================================
# Stage 2: Dependencies - Install all deps
# ==========================================
FROM base AS deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# ==========================================
# Stage 3: Development - Hot reload support
# ==========================================
FROM base AS development

ARG BUILD_ENV=development
ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy environment-specific .env file
COPY .env.${BUILD_ENV} .env

# Copy and set entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bun", "run", "dev"]

# ==========================================
# Stage 4: Builder - Build production bundle
# ==========================================
FROM base AS builder

ARG BUILD_ENV=production
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy environment-specific .env file for build
COPY .env.${BUILD_ENV} .env

# Build NestJS application
RUN bun run build

# Prune dev dependencies
RUN bun install --production --frozen-lockfile

# ==========================================
# Stage 5: Production - Minimal runtime image
# ==========================================
FROM base AS production

ARG BUILD_ENV=production
ENV NODE_ENV=production
ENV PORT=8000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy only production necessities
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

# Copy environment-specific .env file
COPY --chown=nestjs:nodejs .env.${BUILD_ENV} .env

# Copy entrypoint script
COPY --chown=nestjs:nodejs entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create directories for keys and scripts
RUN mkdir -p /app/keys /app/scripts && chown -R nestjs:nodejs /app/keys /app/scripts

USER nestjs

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/api/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bun", "dist/main.js"]
