"use strict";

const crypto = require("crypto");

async function verifySecret(event) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return true; // if not set, accept all
  const got = (event.headers?.["x-telegram-bot-api-secret-token"]) || (event.headers?.["X-Telegram-Bot-Api-Secret-Token"]) || "";
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(got));
  } catch (_) {
    return false;
  }
}

exports.handler = async (event) => {
  try {
    if (!(await verifySecret(event))) {
      return { statusCode: 401, body: JSON.stringify({ ok: false, error: "unauthorized" }) };
    }

    const update = event.body ? JSON.parse(event.body) : {};
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: "missing_bot_token" }) };
    }

    const chatId = update.message?.chat?.id || update.callback_query?.message?.chat?.id;
    const text = update.message?.text || "";

    let reply = null;
    if (text.startsWith("/start")) {
      reply = "Kamchatour Hub online. Use /help to see commands.";
    } else if (text.startsWith("/help")) {
      reply = "Commands: /help, /ping, /status";
    } else if (text.startsWith("/ping")) {
      reply = "pong";
    } else if (text.startsWith("/status")) {
      reply = `Status: ok, ts=${new Date().toISOString()}`;
    } else if (text) {
      reply = `Echo: ${text}`;
    }

    if (chatId && reply) {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: reply }),
      }).then(() => null).catch(() => null);
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(error) }) };
  }
};

