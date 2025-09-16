#!/usr/bin/env bash
set -euo pipefail

# Sync a single root .env into Next.js app (new-web/.env.local)
# Usage: bash scripts/sync-local-env.sh

ROOT_ENV_FILE="$(git rev-parse --show-toplevel)/.env"
NEXT_ENV_FILE="$(git rev-parse --show-toplevel)/new-web/.env.local"

if [ ! -f "$ROOT_ENV_FILE" ]; then
  echo "Root .env not found at $ROOT_ENV_FILE" >&2
  echo "Create .env using .env.example as a template, then re-run." >&2
  exit 1
fi

mkdir -p "$(dirname "$NEXT_ENV_FILE")"
cp "$ROOT_ENV_FILE" "$NEXT_ENV_FILE"

echo "Synced $ROOT_ENV_FILE -> $NEXT_ENV_FILE"

