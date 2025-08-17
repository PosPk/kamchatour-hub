# 🚀 Kamchatour Hub Backend

Революционная платформа экотуризма на Камчатке - Backend API

## 🌟 Особенности

- **🔐 Безопасность**: JWT аутентификация, 2FA, OAuth 2.0
- **🗄️ База данных**: PostgreSQL с PostGIS для геоданных
- **⚡ Производительность**: Redis кэширование, оптимизированные запросы
- **🔬 AI/ML**: Рекомендательные системы, нейронные сети
- **⚛️ Квантовые вычисления**: Оптимизация маршрутов
- **🥽 AR/VR**: API для иммерсивных экскурсий
- **🛡️ Страхование**: Интеграция с местными провайдерами
- **💪 Бусты**: Премиум услуги и эксклюзивные впечатления
- **📸 Фотоотчеты**: AI-анализ контента, социальные функции

## 🏗️ Архитектура

```
src/
├── 📁 routes/          # API маршруты
├── 📁 controllers/      # Контроллеры бизнес-логики
├── 📁 middleware/       # Промежуточное ПО
├── 📁 services/         # Бизнес-сервисы
├── 📁 models/           # Модели данных
├── 📁 utils/            # Утилиты и хелперы
└── 📁 config/           # Конфигурация

database/
├── 📁 migrations/       # Миграции БД
├── 📁 seeds/            # Начальные данные
└── 📁 schema.sql        # Схема БД

features/                 # Модули функциональности
├── 📁 aiRecommendations/
├── 📁 emergency/
├── 📁 ecoRating/
├── 📁 gamification/
├── 📁 arVr/
├── 📁 quantumComputing/
├── 📁 neuralNetworks/
├── 📁 insurance/
├── 📁 boosts/
└── 📁 photoReports/
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- PostgreSQL 15+ с PostGIS
- Redis 7+
- Docker & Docker Compose

### Установка

1. **Клонирование репозитория**
```bash
git clone https://github.com/your-username/kamchatour-hub.git
cd kamchatour-hub
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка переменных окружения**
```bash
cp .env.example .env
# Отредактируйте .env файл
```

4. **Запуск через Docker**
```bash
docker-compose up -d
```

5. **Или локальный запуск**
```bash
# Запуск PostgreSQL и Redis
docker-compose up postgres redis -d

# Запуск backend
npm run dev
```

### Переменные окружения

Создайте `.env` файл на основе `.env.example`:

```env
# База данных
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kamchatour_hub
DB_USER=postgres
DB_PASSWORD=kamchatour2024

# JWT
JWT_SECRET=your-super-secret-key

# Сервер
PORT=3000
NODE_ENV=development
```

## 📚 API Документация

### Аутентификация

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/2fa/setup
POST /api/auth/2fa/verify
```

### Пользователи

```http
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/preferences
PUT    /api/users/preferences
POST   /api/users/change-password
POST   /api/users/reset-password
```

### Маршруты и туры

```http
GET    /api/destinations
GET    /api/destinations/:id
GET    /api/routes
GET    /api/routes/:id
GET    /api/tours
GET    /api/tours/:id
POST   /api/bookings
```

### Страхование

```http
GET    /api/insurance/quote
POST   /api/insurance/purchase
GET    /api/insurance/policies
POST   /api/insurance/claims
```

### Бусты

```http
GET    /api/boosts
GET    /api/boosts/recommendations
POST   /api/boosts/book
GET    /api/boosts/bookings
```

### Фотоотчеты

```http
POST   /api/photo-reports
GET    /api/photo-reports
POST   /api/photo-reports/:id/like
POST   /api/photo-reports/:id/comments
```

## 🧪 Тестирование

```bash
# Запуск тестов
npm test

# Тесты с покрытием
npm run test:coverage

# E2E тесты
npm run test:e2e
```

## 🚀 Развертывание

### Docker

```bash
# Сборка образа
docker build -t kamchatour-backend .

# Запуск контейнера
docker run -p 3000:3000 kamchatour-backend
```

### Docker Compose

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f backend

# Остановка
docker-compose down
```

### Production

```bash
# Сборка для production
npm run build

# Запуск production сервера
npm start
```

## 📊 Мониторинг

- **Health Check**: `GET /health`
- **Метрики**: Prometheus endpoint
- **Логи**: Winston + Elasticsearch
- **Трассировка**: OpenTelemetry

## 🔧 Разработка

### Структура проекта

```
src/
├── routes/           # API маршруты
├── controllers/      # Контроллеры
├── services/         # Бизнес-логика
├── models/           # Модели данных
├── middleware/       # Промежуточное ПО
├── utils/            # Утилиты
└── config/           # Конфигурация
```

### Команды разработки

```bash
# Разработка с hot reload
npm run dev

# Сборка TypeScript
npm run build

# Проверка типов
npm run typecheck

# Линтинг
npm run lint

# Форматирование кода
npm run format
```

### Git Hooks

Проект использует Husky для автоматизации:

- **pre-commit**: Линтинг и проверка типов
- **pre-push**: Тесты и сборка

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл

## 🆘 Поддержка

- **Документация**: [Wiki](https://github.com/your-username/kamchatour-hub/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/kamchatour-hub/issues)
- **Discord**: [Kamchatour Hub Community](https://discord.gg/kamchatour)

## 🌟 Благодарности

Спасибо всем участникам проекта за вклад в создание революционной платформы экотуризма на Камчатке!

---

**Сделано с ❤️ для Камчатки и всего мира!** 🏔️🌋🐻