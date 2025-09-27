#!/usr/bin/env bash
set -euo pipefail

# Usage: GITHUB_REPO=owner/repo GITHUB_TOKEN=ghp_xxx ./scripts/import-secrets.sh .env

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 path/to/.env"
  exit 1
fi

ENV_FILE="$1"
REPO="${GITHUB_REPO:-}"
TOKEN="${GITHUB_TOKEN:-}"

if [[ -z "$REPO" || -z "$TOKEN" ]]; then
  echo "Set GITHUB_REPO=owner/repo and GITHUB_TOKEN with repo/admin:org perms"
  exit 1
fi

while IFS= read -r line; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  key="${line%%=*}"
  val="${line#*=}"
  key="${key// /}"
  val="${val}"
  if [[ -z "$key" || -z "$val" ]]; then continue; fi
  echo "Setting secret $key"
  gh secret set "$key" --repo "$REPO" --body "$val" >/dev/null 2>&1 || {
    echo "Failed to set $key via gh, trying API"
    curl -s -X PUT \
      -H "Authorization: token $TOKEN" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/$REPO/actions/secrets/$key" \
      -d "{\"encrypted_value\":\"$val\"}" >/dev/null || true
  }
done < "$ENV_FILE"

echo "Secrets import attempt finished."
