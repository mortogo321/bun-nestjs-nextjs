#!/bin/sh
set -e

echo "🚀 Starting API entrypoint..."

# ===========================================
# Load environment variables from .env file
# ===========================================
if [ -f /app/.env ]; then
    echo "📄 Loading environment from .env file..."
    set -a
    . /app/.env
    set +a
fi

# ===========================================
# Auto-generate secrets if not provided
# ===========================================
generate_secrets() {
    echo "🔐 Checking secrets..."

    # Generate JWT_SECRET if not set
    if [ -z "$JWT_SECRET" ]; then
        export JWT_SECRET=$(openssl rand -base64 32)
        echo "   JWT_SECRET: generated (${JWT_SECRET:0:10}...)"
    else
        echo "   JWT_SECRET: using provided value"
    fi

    # Generate API_KEYS if not set
    if [ -z "$API_KEYS" ]; then
        KEY1=$(openssl rand -hex 16)
        KEY2=$(openssl rand -hex 16)
        export API_KEYS="${KEY1},${KEY2}"
        echo "   API_KEYS: generated (${KEY1:0:8}..., ${KEY2:0:8}...)"
    else
        echo "   API_KEYS: using provided value"
    fi

    echo "✅ Secrets ready!"
}

# Auto-generate secrets in development or when explicitly enabled
if [ "$NODE_ENV" = "development" ] || [ "$AUTO_GENERATE_SECRETS" = "true" ]; then
    generate_secrets
fi

# ===========================================
# Check if OS/platform changed (development)
# ===========================================
check_and_reinstall_deps() {
    OS_MARKER_FILE="/app/node_modules/.os-marker"
    CURRENT_OS="$(uname -s)-$(uname -m)"

    if [ -d "/app/node_modules" ]; then
        if [ -f "$OS_MARKER_FILE" ]; then
            INSTALLED_OS=$(cat "$OS_MARKER_FILE")
            if [ "$INSTALLED_OS" != "$CURRENT_OS" ]; then
                echo "🔄 OS changed from $INSTALLED_OS to $CURRENT_OS"
                echo "📦 Reinstalling dependencies for current platform..."
                rm -rf /app/node_modules/.bun
                bun install --frozen-lockfile 2>/dev/null || bun install
                echo "$CURRENT_OS" > "$OS_MARKER_FILE"
                echo "✅ Dependencies reinstalled!"
            else
                echo "✅ Dependencies match current OS ($CURRENT_OS)"
            fi
        else
            echo "📝 Recording OS marker: $CURRENT_OS"
            echo "$CURRENT_OS" > "$OS_MARKER_FILE"
        fi
    fi
}

# Check OS and reinstall dependencies in development mode
if [ "$NODE_ENV" = "development" ] || [ -z "$NODE_ENV" ]; then
    check_and_reinstall_deps
fi

# ===========================================
# Wait for dependent services
# ===========================================
if [ -n "$DATABASE_HOST" ]; then
    echo "⏳ Waiting for database at $DATABASE_HOST:${DATABASE_PORT:-5432}..."
    while ! nc -z "$DATABASE_HOST" "${DATABASE_PORT:-5432}" 2>/dev/null; do
        sleep 1
    done
    echo "✅ Database is ready!"
fi

# ===========================================
# Run migrations if enabled
# ===========================================
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "📦 Running database migrations..."
    bun run migration:run || echo "⚠️ Migrations failed or not configured"
fi

# ===========================================
# Run seeders if enabled
# ===========================================
if [ "$RUN_SEEDERS" = "true" ]; then
    echo "🌱 Running database seeders..."
    bun run seed || echo "⚠️ Seeders failed or not configured"
fi

# ===========================================
# Generate RSA keys if needed
# ===========================================
if [ "$GENERATE_KEYS" = "true" ]; then
    echo "🔑 Generating RSA key pair..."
    if [ ! -f "/app/keys/private.key" ]; then
        mkdir -p /app/keys
        openssl genrsa -out /app/keys/private.key 2048 2>/dev/null || echo "⚠️ Key generation skipped"
        openssl rsa -in /app/keys/private.key -pubout -out /app/keys/public.key 2>/dev/null || true
        echo "✅ RSA keys generated!"
    else
        echo "✅ RSA keys already exist"
    fi
fi

# ===========================================
# Custom startup script hook
# ===========================================
if [ -f "/app/scripts/startup.sh" ]; then
    echo "📜 Running custom startup script..."
    sh /app/scripts/startup.sh
fi

echo "✅ Entrypoint complete. Starting application..."

# Execute the main command
exec "$@"
