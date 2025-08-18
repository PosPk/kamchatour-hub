# Eco Jetton Bot

Мини-бот Telegram для эко-баллов с возможностью заявки на Jetton (TON). В текущей версии выплаты симулируются.

## Установка

1) Скопируйте и заполните окружение:
```bash
cp .env.example .env
```
Заполните: `BOT_TOKEN`, `ADMIN_USER_ID`, при необходимости `DATABASE_PATH`. Для ончейн-режима позже добавьте `JETTON_MASTER_ADDRESS` и `ENABLE_ONCHAIN=true`.

2) Установка зависимостей и запуск:
```bash
npm i
npm run dev
```

## Команды бота
- /start — регистрация
- /me — показать свой Telegram user id
- /balance — баланс эко-баллов
- /top — лидеры
- /give <user_id> <amount> — админ: начислить баллы
- /claim <ton_address> <amount> — заявка на выплату Jetton
- /tasks — список заданий
- /task_complete <task_id> — отметить выполнение задания
- /task_upsert <id> <points> <title...> — админ: создать/обновить задание
- /ref — получить реферальную ссылку
- /stats — админ: статистика пользователей и заявок

## Mini App (TON Connect)
- Сервер мини‑приложения поднимается вместе с ботом (`express`). Открыть: `/app` в боте. Файлы: `public/index.html` и `/tonconnect-manifest.json`.
- При подключении кошелька адрес сохраняется в БД через `web_app_data`.

## Jetton: деплой и минт
Требуется кошелёк с балансом TON и сид фраза в `.env` (`TON_WALLET_MNEMONIC`).

1) Подготовьте метаданные и разместите JSON по `JETTON_CONTENT_URL`.
2) Деплой minter:
```bash
node scripts/jetton-deploy.mjs
```
Запишите адрес minter, поместите в `.env` как `JETTON_MASTER_ADDRESS`.

3) Минт на адрес владельца (owner address, не jetton wallet):
```bash
node scripts/jetton-mint.mjs <owner_address> <amount>
```

4) Включить ончейн-режим выплат:
```
ENABLE_ONCHAIN=true
JETTON_MASTER_ADDRESS=<minter_address>
TON_NETWORK=testnet|mainnet
TONCENTER_API_KEY=<опционально>
```

## Примечание
Модуль `src/ton.ts` сейчас возвращает симулированный транзакционный hash, пока не будет настроен реальный кошелёк и minter Jetton.