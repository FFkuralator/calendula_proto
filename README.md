# Calendula — Frontend

Vue 3 + Vite + Tailwind CSS.

## Запуск через Docker

### Требования

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Запуск

```bash
docker compose up --build
```

| Сервис | Адрес |
|---|---|
| Фронтенд | http://localhost:5173 |
| Бэкенд API | http://localhost:8000/api/ |
| Django Admin | http://localhost:8000/admin/ |

API-запросы на `/api/...` автоматически проксируются на бэкенд (порт 8000).

### Бэкенд

Запускается отдельно из репозитория `calendula_back`:

```bash
docker compose up --build
```

### Переменные окружения

| Переменная | Значение по умолчанию | Описание |
|---|---|---|
| `VITE_API_TARGET` | `http://host.docker.internal:8000` | URL бэкенда для проксирования |

Переопределить можно через `.env.local`:

```env
VITE_API_TARGET=http://host.docker.internal:8000
```
