# 🛒 SM Market - Интернет-магазин

Полнофункциональный интернет-магазин на React + Django с современным стеком технологий.

## 🚀 Быстрый старт

**Хотите быстро запустить проект с Docker?**

👉 **[QUICK_START.md](QUICK_START.md)** - Пошаговая инструкция запуска за 5 минут!

```bash
# Создайте .env файлы (см. QUICK_START.md)
# Затем просто выполните:
docker-compose up --build

# В новом терминале:
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py create_sample_data
```

Готово! Откройте http://localhost:3000 🎉

---

## 📋 Содержание

- [Быстрый старт](#-быстрый-старт)
- [Особенности](#особенности)
- [Технологии](#технологии)
- [Структура проекта](#структура-проекта)
- [Установка и запуск](#установка-и-запуск)
- [API Endpoints](#api-endpoints)
- [Скриншоты](#скриншоты)
- [Разработка](#разработка)

## ✨ Особенности

### Функционал
- ✅ **Каталог товаров** с фильтрацией, сортировкой и поиском
- ✅ **Детальные страницы товаров** с изображениями и отзывами
- ✅ **Корзина покупок** с изменением количества товаров
- ✅ **Оформление заказов** с формой доставки
- ✅ **История заказов** пользователя
- ✅ **Список желаний (Wishlist)**
- ✅ **Система отзывов** с рейтингом (1-5 звезд)
- ✅ **JWT аутентификация** (регистрация/вход)
- ✅ **Адаптивный дизайн** (mobile-first)
- ✅ **Real-time обновления** корзины и wishlist

### Технические особенности
- 🎯 **Type Safety** - полная типизация TypeScript
- ⚡ **Оптимистичные обновления** для мгновенного UI feedback
- 🔄 **Автоматическое обновление JWT токенов**
- 📦 **Централизованное управление состоянием** (Zustand + TanStack Query)
- 🎨 **Современный UI** с Tailwind CSS
- 🚀 **Быстрая разработка** с Vite и HMR
- 📱 **Responsive design** для всех устройств

## 🛠 Технологии

### Backend
- **Django 4.x** - веб-фреймворк
- **Django REST Framework** - REST API
- **PostgreSQL** - база данных
- **SimpleJWT** - JWT аутентификация
- **django-cors-headers** - CORS
- **django-filter** - фильтрация
- **Pillow** - обработка изображений

### Frontend
- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик
- **TanStack Query v5** - управление server state
- **Zustand** - управление client state
- **React Router v7** - роутинг
- **Tailwind CSS** - стилизация
- **React Hook Form + Zod** - формы и валидация
- **Axios** - HTTP клиент
- **Lucide Icons** - иконки

## 📁 Структура проекта

```
sm-market/
├── backend/                    # Django backend
│   ├── apps/
│   │   ├── catalog/           # Товары и категории
│   │   │   ├── models.py      # 4 модели (Category, Product, ProductImage, ProductReview)
│   │   │   ├── serializers.py # 5 serializers
│   │   │   ├── views.py       # 4 ViewSets
│   │   │   └── admin.py       # Admin конфигурация
│   │   ├── orders/            # Заказы и корзина
│   │   │   ├── models.py      # 5 моделей (Cart, CartItem, Order, OrderItem, Wishlist)
│   │   │   ├── serializers.py # 6 serializers
│   │   │   ├── views.py       # 6 ViewSets
│   │   │   └── admin.py       # Admin конфигурация
│   │   └── users/             # Пользователи и аутентификация
│   │       ├── models.py      # CustomUser модель
│   │       ├── serializers.py # User serializers
│   │       ├── views.py       # Auth views
│   │       └── urls.py        # Auth URLs
│   ├── config/                # Настройки проекта
│   │   ├── settings.py        # Django settings
│   │   └── urls.py            # Root URLs
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                   # React frontend
    ├── src/
    │   ├── api/               # API сервисы (8 файлов)
    │   │   ├── axios.ts       # Axios конфигурация с JWT
    │   │   ├── products.ts    # Products API
    │   │   ├── categories.ts  # Categories API
    │   │   ├── cart.ts        # Cart API
    │   │   ├── orders.ts      # Orders API
    │   │   ├── reviews.ts     # Reviews API
    │   │   ├── wishlist.ts    # Wishlist API
    │   │   └── auth.ts        # Auth API
    │   │
    │   ├── components/        # React компоненты
    │   │   ├── ui/           # Базовые UI компоненты (9 шт)
    │   │   ├── layout/       # Layout компоненты (5 шт)
    │   │   ├── shared/       # Shared компоненты (3 шт)
    │   │   └── features/     # Feature компоненты (15 шт)
    │   │       ├── auth/     # Аутентификация
    │   │       ├── products/ # Товары
    │   │       ├── cart/     # Корзина
    │   │       ├── orders/   # Заказы
    │   │       ├── reviews/  # Отзывы
    │   │       └── wishlist/ # Список желаний
    │   │
    │   ├── hooks/            # Custom hooks (5 файлов)
    │   │   ├── useAuth.ts
    │   │   ├── useCart.ts
    │   │   ├── useWishlist.ts
    │   │   ├── useProducts.ts
    │   │   └── useOrders.ts
    │   │
    │   ├── pages/            # Страницы (9 файлов)
    │   │   ├── HomePage.tsx
    │   │   ├── ProductsPage.tsx
    │   │   ├── ProductDetailPage.tsx
    │   │   ├── CartPage.tsx
    │   │   ├── CheckoutPage.tsx
    │   │   ├── OrdersPage.tsx
    │   │   ├── OrderDetailPage.tsx
    │   │   ├── WishlistPage.tsx
    │   │   └── NotFoundPage.tsx
    │   │
    │   ├── store/            # Zustand stores (4 файла)
    │   │   ├── authStore.ts
    │   │   ├── cartStore.ts
    │   │   ├── wishlistStore.ts
    │   │   └── uiStore.ts
    │   │
    │   ├── types/            # TypeScript типы (6 файлов)
    │   │   ├── api.ts
    │   │   ├── auth.ts
    │   │   ├── cart.ts
    │   │   ├── order.ts
    │   │   ├── product.ts
    │   │   └── user.ts
    │   │
    │   ├── utils/            # Утилиты (4 файла)
    │   │   ├── constants.ts
    │   │   ├── format.ts
    │   │   ├── queryKeys.ts
    │   │   └── validation.ts
    │   │
    │   ├── App.tsx           # Главный компонент с роутингом
    │   ├── main.tsx          # Entry point
    │   └── index.css         # Global styles
    │
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## 🚀 Установка и запуск

### Предварительные требования
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### Backend

1. **Создайте виртуальное окружение:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

2. **Установите зависимости:**
```bash
pip install -r requirements.txt
```

3. **Настройте базу данных:**
```bash
# Создайте БД PostgreSQL
createdb sm_market

# Примените миграции
python manage.py migrate
```

4. **Создайте суперпользователя:**
```bash
python manage.py createsuperuser
```

5. **Загрузите тестовые данные (опционально):**
```bash
python manage.py create_sample_data
```

6. **Запустите сервер:**
```bash
python manage.py runserver
```

Backend будет доступен по адресу: `http://localhost:8000`
Django Admin: `http://localhost:8000/admin`
API: `http://localhost:8000/api/`

### Frontend

1. **Установите зависимости:**
```bash
cd frontend
npm install
```

2. **Запустите dev сервер:**
```bash
npm run dev
```

Frontend будет доступен по адресу: `http://localhost:5173`

### Docker (альтернативный способ)

```bash
docker-compose up -d
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/` - Регистрация
- `POST /api/auth/login/` - Вход
- `POST /api/auth/logout/` - Выход
- `POST /api/auth/refresh/` - Обновление токена
- `GET /api/auth/me/` - Текущий пользователь

### Products
- `GET /api/products/` - Список товаров (с фильтрацией)
- `GET /api/products/{id}/` - Детали товара
- `GET /api/categories/` - Список категорий
- `GET /api/categories/{id}/products/` - Товары категории

### Cart
- `GET /api/cart/` - Получить корзину
- `POST /api/cart/add/` - Добавить в корзину
- `PUT /api/cart/items/{id}/` - Обновить количество
- `DELETE /api/cart/items/{id}/` - Удалить из корзины
- `POST /api/cart/clear/` - Очистить корзину

### Orders
- `GET /api/orders/` - Список заказов
- `POST /api/orders/` - Создать заказ
- `GET /api/orders/{id}/` - Детали заказа
- `POST /api/orders/{id}/cancel/` - Отменить заказ

### Reviews
- `GET /api/reviews/` - Список отзывов
- `POST /api/reviews/` - Создать отзыв
- `PATCH /api/reviews/{id}/` - Обновить отзыв
- `DELETE /api/reviews/{id}/` - Удалить отзыв

### Wishlist
- `GET /api/wishlist/` - Получить wishlist
- `POST /api/wishlist/add/` - Добавить в wishlist
- `DELETE /api/wishlist/remove/{product_id}/` - Удалить из wishlist

## 🎨 Скриншоты

### Главная страница
- Hero секция с призывом к действию
- Блок с преимуществами магазина
- Избранные товары
- CTA секция

### Каталог товаров
- Фильтры по категориям, цене, рейтингу
- Сортировка (новизна, цена, популярность)
- Сетка товаров с карточками
- Пагинация

### Детальная страница товара
- Галерея изображений
- Информация о товаре
- Добавление в корзину и wishlist
- Отзывы покупателей
- Форма написания отзыва

### Корзина
- Список товаров с возможностью изменения количества
- Итоговая сумма заказа
- Кнопка оформления заказа

### Оформление заказа
- Форма с адресом доставки
- Выбор способа оплаты
- Итоговая информация о заказе

## 💻 Разработка

### Команды Frontend

```bash
npm run dev          # Запуск dev сервера
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Запуск ESLint
npm run type-check   # Проверка типов TypeScript
```

### Команды Backend

```bash
python manage.py runserver              # Запуск dev сервера
python manage.py makemigrations         # Создать миграции
python manage.py migrate                # Применить миграции
python manage.py createsuperuser        # Создать суперпользователя
python manage.py create_sample_data     # Загрузить тестовые данные
python manage.py test                   # Запуск тестов
```

### Архитектурные решения

1. **Разделение состояния**
   - Client state (Zustand): UI состояние, корзина, wishlist
   - Server state (TanStack Query): данные с сервера

2. **Оптимистичные обновления**
   - Мгновенный UI feedback при добавлении в корзину/wishlist
   - Rollback при ошибках

3. **JWT с автообновлением**
   - Axios interceptors для автоматического refresh токена
   - Прозрачная обработка 401 ошибок

4. **Type Safety**
   - Строгая типизация TypeScript
   - Использование `import type` для type-only imports

5. **Композиция компонентов**
   - Переиспользуемые UI компоненты
   - Subcomponents pattern (Card, Modal)

## 📊 Статистика

- **Всего файлов**: ~145
- **Строк кода**: ~10,500
- **Backend**: 60 файлов, ~3,500 строк
- **Frontend**: 85 файлов, ~7,000 строк
- **Компонентов**: 42
- **API Endpoints**: 20+
- **Время разработки**: ~10 часов

## 📝 Документация

- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) - Подробный план реализации
- [ARCHITECTURE.md](ARCHITECTURE.md) - Архитектура проекта
- [BACKEND_PROGRESS.md](BACKEND_PROGRESS.md) - Прогресс backend разработки
- [FRONTEND_PROGRESS.md](FRONTEND_PROGRESS.md) - Прогресс frontend разработки

## 🤝 Вклад в проект

Проект создан как учебный пример полнофункционального интернет-магазина.

## 📄 Лицензия

MIT License

## 👨‍💻 Автор

Создано с использованием современных best practices и технологий.

---

**Статус проекта**: ✅ Готов к использованию (95% завершено)

**Последнее обновление**: 29 декабря 2024