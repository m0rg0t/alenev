# Anton Lenev - Personal Website

Персональный сайт Антона Ленёва, построенный на Astro 5.14+.

## 🚀 Запуск проекта

```bash
# Установка зависимостей
bun install

# Запуск dev сервера
bun run dev

# Сборка для продакшена
bun run build

# Предпросмотр продакшен версии
bun run preview
```

## 📁 Структура проекта

```
/
├── public/              # Статические файлы
├── docs/                # Проектная документация и чеклисты
├── src/
│   ├── pages/          # Страницы сайта
│   │   ├── index.astro           # Главная (RU)
│   │   ├── it.astro              # IT проекты
│   │   ├── podcasts.astro        # Подкасты
│   │   ├── audiobooks.astro      # Аудиокниги
│   │   ├── cosplay/              # Косплей
│   │   ├── publications.astro    # Публикации
│   │   ├── other/                # Другие проекты
│   │   └── en/                   # Английские версии
│   ├── layouts/         # Layouts
│   │   └── BaseLayout.astro
│   ├── components/      # Компоненты
│   ├── content/         # Контент коллекции
│   └── i18n.ts         # Утилиты интернационализации
├── backup/              # Старая версия сайта (OpenAI генератор)
└── astro.config.mjs
```

## 🌐 Мультиязычность

Сайт поддерживает два языка:
- **Русский** (по умолчанию) - `/`, `/it`, `/podcasts` и т.д.
- **Английский** - `/en`, `/en/it`, `/en/podcasts` и т.д.

## 📝 Разделы сайта

- **IT** - Разработка, проекты, выступления
- **Подкасты** - "Косплей и прочие штуки"
- **Аудиокниги** - Озвучка на Litres
- **Косплей** - Фото и видео костюмов
- **Публикации** - Статьи и упоминания в СМИ
- **Другое** - VK Mini apps, Яндекс навыки

## 🛠️ Технологии

- [Astro](https://astro.build) 5.14+
- TypeScript
- Bun runtime
- CSS Variables для темизации
- Встроенная i18n система Astro

## 📦 Деплой

Сайт генерирует статические HTML файлы и может быть размещён на любом хостинге:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

## 📚 Подробнее

Смотрите [CLAUDE.md](./CLAUDE.md) для детальной информации об архитектуре проекта.

Дополнительная документация:
- [Docker](./docs/docker.md)
- [Миграция на Astro](./docs/migration-astro.md)
- [SEO checklist](./docs/seo-checklist.md)
- [Задачи по архивам](./docs/archive-tasks.md)
- [Обслуживание репозитория](./docs/repository-maintenance.md)
