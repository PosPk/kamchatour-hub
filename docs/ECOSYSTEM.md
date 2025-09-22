# Kamchatour Hub — Экосистема туризма Камчатки

Цель: модульная экосистема для туристов и туроператоров: каталог/поиск, бронирование/оплата, CRM и календарь ресурсов (гиды/транспорт/размещение), безопасность (SOS/МЧС/сейсмика), контент и SEO/NLP, аналитика. Архитектура облачная, с офлайн‑поддержкой и автоматизацией через ИИ.

## Персоны
- Турист: выбор туров, оплата, уведомления, офлайн‑карты, SOS.
- Туроператор: витрина, лиды/сделки, слоты, ресурсы, отчёты, выплаты.
- Гид/ресурс: смены, подтверждения, замены.
- Диспетчер: мониторинг групп, инциденты, перестроение маршрутов.
- ИИ‑админ: автоматизация (маршруты/ресурсы/трансферы), контент, SEO.

## Продукты/модули
- Публичный сайт (Next.js, `new-web`): главная v2 (герой/поиск/карточки/безопасность/«карта медведей»/партнёры/акции/рефералы/эко‑баллы), каталог `/partners` и карточки `/partners/[slug]`, поиск, SEO.
- Мобильный/PWA (Expo, `kamchatour-hub`): офлайн, SOS/МЧС/сейсмика, уведомления.
- Портал оператора (`operator-web`): вход/дашборд, лиды/сделки, календарь слотов, ресурсы, отчёты, бусты/рефералы.
- CRM/календарь: слоты/квоты, назначение гидов/транспорта/номеров, статусы (hold/paid/confirmed), возвраты.
- Коммуникации: Telegram (вебхук/рассылки/алерты, MiniApp позже).
- Безопасность: регистрация МЧС, SOS, сейсмика, «карта медведей» (GeoJSON слой).
- Коммерция: CloudPayments (authorize/capture, webhooks), сувениры/аренда, предзаказ питания.
- Контент/медиа: пайплайн изображений (Я.Диск → resize/WebP/AVIF → Object Storage/CDN), парсинг Tilda/Авито/idilesom.
- ИИ: NLP (SEO/FAQ/alt, семантический поиск, переписывание), Vision (отбор/теги/srcset), OR‑Tools (оптимизация), Groq LLM (endpoint `/api/ai/generate`).
- Геймификация: рефералы/бусты (снижение комиссий, фичеринг), эко‑баллы.

## Ключевые процессы
1) Привлечение → поиск → лид/бронь → оплата → подтверждение → поездка → отзыв.
2) Онбординг партнёра: регистрация/KYC → витрина → интеграции каталога/медиа → комиссии/бусты.
3) Каталог: импорт источников → нормализация → публикация → SEO.
4) Бронирование/оплата: проверка слотов/ресурсов → предавторизация → назначение ресурсов → капчер → документы.
5) Погода: событие риска → ИИ‑альтернативы → подтверждения → обновление маршрутов/трансферов.
6) SOS/МЧС/сейсмика: регистрация групп, экстренная передача координат/состава, оповещения.
7) Рефералы/бусты: `?ref=code` (cookie 30 дней) → клик → бронь → активация буста (антифрод/холд).
8) Эко‑баллы: начисления за «зелёные» действия, витрина наград/скидок.
9) Предзаказ питания: слоты точек питания по маршрутам, оплата/чек.
10) Отчётность/выплаты: заявки/конверсии/загрузка ресурсов/доход/выплаты/рефералы/эко‑баллы.

## Доменная модель (укрупнённо)
Partner, Tour, TourVariant, Slot, Price, Media, Place (Geo), Alert (seismic/bear);
Resource: Guide, Vehicle, Room, Equipment; Booking, Lead, Customer, Payment, Refund, Voucher;
ReferralClick, ReferralAttribution, Boost, EcoPoint; Message/Notification, WebhookEvent; Inventory/Order.

## Архитектура и сервисы
- Frontend: `new-web` (Next 14, App Router, static export), `kamchatour-hub` (Expo), `operator-web` (Next 14).
- Backend (serverless): Yandex Cloud Functions (Node 18) — health/env/tg-send/tg-webhook/ref/*/ai; Yandex API Gateway `/api/*`.
- Данные: Yandex Managed PostgreSQL; Redis (кэш/очереди); YDB (опц.)
- Хранилище/CDN: Yandex Object Storage (static+media), CDN (опц.).
- Платежи: CloudPayments (authorize/capture, webhooks, refunds).
- OAuth: Yandex OAuth (login/email, Disk); NextAuth (опц.).
- Интеграции: Telegram Bot API; источники Tilda/Авито/Я.Диск; idilesom API (по запросу).
- ИИ: Groq (GROQ_API_KEY; `/api/ai/generate`), Deepseek/Uizard (дизайн), OR‑Tools (оптимизации).
- Мониторинг: Yandex Metrika, TG алерты, позже — APM.
- Секреты/доступы: Vercel/YC secrets, Lockbox/IAM.
- CI/CD: GitHub Actions → Vercel; Next export → Object Storage; Makefile для функций/APIGW.

## Безопасность
Least privilege (IAM/Lockbox), валидации/HMAC/секрет‑заголовки, политика возвратов/ПДн, страхование туристов.

## SEO/NLP
Lighthouse ≥ 90, Schema.org, sitemap/robots/canonicals. NLP: мета/FAQ/alt, семантический поиск, автотеги/кластеризация.

## Офлайн‑first
Кеш UI/данных, очереди, репликация, офлайн‑карты/инструкции.

## Роадмап (MVP → V1)
Sprint 0–1: скелеты web/portal, TG, YC Functions, KR/IAM, Info Stand, Groq.
Sprint 2: главная v2, рефералы/бусты (MVP), ingest KR, API Gateway, экспорт в Object Storage.
Sprint 3: бронирование/оплата, календарь ресурсов, уведомления.
Sprint 4: SOS/МЧС/сейсмика, «карта медведей», офлайн.
Sprint 5: магазин/аренда/питание, отчёты/выплаты, DataLens.

## Переменные окружения (ключевые)
TELEGRAM_*; NEXTAUTH_SECRET; YANDEX_CLIENT_ID/SECRET; DATABASE_URL; YC_BUCKET/YC_REGION; GROQ_API_KEY; AI_API_SECRET.

— Документ будет расширяться по мере итераций (детализация API/DB/UI в профильных файлах).

