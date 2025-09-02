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
│   ├── culture.tsx   # Культура
│   ├── eco.tsx       # Экология
│   ├── booking.tsx   # Бронирование
│   └── profile.tsx   # Профиль
├── auth/             # Аутентификация
├── emergency/        # Экстренные ситуации
└── _layout.tsx       # Основной layout

components/            # Переиспользуемые компоненты
├── ui/               # UI компоненты
├── safety/           # Компоненты безопасности
├── culture/          # Культурные компоненты
└── eco/              # Экологические компоненты

contexts/             # React Contexts
├── AuthContext.tsx   # Аутентификация
├── LocationContext.tsx # Геолокация
└── EmergencyContext.tsx # Экстренные ситуации

lib/                  # Библиотеки
├── auth.ts           # Аутентификация
├── emergency.ts      # Экстренные функции
└── location.ts       # Геолокация

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

### Supabase (схемы — кратко)
- Таблица `operators`: id (text), name, website, phone, regions (text[]), activities (text[]), verified (bool), partnerLevel (text), score (int), description, logoUrl.
- Таблица `tours`: id, operatorId, title, region, activity, priceFrom (int), durationDays (int), rating (float), description.
- Дополнительно: `slots`, `bookings`, `messages` и т.п. по мере внедрения.

В приложении работает отложенное подключение: при наличии `SUPABASE_URL`/`SUPABASE_ANON_KEY` данные будут браться из БД, иначе — использованы моки.

### Безопасность (RLS) — обязательно
1. В Supabase SQL Editor примените файлы `supabase/schema.sql` и `supabase/rls.sql`.
2. Убедитесь, что для таблиц включён RLS и созданы политики, как в `rls.sql`.
3. Используйте Service Role ключ ТОЛЬКО на сервере. В клиенте — анонимный ключ с RLS.
4. Проверьте, что пользователь видит только свои бронирования, сообщения и эко‑действия.

### Аудит, платежи и rate limiting (SQL)
Порядок применения в Supabase → SQL Editor:
1) `supabase/schema.sql`
2) `supabase/rls.sql`
3) `supabase/audit.sql` — создаёт `audit_log` и триггеры на ключевые таблицы
4) `supabase/payments.sql` — таблица `payments`, idempotency key + advisory lock
5) `supabase/rate_limit.sql` — таблица `auth_attempts` и функция `check_rate_limit`
6) `supabase/announcements.sql` — объявления (модерация) и лиды для Telegram
7) `supabase/booking.sql` — статусы предброни и события

Проверки:
- Аудит: выполнить INSERT/UPDATE/DELETE в `bookings` и убедиться, что запись попала в `audit_log`.
- Платежи: два вызова `create_payment_safe` с одинаковым ключом возвращают одну запись.
- Rate limit: `check_rate_limit(email,'login',5,1)` возвращает false после 5 записей за минуту.

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

## CI: Применение SQL к Supabase из репозитория

Workflow: `.github/workflows/apply-supabase-sql.yml`

Секреты в GitHub → Settings → Secrets and variables → Actions:
- `SUPABASE_PGHOST` = db.<project>.supabase.co
- `SUPABASE_PGUSER` = postgres
- `SUPABASE_PGPASSWORD` = пароль
- `SUPABASE_PGDATABASE` = postgres
- `SUPABASE_PGPORT` = 5432

Запуск: Actions → Apply Supabase SQL → Run workflow → apply = yes.

### Booking (предбронь) — API

```bash
curl -X POST https://<host>/api/booking/prebook \
  -H 'Content-Type: application/json' \
  -d '{"tour_id":"t1","contact":"@user","party_size":2,"tg_user_id":"123"}'

curl -X POST https://<host>/api/booking/cancel \
  -H 'Content-Type: application/json' \
  -d '{"id":"<booking-id>","reason":"change of plans"}'
```

### Импорт туров партнёра

1) Подготовьте JSON (пример: `public/partner-tours.json`)
```json
[
  {"id":"t1","title":"Рыбалка на Камчатке","region":"Южная Камчатка","activity":"рыбалка","price_from":55000,"duration_days":3,"rating":4.8,"operator_id":"partner_fishing_kam"}
]
```

2) Импорт в Supabase (админ‑токен):
```bash
curl -X POST https://<host>/api/import/partner-tours \
  -H 'Content-Type: application/json' \
  -H 'x-admin-token: $ADMIN_API_TOKEN' \
  -d @public/partner-tours.json --data-urlencode "items=@-"
```

3) Telegram‑витрина читает `public/partner-tours.json` и рендерит список.

### Telegram витрина: объявления и лиды

1) Примените SQL:
   - `supabase/announcements.sql` — создаёт таблицы `public.announcements` (модерация: pending/approved/rejected) и `public.leads`, включает RLS и политики (публично видны только `approved`).

2) Переменные окружения (Vercel → Project Settings → Environment Variables):
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — серверный доступ из API-роутов
   - `TG_WEBHOOK_TOKEN` — аутентификация вебхука `/api/tg/post`
   - `ADMIN_API_TOKEN` — аутентификация `/api/admin/announcements`

3) API:
   - Вебхук Telegram постов → `POST /api/tg/post` с заголовком `x-telegram-token`
     - записывает объявление в `announcements` со статусом `pending`
   - Модерация:
     - `GET /api/admin/announcements?status=pending` — список на модерацию (заголовок `x-admin-token`)
     - `POST /api/admin/announcements` — `{ id, action: "approve" | "reject" }`
   - Лиды:
     - `POST /api/tg/lead` — `{ name, contact, tour_id?, tg_user_id?, tg_chat_id?, payload? }`

4) Витрина Telegram (статические страницы):
   - Доступны после билда: `/tg`, `/tg/tours/t1`, `/tg/lead`
   - Сборка кладёт `public/*` в `dist/` автоматически (скрипт `build:web`)
   - Для темизации используйте Telegram `themeParams` (опционально)

## ⚙️ CI/CD: Деплой Expo Web на GitHub Pages

1. Включите GitHub Pages в настройках репозитория: Source = GitHub Actions.
2. Workflow уже добавлен: `.github/workflows/deploy-pages.yml`.
3. При пуше в ветку `main` запускается сборка `expo export --platform web`,
   результат публикуется в Pages. Для SPA настроен fallback `404.html`.
4. Если используете кастомный домен, добавьте `CNAME` в `dist` (шаг в workflow при необходимости).

Переменные/секреты: в текущей конфигурации не требуются (публичный билд). Если добавите внешние ключи/SDK — хранить их в `Repository secrets` и прокидывать в job env.

## 🧭 Журнал внедрения (Implementation Log)

P0 — Безопасность и платежи
- Добавлены RLS‑политики и схемы: `supabase/schema.sql`, `supabase/rls.sql` (FORCE RLS включайте в панели).
- Аудит: `supabase/audit.sql` — `audit_log` + триггеры на ключевые таблицы.
- Платежи: `supabase/payments.sql` — идемпотентность (`idempotency_key` + `pg_advisory_xact_lock`) и таблица `payments`.
- Rate limiting: `supabase/rate_limit.sql` — учёт попыток и функция `check_rate_limit`.
- Комиссии: `supabase/commissions.sql` — `commission_tiers`, `commission_history`, расширение `operators`.
- Сервис комиссий: `lib/commission.ts` — override → tier → default, поддержка min/max, историю фиксируем через `commission_history`.

Как применять SQL (порядок):
1) `supabase/schema.sql` → 2) `supabase/rls.sql` → 3) `supabase/audit.sql` → 4) `supabase/payments.sql` → 5) `supabase/rate_limit.sql` → 6) `supabase/commissions.sql`.

Проверки после применения:
- RLS: анонимный клиент не видит чужие данные; авторизованный видит только свои.
- Аудит: изменения в `bookings`/`messages` попадают в `audit_log`.
- Платежи: два вызова `create_payment_safe` с одинаковым ключом — одна запись.
- Комиссии: `calculateCommission(amount, operatorId)` возвращает корректный источник (override/tier/default) и сумму.

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

### 🔄 В разработке
- [ ] Интеграция с реальными API
- [ ] Карты и маршруты
- [ ] AR функциональность
- [ ] Push уведомления
- [ ] Офлайн режим

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
