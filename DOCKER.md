# Docker инструкции

Этот проект поддерживает Docker для разработки и production развертывания.

## Быстрый старт

```bash
# 1. Создайте .env файл (или используйте дефолтные порты)
cp .env.example .env

# 2. Запустите production версию
docker-compose up -d
# Сайт будет доступен на http://localhost:8080

# Или development версию с hot reload
docker-compose -f docker-compose.dev.yml up
# Сайт будет доступен на http://localhost:4321
```

## Production (nginx)

### Запуск с docker-compose

```bash
# Собрать и запустить
docker-compose up -d

# Остановить
docker-compose down

# Пересобрать после изменений
docker-compose up -d --build

# Посмотреть логи
docker-compose logs -f web
```

Сайт будет доступен на `http://localhost:8080` (или на порту, указанном в `.env`)

### Запуск с docker напрямую

```bash
# Собрать образ
docker build -t alenev-site .

# Запустить контейнер
docker run -d -p 8080:80 --name alenev alenev-site

# Остановить и удалить
docker stop alenev && docker rm alenev
```

## Development (с hot reload)

Для разработки с автоматической перезагрузкой используйте `docker-compose.dev.yml`:

```bash
# Запустить dev сервер
docker-compose -f docker-compose.dev.yml up

# Или в фоновом режиме
docker-compose -f docker-compose.dev.yml up -d

# Остановить
docker-compose -f docker-compose.dev.yml down
```

Сайт будет доступен на `http://localhost:4321` (или на порту, указанном в `.env`) с hot reload.

## Полезные команды

```bash
# Зайти в running контейнер
docker exec -it alenev-site sh

# Посмотреть логи
docker logs alenev-site
docker logs -f alenev-site  # follow режим

# Проверить статус
docker ps

# Удалить все остановленные контейнеры
docker container prune

# Удалить неиспользуемые образы
docker image prune
```

## Структура файлов

- `Dockerfile` - Multi-stage build для production (bun + nginx)
- `docker-compose.yaml` - Production конфигурация
- `docker-compose.dev.yml` - Development конфигурация с hot reload
- `nginx.conf` - Nginx конфигурация для production
- `.dockerignore` - Файлы, исключаемые из Docker build context
- `.env` - Переменные окружения (порты и конфигурация)
- `.env.example` - Пример конфигурации

## Конфигурация портов

Порты настраиваются через `.env` файл. Создайте `.env` файл на основе `.env.example`:

```bash
cp .env.example .env
```

Доступные переменные:

- `PORT_PROD` - внешний порт для production (nginx), по умолчанию `8080`
- `PORT_DEV` - внешний порт для development, по умолчанию `4321`

### Изменение портов

**Способ 1: Через .env файл (рекомендуется)**

Отредактируйте `.env`:

```bash
# Использовать порт 3000 для production
PORT_PROD=3000

# Использовать порт 5173 для development
PORT_DEV=5173
```

Затем запустите:

```bash
docker-compose up -d
```

**Способ 2: Переопределить порт в командной строке**

```bash
# Production на порту 3000
PORT_PROD=3000 docker-compose up -d

# Development на порту 5173
PORT_DEV=5173 docker-compose -f docker-compose.dev.yml up -d
```

**Способ 3: Без .env файла**

Если `.env` файла нет, будут использованы значения по умолчанию: 8080 для production и 4321 для development.

## Troubleshooting

### Порт уже занят

**Ошибка**: `Bind for 0.0.0.0:8080 failed: port is already allocated`

**Решение**: Измените порт через `.env` файл или переопределите в командной строке:

```bash
# Быстрое решение - использовать другой порт
PORT_PROD=3000 docker-compose up -d

# Или отредактируйте .env файл
echo "PORT_PROD=3000" >> .env
docker-compose up -d

# Для development
PORT_DEV=5173 docker-compose -f docker-compose.dev.yml up -d
```

**Узнать, какой процесс занимает порт** (macOS/Linux):

```bash
# Для порта 8080
lsof -i :8080

# Или
netstat -an | grep 8080
```

### Изменения не применяются

```bash
# Пересобрать без кеша
docker-compose build --no-cache
docker-compose up -d
```

### Проблемы с правами доступа (Linux)

```bash
# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER
# Перелогиньтесь после этого
```

## Production deployment

Для deployment на сервер:

```bash
# На локальной машине: экспорт образа
docker save alenev-site:latest | gzip > alenev-site.tar.gz

# На сервере: импорт образа
gunzip -c alenev-site.tar.gz | docker load

# Запуск
docker-compose up -d
```

Или используйте Docker registry (Docker Hub, GitHub Container Registry, etc.):

```bash
# Тегировать образ
docker tag alenev-site:latest your-username/alenev-site:latest

# Загрузить в registry
docker push your-username/alenev-site:latest

# На сервере: скачать и запустить
docker pull your-username/alenev-site:latest
docker-compose up -d
```
