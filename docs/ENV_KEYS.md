# ENV keys (names only) — single source of truth

Server (Vercel env: production, preview, development)
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- YANDEX_CLIENT_ID
- YANDEX_CLIENT_SECRET
- YANDEX_MAPS_API_KEY (server geocoder/routes) [optional if using OSM fallback]
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_ANON_KEY
- CLOUDPAYMENTS_PUBLIC_ID
- CLOUDPAYMENTS_API_SECRET
- CLOUDPAYMENTS_ENABLED ("1" to enable) [optional]
- CLOUDPAYMENTS_COMMISSION (e.g. 0.1) [optional]
- TELEGRAM_BOT_TOKEN [optional]
- TELEGRAM_WEBHOOK_SECRET [optional]
- AI_PROVIDER [optional]
- OPENAI_API_KEY [optional]
- GROQ_API_KEY [optional]
- DEEPSEEK_API_KEY [optional]
- XAI_API_KEY [optional]
- AXIOM_TOKEN [optional]
- AXIOM_DATASET [optional]
- OP_LEVEL_DEFAULT (L1|L2|L3) [optional]

Client (public)
- NEXT_PUBLIC_YANDEX_MAPS_API_KEY (JS Maps)
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY
- EXPO_PUBLIC_CLOUDPAYMENTS_PUBLIC_ID [optional]
- EXPO_PUBLIC_BUGSNAG_API_KEY [optional]

Notes
- Secrets are NOT committed. Use .env locally and Vercel env in prod/preview.
- This file enumerates required/optional keys to avoid duplication.