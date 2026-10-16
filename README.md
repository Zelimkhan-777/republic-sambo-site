# Республиканская школа самбо — сайт

Фронтенд официального информационного сайта ГБУ ДО «Республиканская школа самбо».

## Стек

- Vue 3 и Vite
- Vue Router
- Directus SDK
- обычный CSS
- Docker и Nginx для Amvera

## Локальный запуск

```bash
cp .env.example .env
npm install
npm run dev
```

В `.env` укажите публичный адрес Directus:

```env
VITE_DIRECTUS_URL=https://cms.example.ru
```

Если адрес Directus не задан или CMS временно недоступна, сайт показывает демонстрационные данные из `src/data/fallback.js`.

## Сборка

```bash
npm run build
```

Для Amvera подготовлены `Dockerfile`, `nginx.conf` и `amvera.yml`. Перед сборкой приложения добавьте переменную `VITE_DIRECTUS_URL` в окружение сборки.
