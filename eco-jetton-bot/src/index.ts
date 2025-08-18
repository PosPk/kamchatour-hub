import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { ensureUserExists, addEcoPoints, getBalance, listTop, listTasks, upsertTask, completeTask, addReferral, awardJoinBonus, rewardReferral, getUserCount, getClaimsStats, setUserWallet, getUserWallet } from './storage.js';
import { config } from './config.js';
import express from 'express';
import path from 'node:path';
import { requestJettonPayout } from './ton.js';

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  console.error('BOT_TOKEN is not set');
  process.exit(1);
}

const adminUserId = process.env.ADMIN_USER_ID ? Number(process.env.ADMIN_USER_ID) : undefined;

const bot = new Telegraf(botToken);

bot.start(async (ctx) => {
  const createdInfo = ensureUserExists(ctx.from);
  const text = ctx.message && 'text' in ctx.message ? ctx.message.text : undefined;
  const payload = text?.split(/\s+/).slice(1).join(' ');
  if (createdInfo.created && config.joinBonusPoints > 0) {
    awardJoinBonus(ctx.from.id, config.joinBonusPoints);
  }
  if (payload) {
    const maybeRefId = Number(payload.trim());
    if (Number.isFinite(maybeRefId) && maybeRefId > 0 && maybeRefId !== ctx.from.id) {
      if (addReferral(maybeRefId, ctx.from.id)) {
        rewardReferral(maybeRefId, config.referralPoints);
      }
    }
  }
  await ctx.reply('Привет! Это эко-бот. Копи эко-баллы и конвертируй их в Jetton на TON. Команды: /balance, /claim, /top, /tasks');
});

bot.command('balance', async (ctx) => {
  await ensureUserExists(ctx.from);
  const balance = getBalance(ctx.from.id);
  await ctx.reply(`Твой баланс: ${balance} эко-баллов`);
});

bot.command('top', async (ctx) => {
  const top = listTop(10);
  if (top.length === 0) {
    await ctx.reply('Таблица лидеров пустая');
    return;
  }
  const lines = top.map((t, idx) => `${idx + 1}. ${t.username ?? 'без_имени'} — ${t.eco_points}`);
  await ctx.reply('Лидеры:\n' + lines.join('\n'));
});

bot.command('me', async (ctx) => {
  await ensureUserExists(ctx.from);
  await ctx.reply(`Твой ID: ${ctx.from.id}\nИмя: @${ctx.from.username ?? 'без_имени'}`);
});

bot.command('ref', async (ctx) => {
  await ensureUserExists(ctx.from);
  await ctx.reply('Поделись ссылкой-приглашением:')
  const botUsername = ctx.botInfo?.username ?? 'your_bot';
  const link = `https://t.me/${botUsername}?start=${ctx.from.id}`;
  await ctx.reply(link);
});

bot.command('give', async (ctx) => {
  if (!adminUserId || ctx.from.id !== adminUserId) {
    await ctx.reply('Команда доступна только администратору');
    return;
  }
  const parts = ctx.message && 'text' in ctx.message ? ctx.message.text.trim().split(/\s+/) : [];
  // /give <user_id> <amount>
  if (parts.length < 3) {
    await ctx.reply('Использование: /give <user_id> <amount>');
    return;
  }
  const userId = Number(parts[1]);
  const amount = Number(parts[2]);
  if (!Number.isFinite(userId) || !Number.isFinite(amount) || amount <= 0) {
    await ctx.reply('Неверные аргументы');
    return;
  }
  addEcoPoints(userId, amount);
  await ctx.reply(`Начислено ${amount} баллов пользователю ${userId}`);
});

bot.command('claim', async (ctx) => {
  await ensureUserExists(ctx.from);
  const parts = ctx.message && 'text' in ctx.message ? ctx.message.text.trim().split(/\s+/) : [];
  // /claim <ton_address> <amount>
  if (parts.length < 3) {
    await ctx.reply('Использование: /claim <ton_address> <amount>');
    return;
  }
  const address = parts[1];
  const amount = Number(parts[2]);
  if (!Number.isFinite(amount) || amount <= 0) {
    await ctx.reply('Укажи корректную сумму');
    return;
  }
  try {
    const { ok, message } = await requestJettonPayout(ctx.from.id, address, amount);
    await ctx.reply(ok ? `Заявка создана: ${message}` : `Ошибка: ${message}`);
  } catch (err) {
    console.error(err);
    await ctx.reply('Внутренняя ошибка');
  }
});

bot.command('tasks', async (ctx) => {
  const tasks = listTasks();
  if (tasks.length === 0) {
    await ctx.reply('Пока нет заданий');
    return;
  }
  const lines = tasks.map((t) => `- ${t.id}: ${t.title} (+${t.points})`);
  await ctx.reply('Задания:\n' + lines.join('\n'));
});

bot.command('task_complete', async (ctx) => {
  await ensureUserExists(ctx.from);
  const parts = ctx.message && 'text' in ctx.message ? ctx.message.text.trim().split(/\s+/) : [];
  // /task_complete <task_id>
  if (parts.length < 2) {
    await ctx.reply('Использование: /task_complete <task_id>');
    return;
  }
  const taskId = parts[1];
  const ok = completeTask(ctx.from.id, taskId);
  await ctx.reply(ok ? 'Задание засчитано, баллы начислены' : 'Не удалось засчитать (возможно, уже выполнено или нет такого задания)');
});

bot.command('task_upsert', async (ctx) => {
  if (!adminUserId || ctx.from.id !== adminUserId) {
    await ctx.reply('Команда доступна только администратору');
    return;
  }
  const parts = ctx.message && 'text' in ctx.message ? ctx.message.text.trim().split(/\s+/) : [];
  // /task_upsert <id> <points> <title...>
  if (parts.length < 4) {
    await ctx.reply('Использование: /task_upsert <id> <points> <title...>');
    return;
  }
  const id = parts[1];
  const points = Number(parts[2]);
  const title = parts.slice(3).join(' ');
  if (!Number.isFinite(points) || points <= 0) {
    await ctx.reply('Баллы должны быть положительным числом');
    return;
  }
  upsertTask(id, title, points);
  await ctx.reply('Задание сохранено');
});

bot.command('stats', async (ctx) => {
  if (!adminUserId || ctx.from.id !== adminUserId) {
    await ctx.reply('Команда доступна только администратору');
    return;
  }
  const users = getUserCount();
  const claims = getClaimsStats();
  await ctx.reply(`Пользователи: ${users}\nЗаявки: pending=${claims.pending}, done=${claims.done}, failed=${claims.failed}`);
});

bot.command('app', async (ctx) => {
  const appUrl = process.env.APP_URL || 'http://localhost:8080';
  await ctx.reply('Открыть мини‑приложение:', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Open App', web_app: { url: appUrl } }]],
    },
  } as any);
});

bot.command('wallet', async (ctx) => {
  await ensureUserExists(ctx.from);
  const w = getUserWallet(ctx.from.id);
  await ctx.reply(w ? `Твой кошелёк: ${w}` : 'Кошелёк не привязан. Нажми /app и подключи через TON Connect.');
});

bot.on('message', async (ctx, next) => {
  const anyMessage: any = ctx.message as any;
  const webAppData = anyMessage?.web_app_data?.data;
  if (webAppData) {
    try {
      const parsed = JSON.parse(webAppData);
      if (parsed && parsed.type === 'wallet' && typeof parsed.address === 'string') {
        setUserWallet(ctx.from.id, parsed.address);
        await ctx.reply(`Кошелёк сохранён: ${parsed.address}`);
        return;
      }
    } catch {}
  }
  return next();
});

// Express mini-app server
const app = express();
const port = Number(process.env.PORT || 8080);
const publicDir = path.resolve('./public');
app.use(express.static(publicDir));
app.get('/tonconnect-manifest.json', (req, res) => {
  const url = process.env.APP_URL || `http://localhost:${port}`;
  const name = process.env.APP_NAME || 'Eco Jetton';
  const iconUrl = process.env.APP_ICON_URL || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Ton_symbol.svg';
  res.json({ url, name, iconUrl });
});

app.listen(port, () => {
  console.log(`Mini app server listening on :${port}`);
});

bot.launch().then(() => {
  console.log('Eco Jetton bot started');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));