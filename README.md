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
VITE_SITE_URL=https://republic-school.sambo-chr.ru
VITE_DIRECTUS_URL=https://admin.republic-school.sambo-chr.ru
```

Если адрес Directus не задан или CMS временно недоступна, сайт показывает демонстрационные данные из `src/data/fallback.js`.

## Динамические страницы

Информационные материалы раздела «О школе» загружаются из коллекций Directus `pages` и `page_sections`. Опубликованные записи с группой `about` и включённым `show_in_menu` автоматически появляются в навигации. Универсальный маршрут frontend: `/about/:slug`.

## Сборка

```bash
npm run build
```

Для Amvera подготовлены `Dockerfile`, `nginx.conf` и `amvera.yml`. Перед сборкой приложения добавьте переменную `VITE_DIRECTUS_URL` в окружение сборки.

## Адреса сервисов

- сайт школы: `https://republic-school.sambo-chr.ru`
- Directus, API и файлы: `https://admin.republic-school.sambo-chr.ru`

## SEO

Для каждого маршрута настроены уникальные заголовки, описания, canonical URL и Open Graph. Главная страница содержит микроразметку образовательной и спортивной организации, а новости получают микроразметку `NewsArticle` из Directus.

Перед сборкой `scripts/generate-sitemap.js` создаёт `sitemap.xml`. Если Directus доступен во время сборки, в карту автоматически добавляются опубликованные новости и страницы раздела «О школе»; иначе используется базовый список маршрутов. `robots.txt` уже указывает поисковым системам адрес карты сайта.
