import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { ensureUserExists, addEcoPoints, getBalance, listTop } from './storage.js';
import { requestJettonPayout } from './ton.js';

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  console.error('BOT_TOKEN is not set');
  process.exit(1);
}

const adminUserId = process.env.ADMIN_USER_ID ? Number(process.env.ADMIN_USER_ID) : undefined;

const bot = new Telegraf(botToken);

bot.start(async (ctx) => {
  await ensureUserExists(ctx.from);
  await ctx.reply('Привет! Это эко-бот. Копи эко-баллы и конвертируй их в Jetton на TON. Команды: /balance, /claim, /top, /give');
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

bot.launch().then(() => {
  console.log('Eco Jetton bot started');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));