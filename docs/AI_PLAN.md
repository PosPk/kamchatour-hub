# AI Architecture, APIs, Roles, and P0 Plan

## Modules and Responsibilities
- AI.Loop (Orchestrator): SLA timers, cron jobs, incident handling, feature flags, auto reports.
- AI.Safety (Guardrails): Moderation for text/media and action gating; spam/fraud checks.
- AI.Ensemble (Decision Support): Lead scoring, matching (lead ↔ guide/transfer), task prioritization.
- AI.Recommend (Assistant Prompter): Offer suggestions, reply templates, notification copy.
- AI.Chat (Operator Assistant): Dialogue triage/summarization, quick replies, CRM tool usage.
- AI.Observer (Analytics): Metrics, anomalies, daily digests to Telegram; dashboards.

## Key Technical Decisions
- Event Bus: Supabase realtime events (e.g., lead.created/assigned) for AI modules to subscribe to.
- Feature Flags: Table-driven flags (enable/disable modules) without redeploys.
- HITL: Human-in-the-loop override on AI actions (edit/approve before send).
- Models: Local (Ollama Qwen2.5:3B) for routine; external (DeepSeek/OpenAI/Groq/YandexGPT) for complex.

## Required/Planned APIs
- Yandex: Maps JS, Geocoder (1.x), Routes (ETA/distance), Suggest (autocomplete), Geolocation, Static Maps.
- Payments: CloudPayments live webhook; status reconciliation.
- Auth: Yandex OAuth (preview/prod redirect URIs).
- Telegram: Webhook with commands (/todo, /assign, /status), channel posts.
- Email SMTP: Transactional templates (lead.created/assigned/SLA).
- Supabase RPC: reserve_seat/confirm/cancel (prod), pg_cron for SLA, RLS per role.
- Partners: Tilda import; (optional) U‑ON status webhook.

## Roles and Ownership
- AI.Loop — Administrator/Orchestrator.
- AI.Safety — Policy/Moderation.
- AI.Ensemble — Decision Support (scoring/matching).
- AI.Recommend — Offers/Templates.
- AI.Chat — Operator Assistant.
- AI.Observer — Metrics/Anomalies/Digests.

## P0 Plan (Next 24h)
1) Supabase migrations 0007→0013 (prod)
   - Apply in small batches; validate RPC and RLS per role.
   - Smoke: /api/transfer/hold|book, /api/crm/leads.
2) NextAuth (Yandex) smoke
   - /api/auth/signin on preview/prod; confirm redirect URIs in Yandex OAuth.
3) CRM Deals — Paid/Closed + reconcile
   - Sync with payment webhook; end-to-end consistency.
4) E2E critical path
   - search → hold → pay → confirm (automated smoke; metrics).
5) Leads Kanban (MVP)
   - Filters/assign/offer; SLA 2h highlight; quick actions.
6) Maps / Geocoder
   - Switch server geocoder to Yandex; quotas/cache/rate-limit; /maps smoke.
7) Telegram intake/notifications
   - /api/tg/webhook (secret set); events: lead.created/assigned/SLA.
8) Roles/RLS
   - Finalize access matrix (operator/guide/transfer/admin) + audit.

### Checkpoints (today)
- 12:00 — Migrations applied; RPC/RLS report.
- 14:00 — NextAuth smoke (preview/prod).
- 16:00 — E2E green; Yandex geocoder enabled.
- 18:00 — Kanban MVP and Telegram events enabled.

## Current Status Snapshot
- Env configured: NEXTAUTH_URL/SECRET, Supabase, CloudPayments, Yandex OAuth, TG bot.
- Maps: Public JS key set; OSM fallback live; Yandex key active → switching.
- Preview: new-web-tan.vercel.app; /api/health OK.
- Progress (approx.): CRM core 60%; Leads 100%; Deals 60%; Kanban 50%; Calendar 45%.