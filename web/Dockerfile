# ==========================================
# Stage 1: Base - Node.js LTS Alpine with Bun
# ==========================================
FROM node:lts-alpine AS base

# Install Bun and utilities (shared across all stages)
RUN apk add --no-cache curl bash netcat-openbsd && \
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

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bun", "run", "dev"]

# ==========================================
# Stage 4: Builder - Build production bundle
# ==========================================
FROM base AS builder

ARG BUILD_ENV=production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy environment-specific .env file for build
COPY .env.${BUILD_ENV} .env

# Build Next.js application
RUN bun run build

# ==========================================
# Stage 5: Production - Minimal runtime image
# ==========================================
FROM base AS production

ARG BUILD_ENV=production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy environment-specific .env file
COPY --chown=nextjs:nodejs .env.${BUILD_ENV} .env

# Copy entrypoint script
COPY --chown=nextjs:nodejs entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create directories for scripts
RUN mkdir -p /app/scripts && chown -R nextjs:nodejs /app/scripts

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bun", "server.js"]
