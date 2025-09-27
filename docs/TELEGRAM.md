Telegram integration (Yandex Cloud)

Overview
- Endpoints (Yandex Cloud Functions):
  - POST /api/tg/send — send message to Telegram chat
  - POST /api/tg/webhook — Telegram webhook receiver
- API Gateway spec: yc/openapi.yaml

Secrets
- TELEGRAM_BOT_TOKEN — bot token
- TELEGRAM_CHAT_ID — default chat id for outbound
- TELEGRAM_WEBHOOK_SECRET — secret for webhook verification
- TELEGRAM_SEND_SECRET — shared secret for /api/tg/send header

Deploy
1) Build zips and deploy functions: make -C yc deploy
2) Create or update API Gateway from spec: make -C yc apigw
3) Set webhook URL (gateway HTTPS URL):
   export TELEGRAM_WEBHOOK_URL="https://<apigw-id>.apigw.yandexcloud.net/api/tg/webhook"
   make -C yc webhook

Test send
curl -s -X POST "https://<apigw>/api/tg/send" \
  -H "content-type: application/json" \
  -H "X-Telegram-Send-Secret: TH_SEND_2025_09" \
  -d '{"chat_id": "171286547", "text": "[AI-Lead] Hello from YC Functions"}'

Notes
- Webhook secret header: X-Telegram-Bot-Api-Secret-Token
- Send secret header: X-Telegram-Send-Secret
- Node.js runtime: 18
- Commands: /start, /help, /ping, /status
