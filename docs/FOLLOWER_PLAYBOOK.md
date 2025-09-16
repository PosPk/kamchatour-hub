# FOLLOWER PLAYBOOK (TourHab)

Краткая инструкция для ассистента‑последователя. Цель — продолжать работу автономно, с отчётами в Telegram и коммитами в репозиторий.

## 1) База
- Репозиторий: PosPk/kamchatour-hub
- Текущая рабочая ветка для экспорта чата: `chat-export-2025-09-16`
- Экспорт чата: `docs/chat-exports/2025-09-16_part{1,2,3}.md`

Команды:
```bash
git fetch origin
git checkout chat-export-2025-09-16
git pull
```

## 2) Рутины (ежечасно)
- Прочитать новые сообщения/задачи → обновить TODO/план.
- Статус в Telegram: прогресс по задачам (в процентах), блокеры, следующие шаги.
- Если изменяешь код — коммит мелкими, атомарными порциями; пуш в PR/ветку.

## 3) Окружения и ключи
Ключи хранятся в Vercel env (prod/preview/dev). Имена переменных перечислены в `docs/ENV_KEYS.md`.

Проверка (при наличии доступа):
```bash
# Требуются: VERCEL_TOKEN, VERCEL_ORG_ID (team/slug), VERCEL_PROJECT_ID
vercel whoami --token "$VERCEL_TOKEN" | cat
vercel projects ls --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" | cat
vercel env ls --project "$VERCEL_PROJECT_ID" --environment production --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" | cat
```

Основные ключи:
- Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`
- Telegram: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`
- Payments: `CLOUDPAYMENTS_PUBLIC_ID`, `CLOUDPAYMENTS_API_SECRET`
- Maps: `NEXT_PUBLIC_YANDEX_MAPS_API_KEY`, `YANDEX_MAPS_API_KEY`
- AI: `AI_PROVIDER`, `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`, `GROQ_API_KEY`, `XAI_API_KEY`, `V0_API_KEY`

## 4) Telegram Webhook
Установка вебхука (выполняется на стороне с токенами):
```bash
curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -d "url=https://<DOMAIN>/api/tg/webhook" \
  -d "secret_token=$TELEGRAM_WEBHOOK_SECRET"
# Проверка
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo"
```
Код обработчика: `new-web/src/app/api/tg/webhook/route.ts`.

## 5) Локальный запуск
```bash
cd new-web
npm i
npm run dev
# билд
npm run build && npm start
```
Страницы: `/` (главная), `/tours`, `/maps`; API: `/api/geocoder`, `/api/suggest`, `/api/routes`, `/api/v0`.

## 6) AI проверка
- Свитчер провайдера: `AI_PROVIDER` (deepseek/openai/groq/xai)
- Chat proxy: `api/ai/chat.ts` (Node API) и `new-web/src/app/api/v0/route.ts`
Тест (x.ai пример):
```bash
curl -s https://<DOMAIN>/api/ai/chat -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"Кто ты?"}],"provider":"xai"}'
```

## 7) Supabase
Миграции 0007→0013 применены. Смоук‑тест:
- `api/crm/leads.ts` — POST/GET лида (дедупликация по контакту)
- `api/crm/deals.ts` — CRUD/PATCH статуса
- Проверить RLS/политики чтения/записи (минимальные кейсы)

## 8) Деплой
- Проект Vercel: `workspace` (см. `docs/ACCESS.md`)
- Конфиг: `vercel.json` (Next.js + API роуты)
- Образы: Node 20; Next.js App Router.

Команда превью (при доступе):
```bash
vercel --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" --confirm | cat
```

## 9) Дизайн и контент
- Главная и `/tours` — привести к бренду TourHab (шрифты/токены/карточки)
- Партнёры: `/partners/{kr,shatun}`
  - KR: контент из Tilda API → JSON
  - ШАТУН: медиа с Яндекс.Диска → JSON
- `next.config.ts` уже включает домены изображений (Unsplash/Tilda/YandexDisk)

## 10) Отчётность в TG (канал KamchatourHub)
Формат сообщения:
- Заголовок: [Статус] Дата/время
- Прогресс по задачам (%), сделанное/в процессе/блокеры
- Ссылки на превью/деплой/ветки

Пример:
```
P0 (демо) — 68%
— Главная + /tours: 80% (ожидает правки картинок)
— Партнёры KR/ШАТУН: 50% (ингест контента в работе)
— TG webhook: ок; /status отвечает; авто-отчёты включены
— Блокеры: доступ к Vercel env для проверки ключей
```

## 11) Коммит‑месседжи
- feat(scope): ... — для фич
- fix(scope): ... — для исправлений
- docs: ... — для документации/плейбуков/экспортов

## 12) Контроль качества
- Typecheck/lint/build локально до пуша
- Lighthouse базово: главная и `/tours`
- Проверить 404/маршруты `/tg`, `/maps`, `/help` (когда появится)

## 13) Если нет доступа к внешним системам
- Делай офлайн‑шаги (код/контент/тесты)
- Готовь команды для оператора (curl/vercel), отправляй в TG
- Всё фиксируй в `docs/REPORTS.md` и в ветке задач

---
Поддерживай прозрачность: каждый шаг — в коммите и коротком статусе в Telegram.