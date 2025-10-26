# Docker инструкции

Этот проект поддерживает Docker для разработки и production развертывания.

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

Сайт будет доступен на `http://localhost:8080`

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

Сайт будет доступен на `http://localhost:4321` с hot reload.

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
- `docker-compose.yml` - Production конфигурация
- `docker-compose.dev.yml` - Development конфигурация с hot reload
- `nginx.conf` - Nginx конфигурация для production
- `.dockerignore` - Файлы, исключаемые из Docker build context

## Troubleshooting

### Порт уже занят

Если порт 8080 или 4321 уже используется, измените порт в `docker-compose.yml`:

```yaml
ports:
  - "3000:80"  # используйте любой свободный порт
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
