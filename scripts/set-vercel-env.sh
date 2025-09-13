#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   export VERCEL_TOKEN=... VERCEL_ORG_ID=... VERCEL_PROJECT_ID=...
#   export AXIOM_TOKEN=... AXIOM_DATASET=...
#   export EXPO_PUBLIC_BUGSNAG_API_KEY=...
#   bash scripts/set-vercel-env.sh

required=(VERCEL_TOKEN VERCEL_PROJECT_ID)
for k in "${required[@]}"; do
  if [ -z "${!k:-}" ]; then
    echo "Missing required env: $k" >&2
    exit 1
  fi
done

ensure_var() {
  local name="$1"; shift
  local value="$1"; shift
  if [ -z "$value" ]; then
    echo "Skip $name: empty value"
    return 0
  fi
  SCOPE_ARGS=()
  if [ -n "${VERCEL_ORG_ID:-}" ]; then
    SCOPE_ARGS=(--scope "$VERCEL_ORG_ID")
  fi
  echo "$value" | vercel env add "$name" production --yes --token="$VERCEL_TOKEN" "${SCOPE_ARGS[@]}" --project "$VERCEL_PROJECT_ID" || true
  echo "$value" | vercel env add "$name" preview    --yes --token="$VERCEL_TOKEN" "${SCOPE_ARGS[@]}" --project "$VERCEL_PROJECT_ID" || true
  echo "$value" | vercel env add "$name" development --yes --token="$VERCEL_TOKEN" "${SCOPE_ARGS[@]}" --project "$VERCEL_PROJECT_ID" || true
}

# Axiom (serverless logs)
ensure_var AXIOM_TOKEN   "${AXIOM_TOKEN:-}"
ensure_var AXIOM_DATASET "${AXIOM_DATASET:-}"

# CloudPayments (public id may be useful on server too)
ensure_var CLOUDPAYMENTS_PUBLIC_ID   "${CLOUDPAYMENTS_PUBLIC_ID:-}"
ensure_var CLOUDPAYMENTS_API_SECRET  "${CLOUDPAYMENTS_API_SECRET:-}"

# Supabase
ensure_var SUPABASE_URL               "${SUPABASE_URL:-}"
ensure_var SUPABASE_SERVICE_ROLE_KEY  "${SUPABASE_SERVICE_ROLE_KEY:-}"
ensure_var EXPO_PUBLIC_SUPABASE_URL   "${EXPO_PUBLIC_SUPABASE_URL:-}"
ensure_var EXPO_PUBLIC_SUPABASE_ANON_KEY "${EXPO_PUBLIC_SUPABASE_ANON_KEY:-}"

# AI providers
ensure_var AI_PROVIDER        "${AI_PROVIDER:-}"
ensure_var DEEPSEEK_API_KEY   "${DEEPSEEK_API_KEY:-}"
ensure_var GROQ_API_KEY       "${GROQ_API_KEY:-}"
ensure_var OPENAI_API_KEY     "${OPENAI_API_KEY:-}"

# Client monitoring
ensure_var EXPO_PUBLIC_BUGSNAG_API_KEY "${EXPO_PUBLIC_BUGSNAG_API_KEY:-}"

# Telegram Bot
ensure_var TELEGRAM_BOT_TOKEN        "${TELEGRAM_BOT_TOKEN:-}"
ensure_var TELEGRAM_WEBHOOK_SECRET   "${TELEGRAM_WEBHOOK_SECRET:-}"

# NextAuth (Yandex OAuth)
ensure_var NEXTAUTH_URL            "${NEXTAUTH_URL:-}"
ensure_var NEXTAUTH_SECRET         "${NEXTAUTH_SECRET:-}"
ensure_var YANDEX_CLIENT_ID        "${YANDEX_CLIENT_ID:-}"
ensure_var YANDEX_CLIENT_SECRET    "${YANDEX_CLIENT_SECRET:-}"

# Yandex Maps (client/server)
ensure_var NEXT_PUBLIC_YANDEX_MAPS_API_KEY "${NEXT_PUBLIC_YANDEX_MAPS_API_KEY:-}"
ensure_var YANDEX_MAPS_API_KEY            "${YANDEX_MAPS_API_KEY:-}"

# Supabase anon key for client usage if needed
ensure_var SUPABASE_ANON_KEY "${SUPABASE_ANON_KEY:-}"

echo "Done: attempted to add env vars to Vercel (prod/preview/dev)."

echo "Done: attempted to add env vars to Vercel (prod/preview/dev)."

