"use strict";

const https = require("https");

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from(JSON.stringify(data));
    const u = new URL(url);
    const req = https.request(
      {
        method: "POST",
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: {
          "content-type": "application/json",
          "content-length": payload.length,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (d) => chunks.push(d));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          resolve({ status: res.statusCode, body });
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

exports.handler = async (event) => {
  try {
    const sendSecret = process.env.TELEGRAM_SEND_SECRET || "";
    if (sendSecret) {
      const hdr = (event.headers?.["x-telegram-send-secret"]) || (event.headers?.["X-Telegram-Send-Secret"]) || (event.headers?.["x-send-secret"]) || "";
      if (!hdr || hdr !== sendSecret) {
        return { statusCode: 401, body: JSON.stringify({ ok: false, error: "unauthorized" }) };
      }
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const defaultChat = process.env.TELEGRAM_CHAT_ID || null;
    if (!token) {
      return {
        statusCode: 500,
        body: JSON.stringify({ ok: false, error: "missing_bot_token" }),
      };
    }

    const isJson = event.headers && /application\/json/i.test(event.headers["content-type"] || event.headers["Content-Type"] || "");
    const payload = isJson && event.body ? JSON.parse(event.body) : {};
    const chatId = payload.chat_id || defaultChat;
    const text = payload.text || "(empty)";
    const parseMode = payload.parse_mode || "HTML";

    if (!chatId) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "missing_chat_id" }) };
    }

    const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await postJson(apiUrl, { chat_id: chatId, text, parse_mode: parseMode, disable_web_page_preview: true });

    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: true, upstream: res }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(error) }) };
  }
};

