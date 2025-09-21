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

## Примечания
- Expo SDK 53, React 19, React Native 0.79.5
- Для EAS OTA Updates проверьте `extra.eas.projectId` и `updates.url`.