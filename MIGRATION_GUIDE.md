# 🔄 Инструкция по применению миграций

## Быстрый старт

### Через Docker (рекомендуется):

```bash
# 1. Запустите контейнеры
docker-compose up -d

# 2. Создайте миграции
docker-compose exec backend python manage.py makemigrations

# 3. Примените миграции
docker-compose exec backend python manage.py migrate

# 4. (Опционально) Создайте тестовые данные
docker-compose exec backend python manage.py create_sample_data
```

### Локально (без Docker):

```bash
# 1. Активируйте виртуальное окружение
cd backend
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows

# 2. Создайте миграции
python manage.py makemigrations

# 3. Примените миграции
python manage.py migrate

# 4. (Опционально) Создайте тестовые данные
python manage.py create_sample_data
```

## Что было изменено

### Задачи 1-2: Профиль пользователя и восстановление пароля

**Модель User (`apps/users/models.py`):**
- ✅ Добавлены поля: `first_name`, `last_name`, `middle_name`
- ✅ Добавлен метод `get_full_name()`

**Новая модель PasswordResetToken (`apps/users/models.py`):**
- ✅ Токены для сброса пароля
- ✅ Автоматическая генерация и валидация

**Новые API endpoints:**
- `PATCH /api/auth/profile/update/` - обновление профиля
- `POST /api/auth/profile/change-email/` - смена email
- `POST /api/auth/profile/change-password/` - смена пароля
- `POST /api/auth/password-reset/` - запрос сброса пароля
- `POST /api/auth/password-reset/confirm/` - подтверждение сброса

## Проверка миграций

```bash
# Посмотреть список миграций
docker-compose exec backend python manage.py showmigrations

# Проверить план миграций
docker-compose exec backend python manage.py migrate --plan
```

## Откат миграций (если нужно)

```bash
# Откатить последнюю миграцию users
docker-compose exec backend python manage.py migrate users <previous_migration_name>

# Откатить все миграции users
docker-compose exec backend python manage.py migrate users zero
```

## Troubleshooting

### Ошибка: "No changes detected"
**Решение:** Убедитесь что изменения в models.py сохранены

### Ошибка: "Table already exists"
**Решение:** 
```bash
docker-compose exec backend python manage.py migrate --fake-initial
```

### Ошибка: "Database connection failed"
**Решение:** Проверьте что PostgreSQL запущен и настройки в `.env` корректны

## Следующие шаги

После применения миграций:
1. ✅ Перезапустите backend (если запущен локально)
2. ✅ Проверьте что API endpoints работают
3. ✅ Протестируйте функционал в frontend
4. ✅ Настройте email (см. EMAIL_SETUP_GUIDE.md)