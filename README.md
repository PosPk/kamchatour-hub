# 🏔️ Kamchatour Hub - Приложение для путешественников по Камчатке

Многофункциональный хаб для путешественников по Камчатке с функциями безопасности, культуры, экологии, маршрутов и бронирований.

## ✨ Основные функции

### 🚨 **Безопасность**
- SOS система с геолокацией
- Экстренные контакты
- Информация об убежищах
- Уведомления о чрезвычайных ситуациях

### 🎭 **Культура**
- Мастер-классы местных ремесленников
- Культурные события и фестивали
- Карта ремесленных деревень
- AR-просмотр сувениров

### 🌿 **Экология**
- Мониторинг состояния окружающей среды
- Экологические советы для туристов
- Отчеты о состоянии природы
- Волонтерские программы

### 🗺️ **Туризм**
- Бронирование туров и экскурсий
- Активности на природе
- Размещение в эко-лоджах
- Поиск и фильтрация предложений
- Голосовой поиск (web) и AI‑подбор туров

### 🧭 **Активности**
- Экран `/activities` с карточками активностей (изображение, описание, бейджи сложности/длительности/тегов, цена)
- Источник данных: партнёр (Tilda API) с демо‑фолбэком

### 🚌 **Трансфер**
- Поиск рейсов, удержание мест (hold), бронирование, билеты (QR)
- Схемы мест: вахтовый автобус, джип (и расширяемо)
- Легенда статусов мест и прогресс‑бар таймера удержания
- Поддержка операторского и внешних перевозчиков
- Fallback: при отсутствии конфигурации Supabase используются локальные мок‑данные (демо)

### 🤖 **AI‑помощник**
- Экран `/ai`: чат для подсказок и навигации
- Пресеты быстрых вопросов (один тап — готовый запрос)
- API‑прокси к OpenAI без утечки ключей в клиент

### 🧩 **Кабинеты ролей**
- Путешественник: профиль, заказы, избранное, бусты
- Туроператор: управление турами и квотами
- Гид: маршруты и группы
- Трансфер: транспорт, расписания, места
- Агент: группы, ваучеры, комиссии
- Админ: пользователи, роли, мониторинг

## 🛠️ Технологический стек

- **Frontend**: React Native + Expo Router
- **Язык**: TypeScript
- **Навигация**: Expo Router с табами
- **Состояние**: React Context API
- **Хранение**: AsyncStorage
- **Геолокация**: Expo Location
- **Иконки**: Expo Vector Icons

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+ 
- npm или yarn
- Expo CLI
- Android Studio / Xcode (для эмуляторов)

### Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone <repository-url>
   cd kamchatka
   ```

2. **Установите зависимости**
   ```bash
   npm install
   ```

3. **Запустите приложение**
   ```bash
   npm start
   ```

4. **Выберите платформу**
   - Нажмите `a` для Android
   - Нажмите `i` для iOS
   - Нажмите `w` для веб-версии

## 📱 Структура приложения

```
app/
├── (tabs)/           # Основные табы приложения
│   ├── index.tsx     # Главный экран
│   ├── activities.tsx# Активности (каталог от партнёра)
│   ├── feed.tsx      # Фото-лента (локально)
│   ├── culture.tsx   # Культура
│   ├── eco.tsx       # Экология
│   ├── booking.tsx   # Бронирование
│   └── profile.tsx   # Профиль
├── ai/               # AI-помощник (чат UI)
├── auth/             # Аутентификация
├── operator/         # Кабинет туроператора
├── guide/            # Кабинет гида
├── transfer/         # Кабинет трансфера
├── agent/            # Кабинет агента
├── admin/            # Админ-панель
├── emergency/        # Экстренные ситуации
└── _layout.tsx       # Основной layout

components/            # Переиспользуемые компоненты
├── ui/               # UI компоненты
│  └── ActivityCard.tsx # Карточка активности
├── safety/           # Компоненты безопасности
├── culture/          # Культурные компоненты
└── eco/              # Экологические компоненты

contexts/             # React Contexts
├── AuthContext.tsx   # Аутентификация
├── LocationContext.tsx # Геолокация
├── RoleContext.tsx   # Роли и доступ
├── TotemContext.tsx  # Эко-баллы (локальные начисления + дневной лимит)
├── FavoritesContext.tsx # Избранное пользователя (локально)
├── BoostsContext.tsx # Бусты/скидки (локально)
├── OrdersContext.tsx # Заказы (локально)
├── ThemeContext.tsx  # Тема (светлая/тёмная)
├── AIContext.tsx     # Контекст AI-чата
└── EmergencyContext.tsx # Экстренные ситуации

lib/                  # Библиотеки
├── auth.ts           # Аутентификация
├── emergency.ts      # Экстренные функции
├── location.ts       # Геолокация
├── analytics.ts      # Аналитика (события воронки)
├── transfer.ts       # Клиент трансфера (fallback на мок‑данные)
├── tickets.ts        # Выпуск/проверка билетов (клиент)
├── nft.ts            # NFT off-chain загрузка (скaffold)
└── seatmaps/         # Схемы мест (bus/jeep)

api/                  # Serverless API (Vercel)
├── health.ts         # Проверка статуса
├── config.ts         # Публичные фичи/флаги
├── env.ts            # Наличие критичных ENV
├── pays/             # CloudPayments
│  └── create.ts      # Инициация платежа
├── webhooks/cloudpays.ts # Вебхуки оплаты (HMAC + идемпотентность)
├── orders/
│  ├── list.ts        # Список заказов (Supabase + фолбэк)
│  └── [id].ts        # Детали заказа
├── transfer/         # Трансфер API
│  ├── search.ts      # Поиск рейсов
│  ├── hold.ts        # Удержание мест
│  ├── book.ts        # Бронирование
│  ├── ticket.ts      # Выпуск QR‑билета
│  └── validate.ts    # Валидация QR‑билета
├── activities/
│  └── list.ts        # Каталог активностей (Tilda API + фолбэк)
├── feed/
│  ├── list.ts        # Лента постов
│  ├── post.ts        # Создать пост
│  ├── like.ts        # Лайк поста
│  └── comment.ts     # Комментарий к посту
└── ai/chat.ts        # Прокси к OpenAI (чат)

hooks/                # Кастомные хуки
├── useAuth.ts        # Хук аутентификации
├── useLocation.ts    # Хук геолокации
└── useEmergency.ts   # Хук экстренных ситуаций
```

## 🔧 Конфигурация

### Переменные окружения
Создайте файл `.env` в корне проекта:
```env
# API Keys (для будущего использования)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Emergency Services
EMERGENCY_API_KEY=your_emergency_api_key

# Weather API
WEATHER_API_KEY=your_weather_api_key
```

### Настройка геолокации
Приложение автоматически запрашивает разрешения на геолокацию при первом запуске.

## 📱 Демо-аккаунт

Для тестирования функций аутентификации используйте:
- **Email**: `demo@kamchatka.ru`
- **Пароль**: `demo123`

## 🧪 Тестирование

```bash
# Проверка типов TypeScript
npm run typecheck

# Линтинг
npm run lint

# Сборка
npm run build
```

## 💳 Тестовые данные оплаты (CloudPayments)

- Успешный платеж: `4242 4242 4242 4242` (любые CVC/срок)
- Неуспешный платеж: `4444 4444 4444 4444`
- Ошибка 3DS: `4000 0000 0000 0002`

## 🔧 Переменные окружения (оплата/интеграции)

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_CLOUDPAYMENTS_PUBLIC_ID=cp_test_public_id
CLOUDPAYMENTS_PUBLIC_ID=cp_test_public_id
EXPO_PUBLIC_SENTRY_DSN=https://example@sentry.io/1
CLOUDPAYMENTS_PUBLIC_ID=cp_test_public_id
CLOUDPAYMENTS_API_SECRET=your_api_secret
AI_PROVIDER=deepseek # или openai/groq
GROQ_API_KEY=grq-xxxxx
DEEPSEEK_API_KEY=sk-deepseek-xxxxx
EXPO_PUBLIC_BUGSNAG_API_KEY=your_bugsnag_key
AXIOM_TOKEN=your_axiom_ingest_token
AXIOM_DATASET=kamchatour-logs
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-xxxxx
AI_PROVIDER=deepseek # или openai/groq
GROQ_API_KEY=grq-xxxxx
DEEPSEEK_API_KEY=sk-deepseek-xxxxx
TILDA_PUBLIC_KEY=
TILDA_SECRET_KEY=
TILDA_PROJECT_ID=
```

### Supabase настройки (когда появится проект)
- В GitHub Secrets добавить:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY` (ваш anon jwt)
  - `SUPABASE_URL` (https://<project-ref>.supabase.co)
  - `SUPABASE_SERVICE_ROLE_KEY` (service_role jwt)
- В Vercel env добавить:
  - `CLOUDPAYMENTS_API_SECRET`
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- В Expo app использовать `EXPO_PUBLIC_*` переменные (подхватываются клиентом).
- Проектный ref: `zohfnqtqytsrrurgiati`
  - URL: `https://zohfnqtqytsrrurgiati.supabase.co`
  - Пример значений:
    - `EXPO_PUBLIC_SUPABASE_URL=https://zohfnqtqytsrrurgiati.supabase.co`
    - `SUPABASE_URL=https://zohfnqtqytsrrurgiati.supabase.co`

## 🛡️ Фолбэки и UX‑улучшения

- Трансфер: при недоступном Supabase (нет `EXPO_PUBLIC_SUPABASE_URL/ANON_KEY`) клиент использует безопасные мок‑данные для демонстрации поиска и схем мест. Реальные бронирования в этом режиме отключены.
- Эко‑баллы (Тотемы): при достижении дневного лимита показывается уведомление для прозрачности UX.
- Выбор мест: добавлена легенда статусов и прогресс‑бар таймера удержания мест.

## 🔄 Поток оплаты (упрощённо)

1. Клиент: пользователь жмёт «Оплатить» → создаётся заказ (pending_payment)
2. Клиент → `api/pays/create`: параметры для виджета CloudPayments
3. Клиент ← publicId → инициализация виджета (ввод карты)
4. CloudPayments → `api/webhooks/cloudpays` (Check): валидация заказа
5. CloudPayments → `api/webhooks/cloudpays` (Pay): результат оплаты
6. Вебхук → Supabase: статус заказа (`paid`/`payment_failed`) и запись в `payments`
7. Realtime → Клиент: мгновенное обновление UI; fallback — экспоненциальный пулинг

## 🚀 Обновления Expo (EAS Update) и Dev Client
- Owner: `pos-servis`, проект привязан (projectId в app.json)
- OTA: публикуем `eas update`; для устройств нужен первый Dev Client (`eas build --profile development`)

## 🗺️ Дорожная карта
- Подробный план по ролям и вехам: `docs/ROADMAP.md`

## 🔎 Мониторинг и логи
- Serverless: Axiom (ингест через `AXIOM_TOKEN`/`AXIOM_DATASET`), логирование вебхуков оплаты.
- Клиент: Bugsnag (инициализация при наличии `EXPO_PUBLIC_BUGSNAG_API_KEY`).
- Скрипт для установки переменных в Vercel: `scripts/set-vercel-env.sh` (нужны `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).

## 🧾 Отчёты по этапам
- Регулярные отчёты о прогрессе: `docs/REPORTS.md`

## 🚀 Онлайн-демо

Актуальная демо-версия: https://kamchatour-hub.vercel.app

Ключевые сценарии:
1. Каталог туров и активностей (поиск/фильтры)
2. Бронирование → оплата (CloudPayments) → статус
3. История заказов в профиле
4. Фото‑лента, публикация и лайки
5. Экран ENV `/env` для статуса окружения

Тестовые данные:
- Email: test@example.com, Пароль: test123
- Карта: 4242 4242 4242 4242 (любые CVC/срок)

Особенности:
- Адаптивный интерфейс web
- Офлайн‑фолбэки
- Интеграция партнёра (Tilda)

## 🚧 Статус разработки

### ✅ Реализовано
- [x] Базовая структура приложения
- [x] Навигация с табами
- [x] Система аутентификации
- [x] Геолокация и разрешения
- [x] SOS система
- [x] Основные экраны (Главная, Культура, Экология, Бронирование, Профиль)
- [x] Контексты и хуки
- [x] UI компоненты
- [x] Кабинеты ролей (экраны): оператор/гид/трансфер/агент/админ
- [x] Лента (локальная), аналитика событий, офлайн‑очередь
 - [x] Эко‑баллы (тотемы): локальные начисления + дневной лимит + уведомление
 - [x] Трансфер: ядро БД (routes/stops/trips/seats/holds/tickets), seatmaps (bus/jeep), API (search/hold/book), UI выбора мест с легендой и прогресс‑таймером удержания
 - [x] AI‑чат: экран /ai, контекст, пресеты быстрых вопросов, API‑прокси к OpenAI
 - [x] EAS Update: проект связан, опубликовано обновление

### 🔄 В разработке
- [ ] Интеграция с реальными API
- [ ] Карты и маршруты
- [ ] AR функциональность
- [ ] Push уведомления
- [ ] Офлайн режим
- [ ] Эко‑баллы (Тотемы): серверная синхронизация через Supabase RPC
 - [ ] Трансфер: билеты (QR) и валидация
 - [ ] Dev Client: сборки iOS/Android для OTA‑обновлений

### 📋 Планируется
- [ ] Интеграция с Supabase
- [ ] Система отзывов
- [ ] Социальные функции
- [ ] Многоязычность
- [ ] Темная тема

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для получения дополнительной информации.

## 📞 Поддержка

Если у вас есть вопросы или предложения:
- Создайте Issue в GitHub
- Обратитесь к документации Expo
- Проверьте раздел FAQ

## 🙏 Благодарности

- Команда Expo за отличную платформу
- Сообщество React Native
- Все участники проекта

---

**Сделано с ❤️ для путешественников по Камчатке**
