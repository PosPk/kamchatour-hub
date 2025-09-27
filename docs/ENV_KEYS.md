ENV keys (canonical)

AI / NLP / Vision
- GROQ_API_KEY — LLM (по умолчанию)
- OPENAI_API_KEY — LLM/embeddings
- DEEPSEEK_API_KEY — дизайн/варианты текстов
- XAI_API_KEY — LLM (xAI)
- ANTHROPIC_API_KEY — LLM
- GOOGLE_API_KEY — Gemini/Vertex (если используем)
- PERPLEXITY_API_KEY — поиск/мета‑поиск
- MISTRAL_API_KEY — LLM
- COHERE_API_KEY — rerank/embeddings
- OPENROUTER_API_KEY — маршрутизация к провайдерам
- DEEPL_API_KEY — переводы
- STABILITY_API_KEY — генерация/обработка изображений
- REPLICATE_API_TOKEN — модели CV/генерация
- LAKERA_API_KEY — безопасность ИИ
- V0_API_KEY — вспомогательные сервисы
- AI_PROVIDER — провайдер по умолчанию (groq|openai|anthropic|...)
- COHERE_RERANK_MODEL — модель ранжирования
- PERPLEXITY_MODEL — модель поиска

Core
- TELEGRAM_BOT_TOKEN / TELEGRAM_* — боты/вебхуки
- DATABASE_URL — PostgreSQL
- YC_BUCKET / YC_REGION — Object Storage
- NEXTAUTH_SECRET, YANDEX_CLIENT_ID/SECRET — OAuth

Где храним
- Vercel → pospks-projects/plan-b-web → Env Vars (Prod/Preview/Dev)
- Yandex Cloud → Lockbox/IAM (прод)
- Локально — .env (не коммитим)

Где используются
- new-web/api/ai/generate — GROQ_API_KEY (серверный прокси)
- operator-web/api/ai/proxy — прокси к вышеуказанному эндпоинту
- Поиск/ранжирование — PERPLEXITY/COHERE (после включения)
- Переводы — DeepL
- Media — Stability/Replicate (после включения)

