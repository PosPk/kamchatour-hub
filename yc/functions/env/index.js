"use strict";

function pickEnv() {
  const redact = (value) => (value ? true : false);
  return {
    YC_REGION: process.env.YC_REGION || null,
    YC_BUCKET: process.env.YC_BUCKET || null,
    NODE_ENV: process.env.NODE_ENV || null,
    HAS_TELEGRAM_BOT_TOKEN: redact(process.env.TELEGRAM_BOT_TOKEN),
    HAS_TELEGRAM_WEBHOOK_SECRET: redact(process.env.TELEGRAM_WEBHOOK_SECRET),
    HAS_TELEGRAM_SEND_SECRET: redact(process.env.TELEGRAM_SEND_SECRET),
    HAS_DATABASE_URL: redact(process.env.DATABASE_URL),
    HAS_NEXTAUTH_SECRET: redact(process.env.NEXTAUTH_SECRET),
    HAS_YANDEX_CLIENT_ID: redact(process.env.YANDEX_CLIENT_ID),
    HAS_YANDEX_CLIENT_SECRET: redact(process.env.YANDEX_CLIENT_SECRET),
  };
}

exports.handler = async () => {
  const body = {
    ok: true,
    service: "yc-function:env",
    env: pickEnv(),
    ts: new Date().toISOString(),
  };

  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
    body: JSON.stringify(body),
  };
};

