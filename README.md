# Kamchatour Hub (Expo)

Краткий гайд по проекту (RU).

## Локальная разработка
- Установка: `npm ci`
- Проверка окружения: `npx expo-doctor`
- Запуск (Expo Go): `npm start`
- Веб-режим (dev): `npm run web`

## Сборка Web
- Экспорт статического Web: `npm run build`
- Результат в `public/` (не коммитится)

## Тесты и качество кода
- Линтинг: `npm run lint` / автофикс `npm run lint:fix`
- Форматирование: `npm run format` / проверка `npm run format:check`
- Тесты: `npm test`

## Деплой (Vercel)
- Конфиг: `vercel.json` (static-build, SPA маршрутизация)
- CI (GitHub Actions): install → expo-doctor → lint → test → build

## Деплой (Yandex Cloud, Object Storage)
- Необходимо: создать бакет, включить Static website hosting, указать Index = `index.html`, Error = `error.html`.
- Локально: 
  - экспорт ключей в окружение: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, 
  - указать `YC_BUCKET` и `YC_REGION` (например, `ru-central1`),
  - выполнить: `scripts/deploy-yc.sh`.
- CI: добавьте `YC_AWS_KEY_ID`, `YC_AWS_SECRET`, `YC_BUCKET` в Secrets репозитория; workflow `deploy-yc.yml` синхронизирует `public/` в бакет с корректными cache headers и SPA fallback.

## Примечания
- Expo SDK 53, React 19, React Native 0.79.5
- Для EAS OTA Updates проверьте `extra.eas.projectId` и `updates.url`.