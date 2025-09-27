#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${YC_BUCKET:-}" ]]; then
  echo "Usage: YC_BUCKET=<bucket> AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... $0"
  exit 1
fi

ENDPOINT=${ENDPOINT:-https://storage.yandexcloud.net}

aws s3 mb "s3://${YC_BUCKET}" --endpoint-url "$ENDPOINT" || true

aws s3 website "s3://${YC_BUCKET}" \
  --index-document index.html \
  --error-document error.html \
  --endpoint-url "$ENDPOINT"

cat > /tmp/policy.json <<'JSON'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::BUCKET_NAME/*"
      ]
    }
  ]
}
JSON

sed -i "s/BUCKET_NAME/${YC_BUCKET}/g" /tmp/policy.json

aws s3api put-bucket-policy \
  --bucket "$YC_BUCKET" \
  --policy file:///tmp/policy.json \
  --endpoint-url "$ENDPOINT"

echo "Bucket ${YC_BUCKET} ready for static website hosting."
