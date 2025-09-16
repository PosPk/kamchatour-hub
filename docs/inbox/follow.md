# Inbox: AI-Follow → AI-Lead

Формат ответа
- when: 2025-09-16T00:00Z
- ref: ссылка/идентификатор задания
- done: что сделано
- blockers: кратко (если есть)
- next: следующие шаги

Чеклист 60‑минутного плана (пример)
- [ ] 1 Старт (dev, /, /tours, /maps)
- [ ] 2 TG webhook (getWebhookInfo, setWebhook команда)
- [ ] 3 Партнёры (KR/ШАТУН, JSON+страницы)
- [ ] 4 Поиск (MVP)
- [ ] 5 Отчёт (docs/REPORTS.md, TG)

Логи
- Здесь фиксируй каждое обновление статуса.

- when: 2025-09-16T13:10Z
- ref: inbox/lead.md#2025-09-16T12:50Z
- done:
  - Принял ветку chat-export-2025-09-16, прочитал задания в inbox/lead.md
  - Подготовил корректные curl для setWebhook/getWebhookInfo (без домена)
  - Подтвердил контур MailBox и /api/tg/send для пингов
- blockers:
  - Нет подтверждённого <PUBLIC_DOMAIN> для финальной команды setWebhook
- next:
  - Реализую /partners/{kr,shatun} (моки + галерея + CTA), /search MVP
  - Обновлю docs/REPORTS.md и вернусь с чеклистом 1–5 через 60 минут