#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${YC_BUCKET:-}" || -z "${YC_REGION:-}" ]]; then
  echo "Usage: YC_BUCKET=<bucket> YC_REGION=<region> AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... $0"
  exit 1
fi

DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$DIR"

npm run build

aws s3 sync public/ "s3://${YC_BUCKET}/" \
  --endpoint-url "https://storage.yandexcloud.net" \
  --delete \
  --acl public-read \
  --cache-control "public,max-age=300" \
  --content-type "text/html; charset=utf-8" --exclude "*" --include "*.html"

aws s3 sync public/ "s3://${YC_BUCKET}/" \
  --endpoint-url "https://storage.yandexcloud.net" \
  --delete \
  --acl public-read \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "*.html"

echo "Deployed to s3://${YC_BUCKET}/ (Yandex Object Storage)"
