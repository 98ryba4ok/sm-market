# 🚀 Руководство по инициализации базы данных с нуля

Это руководство поможет вам полностью настроить проект SM Market с нуля, включая создание администратора, тестовых данных и наполнение каталога товарами.

## 📋 Содержание

1. [Предварительные требования](#предварительные-требования)
2. [Быстрый старт](#быстрый-старт)
3. [Подробная инструкция](#подробная-инструкция)
4. [Опциональные параметры](#опциональные-параметры)
5. [Что создается](#что-создается)
6. [Данные для входа](#данные-для-входа)
7. [Устранение проблем](#устранение-проблем)

---

## 🔧 Предварительные требования

- Docker и Docker Compose установлены
- Проект склонирован на локальную машину
- Порты 8000 (backend) и 5173 (frontend) свободны

---

## ⚡ Быстрый старт

### Вариант 1: Полная инициализация (рекомендуется)

```bash
# 1. Запустить Docker контейнеры
docker-compose up -d

# 2. Применить миграции
docker-compose exec backend python manage.py migrate

# 3. Инициализировать базу данных (создать админа + все данные)
docker-compose exec backend python manage.py init_db

# 4. Готово! Открыть браузер
# Frontend: http://localhost:5173
# Admin: http://localhost:8000/admin/
```

### Вариант 2: Без Docker (локальная разработка)

```bash
# Backend
cd backend
python manage.py migrate
python manage.py init_db

# Frontend (в отдельном терминале)
cd frontend
npm install
npm run dev
```

---

## 📖 Подробная инструкция

### Шаг 1: Запуск Docker контейнеров

```bash
# Запустить все сервисы (backend, frontend, postgres)
docker-compose up -d

# Проверить статус контейнеров
docker-compose ps
```

Вы должны увидеть 3 запущенных контейнера:
- `sm-market-backend`
- `sm-market-frontend`
- `sm-market-db`

### Шаг 2: Применение миграций базы данных

```bash
# Применить все миграции Django
docker-compose exec backend python manage.py migrate
```

Эта команда создаст все необходимые таблицы в базе данных PostgreSQL.

### Шаг 3: Инициализация базы данных

```bash
# Полная инициализация: админ + все данные
docker-compose exec backend python manage.py init_db
```

Команда `init_db` выполняет следующие действия:

1. **Очищает базу данных** - удаляет все существующие данные
2. **Создает администратора** с учетными данными:
   - Email: `admin@mail.ru`
   - Пароль: `admin`
3. **Создает тестовых пользователей** (5 штук)
4. **Наполняет каталог**:
   - 6 помещений (Ванная, Кухня, Гостиная, Спальня, Прихожая, Кабинет)
   - 14 категорий товаров
   - 6 брендов
   - 2 баннера для главной страницы
   - **50+ товаров** с разными характеристиками
   - Изображения для всех товаров (по 4 на каждый)
   - Отзывы от пользователей
   - Тестовые заказы

### Шаг 4: Проверка результата

```bash
# Открыть браузер и перейти на:
# Frontend: http://localhost:5173
# Admin панель: http://localhost:8000/admin/
```

---

## ⚙️ Опциональные параметры

### Пропустить создание администратора

Если администратор уже существует или вы хотите создать его вручную:

```bash
docker-compose exec backend python manage.py init_db --skip-admin
```

### Пропустить добавление изображений

Если у вас нет файлов изображений или вы хотите добавить их позже:

```bash
docker-compose exec backend python manage.py init_db --skip-images
```

### Комбинация параметров

```bash
docker-compose exec backend python manage.py init_db --skip-admin --skip-images
```

### Создать администратора вручную

```bash
docker-compose exec backend python manage.py createsuperuser
```

---

## 📦 Что создается

### 👥 Пользователи

**Администратор:**
- Email: `admin@mail.ru`
- Пароль: `admin`
- Права: полный доступ к админ-панели

**Тестовые пользователи (пароль для всех: `testpass123`):**
- `ivan@example.com` - Иван Иванов
- `maria@example.com` - Мария Петрова
- `alex@example.com` - Александр Сидоров
- `elena@example.com` - Елена Смирнова
- `dmitry@example.com` - Дмитрий Козлов

### 🏪 Каталог

**Помещения (6):**
- Ванная комната
- Кухня
- Гостиная
- Спальня
- Прихожая
- Кабинет

**Категории (14):**
- Смесители
- Унитазы
- Плитка
- Ванны
- Мебель для ванны
- Кухонные мойки
- Диваны
- Столы
- Кровати
- Шкафы
- Вешалки
- Зеркала
- Письменные столы
- Кресла офисные

**Бренды (6):**
- GESSI (Италия)
- cielo (Италия)
- Jorger (Германия)
- KRONOS ceramiche (Италия)
- DevoN&DevoN (Россия)
- SICIS (Италия)

**Товары:**
- Минимум 50 товаров
- Распределены по всем категориям
- Разные ценовые категории (10,000 - 150,000 ₽)
- Случайные скидки (15%)
- Лейблы: "Новинка", "Хит продаж", "Акция", "Эксклюзив"
- По 4 изображения на каждый товар

**Дополнительно:**
- 2 баннера для главной страницы
- Отзывы на товары (0-3 на каждый товар)
- Тестовые заказы (от первых 3 пользователей)

---

## 🔐 Данные для входа

### Админ-панель Django

```
URL: http://localhost:8000/admin/
Email: admin@mail.ru
Пароль: admin
```

### Тестовые пользователи (Frontend)

```
URL: http://localhost:5173
Email: любой из тестовых (например, ivan@example.com)
Пароль: testpass123
```

---

## 🖼️ Изображения

Команда `init_db` автоматически загружает изображения из папки:
```
backend/apps/catalog/management/commands/photo/
```

### Необходимые файлы изображений:

**Помещения:**
- `bathroom.png` - Ванная комната
- `kitchen.png` - Кухня
- `living.png` - Гостиная
- `bedroom.png` - Спальня
- `hallway.png` - Прихожая
- `office.png` - Кабинет

**Категории:**
- `santehnika.png` - Смесители
- `unitazy.png` - Унитазы
- `plitka.png` - Плитка
- `vanny.png` - Ванны
- `mebel.png` - Мебель для ванны
- `kuhni.png` - Кухонные мойки
- `sofa.png` - Диваны
- `tables.png` - Столы
- `beds.png` - Кровати
- `wardrobes.png` - Шкафы
- `hangers.png` - Вешалки
- `mirrors.png` - Зеркала
- `desks.png` - Письменные столы
- `chairs.png` - Кресла офисные

**Бренды:**
- `gessi.png`
- `cielo.png`
- `jorger.png`
- `kronos.png`
- `devon.png`
- `sicis.png`

**Баннеры:**
- `banner1.png`
- `banner2.png`

**Товары:**
- `product.png` - используется для всех товаров

> **Примечание:** Если файлы изображений отсутствуют, команда все равно создаст все данные, но без изображений. Вы можете добавить изображения позже.

---

## 🔄 Повторная инициализация

Если вам нужно полностью пересоздать базу данных:

```bash
# Остановить контейнеры
docker-compose down

# Удалить том с данными PostgreSQL (опционально)
docker volume rm sm-market_postgres_data

# Запустить заново
docker-compose up -d

# Применить миграции
docker-compose exec backend python manage.py migrate

# Инициализировать базу
docker-compose exec backend python manage.py init_db
```

---

## 🐛 Устранение проблем

### Проблема: "Порт уже используется"

```bash
# Проверить, какой процесс использует порт
lsof -i :8000  # для backend
lsof -i :5173  # для frontend

# Остановить процесс или изменить порт в docker-compose.yml
```

### Проблема: "Контейнер не запускается"

```bash
# Посмотреть логи
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Пересоздать контейнеры
docker-compose down
docker-compose up -d --build
```

### Проблема: "Ошибка подключения к базе данных"

```bash
# Проверить, что PostgreSQL запущен
docker-compose ps

# Подождать несколько секунд и попробовать снова
docker-compose exec backend python manage.py migrate
```

### Проблема: "Изображения не загружаются"

```bash
# Проверить наличие папки photo
ls backend/apps/catalog/management/commands/photo/

# Если папки нет, создать её и добавить изображения
mkdir -p backend/apps/catalog/management/commands/photo/

# Или запустить без изображений
docker-compose exec backend python manage.py init_db --skip-images
```

### Проблема: "Администратор уже существует"

```bash
# Использовать флаг --skip-admin
docker-compose exec backend python manage.py init_db --skip-admin

# Или удалить существующего администратора через Django shell
docker-compose exec backend python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> User.objects.filter(email='admin@mail.ru').delete()
>>> exit()
```

---

## 📊 Проверка данных

### Через Django Admin

1. Откройте http://localhost:8000/admin/
2. Войдите как `admin@mail.ru` / `admin`
3. Проверьте разделы:
   - Пользователи
   - Помещения
   - Категории
   - Бренды
   - Товары
   - Заказы

### Через Django Shell

```bash
docker-compose exec backend python manage.py shell
```

```python
from apps.catalog.models import Product, Category, Room, Brand
from django.contrib.auth import get_user_model

User = get_user_model()

# Проверить количество данных
print(f"Пользователей: {User.objects.count()}")
print(f"Помещений: {Room.objects.count()}")
print(f"Категорий: {Category.objects.count()}")
print(f"Брендов: {Brand.objects.count()}")
print(f"Товаров: {Product.objects.count()}")

# Посмотреть первые 5 товаров
for product in Product.objects.all()[:5]:
    print(f"- {product.name} ({product.final_price} ₽)")
```

---

## 🎯 Следующие шаги

После успешной инициализации базы данных:

1. **Откройте Frontend** - http://localhost:5173
2. **Проверьте главную страницу** - должны отображаться баннеры и товары
3. **Перейдите в каталог** - проверьте фильтры по помещениям и категориям
4. **Войдите как тестовый пользователь** - проверьте функционал корзины и избранного
5. **Откройте админ-панель** - http://localhost:8000/admin/ для управления контентом

---

## 📝 Дополнительные команды

### Создать только тестовые данные (без админа)

```bash
docker-compose exec backend python manage.py create_sample_data --clear
```

### Добавить изображения к существующим товарам

```bash
docker-compose exec backend python manage.py add_product_images
```

### Создать резервную копию базы данных

```bash
docker-compose exec db pg_dump -U postgres sm_market > backup.sql
```

### Восстановить из резервной копии

```bash
docker-compose exec -T db psql -U postgres sm_market < backup.sql
```

---

## 🆘 Поддержка

Если у вас возникли проблемы:

1. Проверьте логи контейнеров: `docker-compose logs`
2. Убедитесь, что все контейнеры запущены: `docker-compose ps`
3. Проверьте, что порты свободны: `lsof -i :8000` и `lsof -i :5173`
4. Попробуйте пересоздать контейнеры: `docker-compose down && docker-compose up -d --build`

---

## ✅ Чеклист успешной инициализации

- [ ] Docker контейнеры запущены (`docker-compose ps`)
- [ ] Миграции применены (`python manage.py migrate`)
- [ ] База данных инициализирована (`python manage.py init_db`)
- [ ] Frontend открывается (http://localhost:5173)
- [ ] Админ-панель доступна (http://localhost:8000/admin/)
- [ ] Можно войти как администратор (`admin@mail.ru` / `admin`)
- [ ] На главной странице отображаются товары
- [ ] Каталог работает с фильтрами
- [ ] Можно войти как тестовый пользователь

---

**Готово! 🎉 Ваш интернет-магазин SM Market полностью настроен и готов к работе!**