# Kamchatka (Expo)

Минимальное Expo‑приложение для проверки переменных окружения и доступности API `/health`.

— Владелец: `pos-servis`
— Slug: `kamchatour-hub`
— Android package: `com.posservis.kamchatka`
— Project ID (EAS): `34abf0cb-fdf3-48b7-b93a-129e3ba369b0`
— Deeplink‑схема: `kamchatka://`

## Что делает приложение
На экране «Проверка окружения» отображает:
- текущее окружение (`EXPO_PUBLIC_ENV`)
- базовый URL API (`EXPO_PUBLIC_API_BASE_URL`)
- отчёт по запросу `${EXPO_PUBLIC_API_BASE_URL}/health` (HTTP статус, длительность, время, тело/ошибка)

### Режим гостя
- Экран входа с кнопкой «Войти как гость»
- В гостевом режиме доступен только просмотр «Витрины» (read‑only):
  - баннер «Режим гостя: только просмотр»
  - возможность вручную повторить health‑проверку
  - кнопка «Выйти» для возврата на экран входа

## Переменные окружения (Expo → Project Settings → Environment Variables)
Задайте значения для каждого окружения (Development / Preview / Production):

- `EXPO_PUBLIC_API_BASE_URL`
  - Development: https://dev.api.example.com
  - Preview: https://staging.api.example.com
  - Production: https://api.example.com

- `EXPO_PUBLIC_ENV`
  - Development: `development`
  - Preview: `staging`
  - Production: `production`

Примечание: переменные с префиксом `EXPO_PUBLIC_` доступны на клиенте через `process.env.*`.

## Запуск локально
```bash
npm install
npx expo start
```
Доступные варианты: Expo Go, Android эмулятор, iOS симулятор, development build.

## Предпросмотр (Snack)
Для быстрого просмотра можно опубликовать Snack и задать переменные окружения в настройках Snack. Учтите, что в веб‑превью возможны ограничения CORS для запросов к вашему API.

## Сборка через EAS
Требуется `eas-cli` и токен/доступ к аккаунту `pos-servis`.

1) Конфигурация уже подготовлена:
- `app.json` — владелец/slug/пакет/`extra.eas.projectId`
- `eas.json` — профили `preview`/`production`, `cli.appVersionSource: "remote"`
- `package.json` — `main: "index.js"`

2) Android‑креды (обязательно):
- В Expo → Project → Credentials → Android создайте Keystore (или загрузите свой: .jks + пароли).
- В неинтерактивном режиме генерация невозможна — придётся сделать это в панели или интерактивно.

3) Запуск сборки (пример для Android preview):
```bash
EXPO_TOKEN=YOUR_TOKEN npx eas-cli build --platform android --profile preview --non-interactive
```
После старта команда вернёт URL билда на `expo.dev`.

4) iOS
- Добавьте `ios.bundleIdentifier` в `app.json`
- Настройте сертификаты/профили (через EAS Credentials)

## Диагностика и частые проблемы
- `EXPO_PUBLIC_API_BASE_URL is not set`: переменная не задана в проекте Expo
- 4xx/5xx на `/health`: проверить URL/бэкенд/авторизацию
- CORS в Snack/Web: используйте Expo Go на устройстве или настройте CORS на API
- EAS: «Generating a new Keystore is not supported in --non-interactive mode» — создайте Keystore в панели Expo → Credentials
- Несоответствие slug/Project ID: `extra.eas.projectId` — это UUID, а не `@owner/slug`

## Текущее дерево и замечания
- Нет `app/` и роутинга; `expo-router` не используется (можно удалить зависимость)
- Главный экран: `App.js`
- Входная точка: `index.js`

## Полезные ссылки
- Документация Expo: https://docs.expo.dev/
- EAS Build: https://docs.expo.dev/build/introduction/
- Переменные окружения: https://docs.expo.dev/guides/environment-variables/
