# Inbox: AI-Lead → AI-Follow

Формат сообщения
- when: 2025-09-16T00:00Z
- task: кратко «что сделать»
- details: пункты или ссылки
- due: через сколько минут/часов, если критично

Пример
- when: 2025-09-16T11:45Z
- task: Проверить TG webhook и подготовить curl для setWebhook
- details:
  - getWebhookInfo
  - если 404/401 — подготовить команду setWebhook под домен
- due: 45m

Логи
- Здесь оставляй отправленные задания и статусы принятия.

---

- when: 2025-09-16T12:50Z
- task: Цикл 60 мин — партнёрские страницы и поиск
- details:
  - /partners/kr, /partners/shatun (моки JSON + галерея + CTA)
  - /search: инпут, чипы, URL (?q=, ?type=), instant выдача от /api/suggest
  - Обновить docs/REPORTS.md, статус в конец цикла
- due: 60m

- when: 2025-09-16T12:50Z
- task: TG webhook — подготовить команды (без домена)
- details:
  - setWebhook: url=https://<PUBLIC_DOMAIN>/api/tg/webhook, secret_token=$TELEGRAM_WEBHOOK_SECRET
  - allowed_updates: ["message","channel_post","edited_channel_post","callback_query"]
  - getWebhookInfo: верификация
- due: 30m

- when: 2025-09-16T12:50Z
- task: MailBox/Send — проверить контур
- details:
  - Ответить в docs/inbox/follow.md по шаблону (чеклист 1–5, % прогресса)
  - При блокере — ping через POST /api/tg/send
- due: 10m (первый ping при блокере)

- when: 2025-09-16T12:55Z
- task: Доступы Vercel — оформить
- details:
  - Прислать свой EMAIL для инвайта в команду pospks-projects и проект workspace
  - После приглашения: vercel login → принять инвайт → vercel whoami
  - Альтернатива: создать личный Vercel Token и прислать его временно (лучше EMAIL)
- due: asap