## Техническое задание: Telegram WebApp «Kamchatour Hub — витрина туров»

### 1. Цели и признаки успеха
- Цель: легкая витрина туров внутри Telegram с поиском, фильтрами, карточками и лидами.
- KPI P0: TTI < 2.5s на 4G, успешная отправка лида, выдача туров из Supabase, без 404.

### 2. Область и приоритеты
- P0: каталог (/tg), детальная (/tg/tour.html), лид (/tg/lead.html), поиск/фильтры, i18n (ru/zh), bottom‑nav, RLS, /api/tg/*, импорт партнёра.
- P1: Story (/tg/story.html), AR/VR (/tg/ar.html) с фоллбеком 360, отзывы (листинг + отправка), AI‑рекомендации.
- P2: события (/tg/events), «рядом с вами», таймлайн поездки.

### 3. Платформы и интеграции
- Telegram WebApp SDK: themeParams, initData, MainButton.
- Веб‑хостинг: Vercel (SPA routing, CSP, rewrite /mini → /tg).
- БД/бекенд: Supabase (Postgres, RLS, Storage опц.), Node API routes (Vercel).

### 4. UX/UI (стиль «Неоновая доверительность»)
- Каталог (/tg/index.html): поиск (debounced), чипы активностей с иконками, карточки 16:9, бейджи Eco+/Рейтинг, skeleton/empty.
- Детальная (/tg/tour.html): hero с градиентом, мета/цена, блок доверия «комиссия после тура», sticky CTA + MainButton, i18n.
- Лид (/tg/lead.html): короткая форма, отправка в /api/tg/lead, подтверждение.
- Story (/tg/story.html) P1: scrollytelling главы со sticky‑медиа, CTA «Выбрать тур».
- AR (/tg/ar.html) P1: пресеты (вулкан/киты/гейзеры), 3D/360, фоллбек.
- Навигация: фикс‑низ (Каталог, AR, Story, Брони), доступные цели ≥44px.
- Theme: все страницы читают Telegram themeParams → CSS‑переменные.

### 5. Локализация
- Язык: ?lang=ru|zh → при отсутствии — Telegram user.language_code → navigator.language.
- Данные: поля title_i18n/description_i18n (JSONB); pickI18n(lang).

### 6. Данные и схемы (Supabase)
- Таблицы (public): operators, tours, bookings, threads, messages, eco_actions, feed_posts, commission_tiers, commission_history, announcements, leads, booking_events, onchain_bookings.
- Ключевое для витрины: operators(id, name,…), tours(id, operator_id, title, title_i18n, region, activity, price_from, duration_days, rating, description, description_i18n, …).
- RLS: включён, публичное чтение operators/tours; чувствительные — только владельцы/сервис‑роль.

### 7. API контракты (Vercel serverless)
- GET `/api/tg/tours`
  - Resp: `{ items: Tour[] }` (fallback к `/public/partner-tours.json` если нет env)
- GET `/api/tg/search?q=строка`
  - Resp: `{ items: Tour[] }` (фильтрация по title/description/activity/region)
- POST `/api/tg/lead`
  - Body: `{ tour_id, name, phone, tg_user? }`
  - Auth: серверная SERVICE_ROLE_KEY; RLS допускает insert.
- POST `/api/tg/init`
  - Body: `{ initData }` → валидация подписи с TG_BOT_TOKEN.
- POST `/api/admin/announcements`
  - Headers: `x-admin-token` → модерация (approve/reject/list).
- POST `/api/import/partner-tours`
  - Headers: `x-admin-token`
  - Body: JSON массива туров или пусто (возьмёт `public/partner-tours.json`).

Тип `Tour` (пример ответа):
```json
{
  "id": "t1",
  "title": "Рыбалка на Камчатке",
  "title_i18n": { "zh": "堪察加半岛垂钓" },
  "region": "Южная Камчатка",
  "activity": "рыбалка",
  "price_from": 55000,
  "duration_days": 3,
  "rating": 4.8,
  "description": "…",
  "description_i18n": { "zh": "…" },
  "image": "https://…",
  "operator_id": "partner_fishing_kam"
}
```

### 8. Безопасность и соответствие
- RLS включён по умолчанию (operators/tours: read anon; остальные — owner/service).
- Rate‑limit: таблица auth_attempts + функция check_rate_limit (на перспективу).
- Audit: таблица audit_log + триггеры изменений для чувствительных таблиц.
- Идемпотентность платежей (payments) зарезервирована (вне P0 витрины).
- CSP (Vercel `vercel.json`): frame-ancestors 'self' https://web.telegram.org/ https://*.telegram.org.

### 9. Переменные окружения (Vercel)
- SUPABASE_URL, SUPABASE_ANON_KEY (клиентские), SUPABASE_SERVICE_ROLE_KEY (server‑only), TG_BOT_TOKEN, ADMIN_TOKEN (server‑only).

### 10. CI/CD
- GitHub Actions: автоприменение SQL + импорт партнёра при push/schedule; secrets: SUPABASE_DATABASE_URL, (опц.) SUPABASE_POOLED_DATABASE_URL.
- Vercel: build:web (expo export), SPA fallback, rewrite `/mini` → `/tg/$1`.

### 11. Приёмочные критерии (P0)
- /mini открывается внутри Telegram без 404, тема соответствует themeParams.
- Поиск с дебаунсом 200мс, чипы активностей фильтруют список, пустое состояние есть.
- Карточка: обложка 16:9, бейджи Eco+/Рейтинг (если есть), цена/мета, переход в детальную.
- Детальная: hero, мета/цена, блок «комиссия после тура», sticky CTA + MainButton ведут на лид.
- Лид отправляется (2xx), запись создаётся в `leads`.
- RLS не позволяет читать/писать чужие приватные записи под anon.

### 12. План релиза
- P0 (1–2 дня): каталог/детальная/лид, импорты, RLS/ENV, деплой.
- P1 (3–5 дней): Story, AR/VR фоллбек, отзывы, AI‑советник.
- P2 (5–7 дней): события, гео «рядом», таймлайн.

### 13. Риски
- Кэш/маршрутизация: 404 при неверной копии /public в `dist` → решено выгрузкой `public/*`.
- Supabase/сетевые ограничения из CI → решено Actions + pooled DSN при импорте.

### 14. Приложения
- Партнёрские туры: `public/partner-tours.json` (idempotent upsert в workflow).
- Маршруты API: `api/tg/*.ts`, `api/admin/*.ts`, `api/import/*.ts`.

