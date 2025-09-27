"use strict";

exports.handler = async () => {
  const responseBody = {
    ok: true,
    service: "yc-function:health",
    region: process.env.YC_REGION || null,
    ts: new Date().toISOString(),
  };
  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
    body: JSON.stringify(responseBody),
  };
};

