"use strict";

exports.handler = async () => {
  const YDB_ENDPOINT = process.env.YDB_ENDPOINT || null;
  const YDB_DATABASE = process.env.YDB_DATABASE || null;
  const YDB_DOCAPI = process.env.YDB_DOCAPI || null;

  const redact = (v) => (v ? true : false);

  return {
    statusCode: 200,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    body: JSON.stringify({
      ok: true,
      service: "yc-function:ydb-health",
      env: {
        has_endpoint: redact(YDB_ENDPOINT),
        has_database: redact(YDB_DATABASE),
        has_docapi: redact(YDB_DOCAPI),
      },
      ts: new Date().toISOString(),
    }),
  };
};

