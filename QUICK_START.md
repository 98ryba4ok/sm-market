# 🚀 Быстрый старт SM Market с Docker

## 📋 Предварительные требования

- Docker
- Docker Compose v1 (у вас уже установлен)
- Git

## 🎯 Пошаговая инструкция запуска

### Шаг 1: Клонирование проекта (если еще не сделано)

```bash
git clone <your-repo-url>
cd sm-market
```

### Шаг 2: Настройка переменных окружения

#### Backend (.env)

Создайте файл `backend/.env`:

```bash
cd backend
cat > .env << 'EOF'
DEBUG=1
SECRET_KEY=django-insecure-qt6f4lthfe@y)ek5jtk-7cupgho!5)-hl(6ws(l&+t4slr7d%t
ALLOWED_HOSTS=*
POSTGRES_DB=sm_shop
POSTGRES_USER=sm_shop_admin
POSTGRES_PASSWORD=o4k3n_sm_shop_admin_pass
POSTGRES_HOST=db
POSTGRES_PORT=5432
EOF
cd ..
```

#### Frontend (.env)

Создайте файл `frontend/.env`:

```bash
cd frontend
cat > .env << 'EOF'
VITE_API_URL=http://localhost:8000
EOF
cd ..
```

**Важно**: `VITE_API_URL=http://localhost:8000` - это адрес backend сервера, доступный с вашего компьютера.

### Шаг 3: Установка зависимостей (только первый раз)

**ВАЖНО!** Перед первым запуском нужно установить npm зависимости:

```bash
# Запустите контейнер frontend для установки зависимостей
docker-compose run --rm frontend npm install
```

Эта команда установит все необходимые пакеты из `package.json`.

### Шаг 4: Запуск проекта

Из корня проекта выполните:

```bash
docker-compose up --build
```

**Первый запуск займет несколько минут** (скачивание образов, сборка).

### Шаг 5: Инициализация базы данных

После того как контейнеры запустятся, в **новом терминале** выполните:

```bash
# Применить миграции
docker-compose exec backend python manage.py migrate

# Создать тестовые данные (рекомендуется)
docker-compose exec backend python manage.py create_sample_data

# Создать суперпользователя (опционально)
docker-compose exec backend python manage.py createsuperuser
# Email: admin@example.com
# Phone: +79991234567
# Password: admin123
```

**Примечание**: Если команда `create_sample_data` выдает ошибку о дубликатах, очистите БД:
```bash
docker-compose exec backend python manage.py create_sample_data --clear
```

### Шаг 6: Готово! 🎉

Проект запущен и доступен по адресам:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/api/schema/swagger-ui/

## 📝 Полезные команды

### Управление контейнерами

```bash
# Запуск (с пересборкой)
docker-compose up --build

# Запуск в фоновом режиме
docker-compose up -d

# Остановка
docker-compose down

# Остановка с удалением volumes (БД будет очищена!)
docker-compose down -v

# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Работа с backend

```bash
# Выполнить команду Django
docker-compose exec backend python manage.py <command>

# Примеры:
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py create_sample_data
docker-compose exec backend python manage.py shell

# Войти в контейнер backend
docker-compose exec backend bash
```

### Работа с frontend

```bash
# Войти в контейнер frontend
docker-compose exec frontend sh

# Установить новую зависимость
docker-compose exec frontend npm install <package-name>

# Пересобрать frontend
docker-compose restart frontend
```

### Работа с базой данных

```bash
# Подключиться к PostgreSQL
docker-compose exec db psql -U sm_shop_admin -d sm_shop

# Создать backup базы данных
docker-compose exec db pg_dump -U sm_shop_admin sm_shop > backup.sql

# Восстановить из backup
docker-compose exec -T db psql -U sm_shop_admin sm_shop < backup.sql
```

## 🔥 Hot Reload

✅ **Hot reload работает!**

- **Frontend**: Vite автоматически перезагружает при изменении файлов в `frontend/src/`
- **Backend**: Django автоматически перезагружается при изменении `.py` файлов

Просто редактируйте код, и изменения применятся автоматически!

## 🐛 Troubleshooting

### Проблема: API запросы возвращают 404

**Причина**: Неправильно настроен `VITE_API_URL` в `frontend/.env`.

**Решение**:

1. Убедитесь, что `frontend/.env` содержит:
```env
VITE_API_URL=http://localhost:8000
```

2. Перезапустите frontend:
```bash
docker-compose restart frontend
```

3. Проверьте, что backend работает:
```bash
# Должен вернуть JSON с версией API
curl http://localhost:8000/api/

# Или откройте в браузере
open http://localhost:8000/api/
```

4. Если backend не отвечает, проверьте логи:
```bash
docker-compose logs backend
```

### Проблема: The `border-border` class does not exist

**Причина**: Ошибка в `frontend/src/index.css` - использовался несуществующий Tailwind класс.

**Решение**: Уже исправлено в коде! Если вы все еще видите эту ошибку:

```bash
# Перезапустите frontend контейнер
docker-compose restart frontend

# Или полностью пересоберите
docker-compose down
docker-compose up --build
```

### Проблема: Failed to resolve import "@tanstack/react-query" или "lucide-react" или "zustand"

**Причина**: Не установлены npm зависимости в контейнере.

**Решение**:
```bash
# Остановите контейнеры
docker-compose down

# Установите зависимости
docker-compose run --rm frontend npm install

# Запустите снова
docker-compose up --build
```

Или если контейнеры уже запущены:
```bash
# В новом терминале
docker-compose exec frontend npm install

# Перезапустите frontend
docker-compose restart frontend
```

### Проблема: Cannot resolve keyword 'username' into field

**Ошибка**: `FieldError: Cannot resolve keyword 'username' into field. Choices are: carts, date_joined, email...`

**Причина**: Старая версия команды `create_sample_data.py` использовала поле `username`, которого нет в кастомной модели User.

**Решение**: Файл уже исправлен! Перезапустите backend:
```bash
docker-compose restart backend
docker-compose exec backend python manage.py create_sample_data
```

### Проблема: duplicate key value violates unique constraint "catalog_category_slug_key"

**Ошибка**: `IntegrityError: duplicate key value violates unique constraint "catalog_category_slug_key"`

**Причина**: Попытка повторного создания тестовых данных или пустой slug для русских названий.

**Решение 1**: Очистите существующие данные перед созданием новых:
```bash
docker-compose exec backend python manage.py create_sample_data --clear
```

**Решение 2**: Полностью пересоздайте БД:
```bash
# Остановите контейнеры
docker-compose down

# Удалите volume с БД
docker-compose down -v

# Запустите снова
docker-compose up --build

# В новом терминале
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py create_sample_data
```

### Проблема: Порты уже заняты

```bash
# Проверить, что использует порты
lsof -i :3000  # Frontend
lsof -i :8000  # Backend
lsof -i :5432  # PostgreSQL

# Остановить процессы или изменить порты в docker-compose.yml
```

### Проблема: Контейнеры не запускаются

```bash
# Очистить все и начать заново
docker-compose down -v
docker-compose up --build
```

### Проблема: База данных не инициализирована

```bash
# Применить миграции
docker-compose exec backend python manage.py migrate

# Если не помогло, пересоздать БД
docker-compose down -v
docker-compose up -d db
sleep 5
docker-compose up -d backend
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py create_sample_data
```

### Проблема: Frontend не может подключиться к backend

Проверьте:
1. `frontend/.env` содержит `VITE_API_URL=/api`
2. Backend запущен и доступен на http://localhost:8000
3. В `docker-compose.yml` правильно настроен nginx/proxy

### Проблема: Изменения не применяются

```bash
# Пересобрать контейнеры
docker-compose up --build

# Или пересобрать конкретный сервис
docker-compose up --build backend
docker-compose up --build frontend
```

## 📦 Структура Docker

```
sm-market/
├── docker-compose.yml          # Конфигурация Docker Compose
├── backend/
│   ├── Dockerfile             # Dockerfile для Django
│   ├── .env                   # Переменные окружения backend
│   └── requirements.txt       # Python зависимости
└── frontend/
    ├── Dockerfile             # Dockerfile для React
    ├── .env                   # Переменные окружения frontend
    └── package.json           # Node.js зависимости
```

## 🎯 Типичный рабочий процесс

### Первый запуск (setup)

```bash
# 1. Создать .env файлы (см. Шаг 2)
# 2. Запустить контейнеры
docker-compose up --build

# 3. В новом терминале - инициализация
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py create_sample_data
docker-compose exec backend python manage.py createsuperuser

# 4. Открыть http://localhost:3000
```

### Ежедневная разработка

```bash
# Запуск
docker-compose up

# Работа с кодом (hot reload работает автоматически)
# Редактируйте файлы в frontend/src/ или backend/

# Остановка (Ctrl+C)
# Или в фоне: docker-compose up -d
```

### Добавление новой зависимости

**Backend:**
```bash
# Добавить в requirements.txt
echo "new-package==1.0.0" >> backend/requirements.txt

# Пересобрать
docker-compose up --build backend
```

**Frontend:**
```bash
# Установить пакет
docker-compose exec frontend npm install new-package

# Или добавить в package.json и пересобрать
docker-compose up --build frontend
```

### Создание новой миграции

```bash
# Изменить models.py
# Создать миграцию
docker-compose exec backend python manage.py makemigrations

# Применить миграцию
docker-compose exec backend python manage.py migrate
```

## 🔐 Доступы по умолчанию

### Django Admin
- URL: http://localhost:8000/admin/
- Создайте суперпользователя: `docker-compose exec backend python manage.py createsuperuser`

### PostgreSQL
- Host: localhost
- Port: 5432
- Database: sm_shop
- User: sm_shop_admin
- Password: o4k3n_sm_shop_admin_pass

## 📊 Мониторинг

```bash
# Статус контейнеров
docker-compose ps

# Использование ресурсов
docker stats

# Логи в реальном времени
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## 🧹 Очистка

```bash
# Остановить и удалить контейнеры
docker-compose down

# Удалить контейнеры и volumes (БД будет удалена!)
docker-compose down -v

# Удалить неиспользуемые образы
docker image prune -a

# Полная очистка Docker
docker system prune -a --volumes
```

## 🚀 Production деплой

Для production используйте отдельный `docker-compose.prod.yml`:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

См. [DEPLOYMENT.md](DEPLOYMENT.md) для подробностей.

## 💡 Советы

1. **Используйте .env файлы** - не коммитьте их в git
2. **Регулярно делайте backup БД** - особенно перед миграциями
3. **Следите за логами** - `docker-compose logs -f`
4. **Используйте volumes** - для персистентности данных
5. **Hot reload** - работает из коробки, просто редактируйте код

## 📚 Дополнительная документация

- [README.md](README.md) - Основная документация
- [DEPLOYMENT.md](DEPLOYMENT.md) - Руководство по деплою
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - План реализации
- [ARCHITECTURE.md](ARCHITECTURE.md) - Архитектура проекта

---

**Готово!** Теперь вы можете начать разработку! 🎉

Если возникнут проблемы, проверьте раздел [Troubleshooting](#-troubleshooting) или создайте issue.