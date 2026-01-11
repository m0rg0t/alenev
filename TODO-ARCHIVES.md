# Задачи по архивам публикаций

## Статус: Завершено (есть блокеры)

### Что сделано:
- [x] Создана система архивирования (Content Collection, компоненты, страницы)
- [x] Создан скрипт `scripts/archive-fetcher/index.ts` для полуавтоматического архивирования
- [x] Заархивировано 19 публикаций (6 статей + 13 СМИ)
- [x] Добавлены ссылки на архивы на странице `/publications`
- [x] Первичная очистка мусора (футеры, реклама, теги)

### Что осталось:

#### 1. Дочистить архивы от мусора
Файлы в `src/content/archives/`:

**Habr файлы (проверить на остатки мусора):**
- [x] habr-dalle2.md
- [x] habr-deadspace-cosplay.md
- [x] habr-owleye.md

**Другие файлы (проверить):**
- [x] tproger-hobby.md - проверено
- [x] cheremuha-predator.md - проверено
- [x] igromania-cosplay.md
- [x] dtf-deadspace-howto.md
- [x] dtf-deadspace-photoset.md
- [x] остальные файлы

**Типичный мусор для удаления:**
- Дублирующиеся заголовки h1
- Аватары авторов и логотипы
- Реклама ("— реклама на сайте:")
- Футеры сайтов (теги, комментарии, навигация)
- Статистика (просмотры, время чтения)
- Промо YouTube/соцсетей
- Ссылки через VK redirect (`vk.com/away.php?to=...`)

#### 2. Не удалось заархивировать (блокеры)
- **gazeta-rybinsk.ru** — ошибка SSL сертификата
- **Facebook (Тинькофф конкурс)** — требует авторизацию

#### 3. Улучшения скрипта archive-fetcher
- [x] Добавить очистку мусора при парсинге (до сохранения)
- [x] Исправить проблему с кодировкой (Pikabu)
- [x] Добавить поддержку скачивания видео (yt-dlp)

### Команды:

```bash
# Архивировать новую публикацию
bun run archive "https://example.com/article" --slug my-article --category article

# Сборка для проверки
bun run build

# Очистка архивов (скрипт)
./scripts/clean-archives.sh
```

### Файлы системы архивирования:
- `src/content/config.ts` — схема archivesCollection
- `src/content/archives/*.md` — архивы публикаций
- `src/components/ArchiveContent.astro` — компонент отображения
- `src/pages/archive/[...slug].astro` — динамические страницы
- `scripts/archive-fetcher/` — CLI скрипт архивирования
- `scripts/clean-archives.sh` — скрипт очистки мусора
- `public/archives/` — изображения и медиа
