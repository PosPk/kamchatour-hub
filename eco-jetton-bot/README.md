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

## Примечание
Модуль `src/ton.ts` сейчас возвращает симулированный транзакционный hash, пока не будет настроен реальный кошелёк и minter Jetton.