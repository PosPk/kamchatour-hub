# 2 Slides Outline

## 1) Архитектура
- Клиент: Expo React Native (iOS/Android/Web), Expo Router, OTA (EAS Update)
- Сервер: Vercel Serverless API (Node 18), прокси AI/Payments, health/config
- Хранилище: Supabase (Postgres + Storage + Realtime), RLS, RPC
- Платежи: CloudPayments (инициация, HMAC вебхуки, идемпотентность)
- Интеграции: Tilda (каталог), AI (OpenAI/DeepSeek/Groq)
- Наблюдаемость: Axiom (сервер), Bugsnag/Sentry (клиент)

## 2) Рынок и монетизация
- Комиссии с туроператоров и перевозчиков
- Доп. услуги: страховки, аренда, апселлы
- B2B‑витрины для партнёров (white‑label)
- UGC/сообщество как канал привлечения