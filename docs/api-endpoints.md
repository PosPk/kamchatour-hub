## API endpoints (current repository)

- Base: root project served via Vercel with `vercel.json` (static + serverless)
- Note: Deployment currently misconfigured; endpoints exist in code but 404 in prod until Root Directory is fixed.

### Core
- GET `/api/health`
- GET `/api/env`
- GET `/api/config`

### Telegram
- POST `/api/tg/webhook`

### Payments
- POST `/api/webhooks/cloudpays`
- POST `/api/pays/create`

### Orders
- GET `/api/orders`
- GET `/api/orders/[id]`

### Activities
- GET `/api/activities/list`

### Feed
- GET `/api/feed/list`
- POST `/api/feed/comment`
- POST `/api/feed/like`
- POST `/api/feed/post`

### Transfer
- POST `/api/transfer/book`
- POST `/api/transfer/validate`
- GET `/api/transfer/search`
- GET `/api/transfer/ticket`
- GET `/api/transfer/trip`
- POST `/api/transfer/hold`

### new-web (Next.js app)
- GET `/api/health` (implemented at `new-web/src/app/api/health/route.ts`)

---

References:
- Serverless routes source: `api/*`
- Static export served from `dist/` via `@vercel/static-build`
- Middleware (new-web) protecting `/api/*` by `x-api-key`: `new-web/middleware.ts`

Suggested fetch link for parallel project after push:
- GitHub view: `https://github.com/PosPk/PlanB/blob/main/docs/api-endpoints.md`
- Raw file: `https://raw.githubusercontent.com/PosPk/PlanB/main/docs/api-endpoints.md`

