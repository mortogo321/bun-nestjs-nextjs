#!/bin/sh
set -e

echo "🚀 Starting Web entrypoint..."

# Check if OS/platform changed and reinstall dependencies if needed
# This is crucial for development when host (macOS) differs from container (Linux)
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

# Only wait for API if SSR needs it (e.g., server-side data fetching)
# For client-side only apps, the browser connects directly to the API
if [ "$WAIT_FOR_API" = "true" ] && [ -n "$API_INTERNAL_URL" ]; then
    API_HOST=$(echo "$API_INTERNAL_URL" | sed -e 's|http://||' -e 's|https://||' -e 's|:.*||')
    API_PORT=$(echo "$API_INTERNAL_URL" | grep -oE ':[0-9]+' | tr -d ':' || echo "8000")

    echo "⏳ Waiting for API at $API_HOST:$API_PORT..."
    RETRIES=30
    until nc -z "$API_HOST" "$API_PORT" 2>/dev/null || [ $RETRIES -eq 0 ]; do
        RETRIES=$((RETRIES-1))
        sleep 1
    done

    if [ $RETRIES -gt 0 ]; then
        echo "✅ API is ready!"
    else
        echo "⚠️ API not available, starting anyway..."
    fi
fi

# Generate runtime configuration if needed
if [ "$GENERATE_CONFIG" = "true" ]; then
    echo "⚙️ Generating runtime configuration..."
    cat > /app/public/config.json <<CONF
{
  "apiUrl": "${NEXT_PUBLIC_API_URL:-http://localhost:8000}",
  "environment": "${NODE_ENV:-production}",
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
CONF
    echo "✅ Configuration generated!"
fi

# Custom startup script hook
if [ -f "/app/scripts/startup.sh" ]; then
    echo "📜 Running custom startup script..."
    sh /app/scripts/startup.sh
fi

echo "✅ Entrypoint complete. Starting application..."

# Execute the main command
exec "$@"
