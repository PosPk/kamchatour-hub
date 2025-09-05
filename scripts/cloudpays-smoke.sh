#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   CLOUDPAYMENTS_API_SECRET=... BASE=https://your-domain vercel ./scripts/cloudpays-smoke.sh

SECRET="${CLOUDPAYMENTS_API_SECRET:-}"
BASE="${BASE:-http://localhost:3000}"
ENDPOINT="$BASE/api/webhooks/cloudpays"

if [ -z "$SECRET" ]; then
  echo "CLOUDPAYMENTS_API_SECRET is required" >&2
  exit 1
fi

BOOKING_ID="test-booking-$(date +%s)"
TX_ID="tx-$(date +%s)"
BODY=$(cat <<JSON
{
  "TransactionId": "$TX_ID",
  "AccountId": "$BOOKING_ID",
  "Status": "Completed",
  "Amount": 100.00,
  "Currency": "RUB"
}
JSON
)

SIG=$(printf "%s" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -binary | openssl base64)

echo "POST $ENDPOINT\nSignature: $SIG\nBody: $BODY"
curl -sS -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "X-Signature: $SIG" \
  --data "$BODY" | jq -C . || true

