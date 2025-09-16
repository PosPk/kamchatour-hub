#!/usr/bin/env bash
set -euo pipefail

# List Vercel env vars for a project (prod/preview/dev)
# Usage:
#   export VERCEL_TOKEN=... [VERCEL_ORG_ID=...] VERCEL_PROJECT_ID=...
#   bash scripts/audit-vercel-env.sh

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Install with: npm i -g vercel" >&2
  exit 1
fi

: "${VERCEL_TOKEN:?Set VERCEL_TOKEN}"
PROJECT_ID="${VERCEL_PROJECT_ID:-}"
SCOPE_ARG=()
if [ -n "${VERCEL_ORG_ID:-}" ]; then
  SCOPE_ARG=(--scope "$VERCEL_ORG_ID")
fi

if [ -z "$PROJECT_ID" ]; then
  echo "VERCEL_PROJECT_ID not set. Showing projects to pick one:" >&2
  vercel projects ls --token "$VERCEL_TOKEN" "${SCOPE_ARG[@]}"
  exit 1
fi

echo "# Project: $PROJECT_ID"
for env in production preview development; do
  echo "\n## $env"
  vercel env ls --project "$PROJECT_ID" --environment "$env" --token "$VERCEL_TOKEN" "${SCOPE_ARG[@]}" || true
done

