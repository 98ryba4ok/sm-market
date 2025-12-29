# Архитектура интернет-магазина SM-Market

## Обзор проекта

Полнофункциональный интернет-магазин на базе React (TypeScript) + Django REST Framework с интеграцией платежной системы ЮKassa.

## Технологический стек

### Backend
- **Django 6.0** - основной фреймворк
- **Django REST Framework 3.16** - API
- **PostgreSQL** - база данных
- **JWT (djangorestframework-simplejwt)** - аутентификация
- **Pillow** - обработка изображений
- **django-filter** - фильтрация данных
- **YooKassa SDK** - платежная интеграция

### Frontend
- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик
- **React Router DOM** - маршрутизация
- **TanStack Query (React Query)** - управление серверным состоянием
- **Zustand** - управление клиентским состоянием
- **Tailwind CSS** - стилизация
- **React Hook Form + Zod** - формы и валидация
- **Axios** - HTTP клиент
- **Lucide React** - иконки
- **React Hot Toast** - уведомления

## Структура Backend

```
backend/
├── apps/
│   ├── catalog/              # Каталог товаров
│   │   ├── models.py         # Category, Product, ProductImage, ProductReview
│   │   ├── serializers.py    # Сериализаторы для API
│   │   ├── views.py          # ViewSets и API endpoints
│   │   ├── urls.py           # URL маршруты
│   │   ├── admin.py          # Настройка админ-панели
│   │   ├── filters.py        # Фильтры для товаров
│   │   └── management/
│   │       └── commands/
│   │           └── create_sample_data.py
│   │
│   ├── orders/               # Заказы и корзина
│   │   ├── models.py         # Cart, CartItem, Order, OrderItem
│   │   ├── serializers.py    # Сериализаторы для заказов
│   │   ├── views.py          # ViewSets для корзины и заказов
│   │   ├── urls.py           # URL маршруты
│   │   ├── admin.py          # Настройка админ-панели
│   │   └── services.py       # Бизнес-логика (создание заказа, оплата)
│   │
│   ├── users/                # Пользователи (уже существует)
│   │   ├── models.py         # Custom User model
│   │   ├── serializers.py    # User serializers
│   │   ├── views.py          # Auth endpoints
│   │   └── urls.py           # Auth routes
│   │
│   └── payments/             # Платежная интеграция (новое)
│       ├── services.py       # YooKassaService
│       ├── views.py          # Payment endpoints
│       ├── urls.py           # Payment routes
│       └── webhooks.py       # Webhook handlers
│
├── config/
│   ├── settings.py           # Настройки Django
│   ├── urls.py               # Главный URL конфиг
│   └── wsgi.py
│
├── media/                    # Загруженные файлы
│   ├── products/             # Изображения товаров
│   └── categories/           # Изображения категорий
│
└── staticfiles/              # Статические файлы
```

## Структура Frontend

```
frontend/
├── src/
│   ├── components/           # Переиспользуемые UI компоненты
│   │   ├── ui/              # Базовые UI элементы
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Rating.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   └── layout/          # Компоненты макета
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Sidebar.tsx
│   │       ├── MainLayout.tsx
│   │       └── Breadcrumbs.tsx
│   │
│   ├── features/            # Функциональные модули
│   │   ├── auth/           # Аутентификация
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── AuthModal.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── store/
│   │   │   │   └── authStore.ts
│   │   │   └── api/
│   │   │       └── authApi.ts
│   │   │
│   │   ├── catalog/        # Каталог товаров
│   │   │   ├── components/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductFilters.tsx
│   │   │   │   ├── ProductSort.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   └── CategoryList.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProducts.ts
│   │   │   │   └── useCategories.ts
│   │   │   └── api/
│   │   │       ├── productsApi.ts
│   │   │       └── categoriesApi.ts
│   │   │
│   │   ├── product/        # Детальная страница товара
│   │   │   ├── components/
│   │   │   │   ├── ProductImageGallery.tsx
│   │   │   │   ├── ProductInfo.tsx
│   │   │   │   ├── ProductReviews.tsx
│   │   │   │   ├── ReviewForm.tsx
│   │   │   │   └── AddToCartButton.tsx
│   │   │   └── hooks/
│   │   │       └── useProductDetail.ts
│   │   │
│   │   ├── cart/           # Корзина
│   │   │   ├── components/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   ├── CartSummary.tsx
│   │   │   │   └── CartDrawer.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useCart.ts
│   │   │   ├── store/
│   │   │   │   └── cartStore.ts
│   │   │   └── api/
│   │   │       └── cartApi.ts
│   │   │
│   │   ├── checkout/       # Оформление заказа
│   │   │   ├── components/
│   │   │   │   ├── CheckoutForm.tsx
│   │   │   │   ├── OrderSummary.tsx
│   │   │   │   └── PaymentMethodSelector.tsx
│   │   │   └── hooks/
│   │   │       └── useCheckout.ts
│   │   │
│   │   ├── orders/         # История заказов
│   │   │   ├── components/
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   └── OrderDetail.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useOrders.ts
│   │   │   └── api/
│   │   │       └── ordersApi.ts
│   │   │
│   │   ├── wishlist/       # Избранное
│   │   │   ├── components/
│   │   │   │   └── WishlistButton.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useWishlist.ts
│   │   │   ├── store/
│   │   │   │   └── wishlistStore.ts
│   │   │   └── api/
│   │   │       └── wishlistApi.ts
│   │   │
│   │   └── reviews/        # Отзывы
│   │       ├── components/
│   │       │   ├── ReviewCard.tsx
│   │       │   ├── ReviewsList.tsx
│   │       │   └── ReviewForm.tsx
│   │       ├── hooks/
│   │       │   └── useReviews.ts
│   │       └── api/
│   │           └── reviewsApi.ts
│   │
│   ├── pages/              # Страницы приложения
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
│   ├── shared/             # Общие утилиты
│   │   ├── api/
│   │   │   ├── client.ts   # Axios instance с interceptors
│   │   │   └── queryClient.ts  # React Query config
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useMediaQuery.ts
│   │   └── utils/
│   │       ├── formatters.ts  # Форматирование цен, дат
│   │       ├── validators.ts  # Валидация
│   │       └── constants.ts   # Константы
│   │
│   ├── types/              # TypeScript типы
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── App.tsx             # Главный компонент
│   ├── main.tsx            # Точка входа
│   └── router.tsx          # Конфигурация роутинга
│
├── public/                 # Статические файлы
└── index.html
```

## Ключевые архитектурные решения

### 1. Модульная структура Frontend (Feature-based)

Вместо FSD используется **feature-based** архитектура:
- Каждая фича (auth, catalog, cart, etc.) - самодостаточный модуль
- Внутри фичи: components, hooks, store, api
- Общие компоненты в `components/ui` и `components/layout`
- Переиспользуемая логика в `shared/`

**Преимущества:**
- Легко масштабировать (добавлять новые фичи)
- Четкое разделение ответственности
- Простота навигации по коду
- Легко удалять/заменять фичи

### 2. Управление состоянием

**Zustand** для клиентского состояния:
- `authStore` - данные пользователя, токены
- `cartStore` - корзина (с синхронизацией localStorage)
- `wishlistStore` - избранное

**TanStack Query** для серверного состояния:
- Кеширование данных
- Автоматическая ре-валидация
- Оптимистичные обновления
- Управление загрузкой и ошибками

### 3. API Layer

Централизованный API клиент:
```typescript
// shared/api/client.ts
- Axios instance с базовой конфигурацией
- Interceptors для JWT токенов
- Автоматический refresh токенов
- Обработка ошибок
```

Разделение по доменам:
```typescript
// features/*/api/*.ts
- productsApi.ts
- cartApi.ts
- ordersApi.ts
- etc.
```

### 4. Backend API Design

**RESTful API** с использованием ViewSets:
```
GET    /api/products/              - список товаров
GET    /api/products/{id}/         - детали товара
GET    /api/products/{id}/reviews/ - отзывы товара
POST   /api/products/{id}/reviews/ - добавить отзыв

GET    /api/categories/            - список категорий
GET    /api/categories/{id}/products/ - товары категории

GET    /api/cart/                  - получить корзину
POST   /api/cart/items/            - добавить в корзину
PATCH  /api/cart/items/{id}/       - обновить количество
DELETE /api/cart/items/{id}/       - удалить из корзины

POST   /api/orders/                - создать заказ
GET    /api/orders/                - список заказов
GET    /api/orders/{id}/           - детали заказа
POST   /api/orders/{id}/cancel/    - отменить заказ

GET    /api/wishlist/              - получить избранное
POST   /api/wishlist/add/          - добавить в избранное
DELETE /api/wishlist/remove/{id}/  - удалить из избранного

POST   /api/payments/create/       - создать платеж
POST   /api/payments/webhook/      - webhook от ЮKassa
GET    /api/payments/{id}/status/  - статус платежа
```

### 5. Модели данных

#### Category (Каталог)
```python
- name: CharField
- slug: SlugField (unique)
- description: TextField
- parent: ForeignKey (self, nullable) # Вложенные категории
- image: ImageField
- is_active: BooleanField
- created_at, updated_at: DateTimeField
```

#### Product (Товар)
```python
- name: CharField
- slug: SlugField (unique)
- description: TextField
- category: ForeignKey(Category)
- price: DecimalField
- discount_price: DecimalField (nullable)
- stock_quantity: PositiveIntegerField
- is_active: BooleanField
- views_count: PositiveIntegerField (default=0)
- created_at, updated_at: DateTimeField

# Computed properties:
- average_rating: через аннотацию
- reviews_count: через аннотацию
- final_price: price или discount_price
```

#### ProductImage (Галерея)
```python
- product: ForeignKey(Product)
- image: ImageField
- is_main: BooleanField (default=False)
- order: PositiveIntegerField (для сортировки)
- alt_text: CharField
```

#### ProductReview (Отзыв)
```python
- product: ForeignKey(Product)
- user: ForeignKey(User)
- rating: IntegerField (1-5)
- comment: TextField
- is_verified_purchase: BooleanField
- created_at, updated_at: DateTimeField

# Constraints:
- unique_together: (product, user) # Один отзыв на товар
```

#### Cart (Корзина)
```python
- user: ForeignKey(User, nullable=True) # Для авторизованных
- session_key: CharField (nullable=True) # Для гостей
- created_at, updated_at: DateTimeField

# Computed:
- total_amount: сумма всех items
```

#### CartItem (Элемент корзины)
```python
- cart: ForeignKey(Cart)
- product: ForeignKey(Product)
- quantity: PositiveIntegerField
- added_at: DateTimeField

# Constraints:
- unique_together: (cart, product)
```

#### Order (Заказ)
```python
- user: ForeignKey(User, nullable=True)
- order_number: CharField (unique, auto-generated)
- status: CharField (choices: pending, processing, shipped, delivered, cancelled)
- total_amount: DecimalField
- delivery_address: TextField
- delivery_city: CharField
- delivery_postal_code: CharField
- phone: CharField
- email: EmailField
- payment_status: CharField (choices: pending, paid, failed, refunded)
- payment_method: CharField (choices: card, cash)
- payment_id: CharField (nullable) # ID платежа в ЮKassa
- created_at, updated_at: DateTimeField
```

#### OrderItem (Элемент заказа)
```python
- order: ForeignKey(Order)
- product: ForeignKey(Product)
- quantity: PositiveIntegerField
- price_at_purchase: DecimalField # Snapshot цены
- product_name: CharField # Snapshot названия
```

#### Wishlist (Избранное)
```python
- user: ForeignKey(User)
- products: ManyToManyField(Product)
- created_at: DateTimeField
```

### 6. Аутентификация и авторизация

**JWT токены** (уже настроено):
- Access token: 30 минут
- Refresh token: 1 день
- Автоматический refresh на frontend

**Permissions:**
- Публичные: список товаров, категории, детали товара
- Авторизованные: корзина, заказы, отзывы, избранное
- Админ: управление товарами, заказами через Django Admin

### 7. Интеграция с ЮKassa

**Процесс оплаты:**
1. Пользователь оформляет заказ → создается Order со статусом `pending`
2. Frontend вызывает `/api/payments/create/` с order_id
3. Backend создает платеж в ЮKassa, возвращает `confirmation_url`
4. Frontend редиректит на `confirmation_url`
5. После оплаты ЮKassa вызывает webhook `/api/payments/webhook/`
6. Backend обновляет статус заказа на `processing`
7. Frontend проверяет статус через `/api/payments/{id}/status/`

**Безопасность:**
- Webhook подпись проверяется
- Идемпотентность операций
- Логирование всех платежных операций

### 8. Оптимизация производительности

**Backend:**
- `select_related()` для ForeignKey
- `prefetch_related()` для ManyToMany и обратных связей
- Индексы на часто используемые поля (slug, category, is_active)
- Пагинация для списков (PageNumberPagination)
- Кеширование категорий (Redis в будущем)

**Frontend:**
- Code splitting по роутам
- Lazy loading изображений
- Виртуализация длинных списков (react-window)
- Debounce для поиска
- Оптимистичные обновления корзины
- Service Worker для кеширования (PWA в будущем)

### 9. Обработка ошибок

**Backend:**
- Кастомные exception handlers
- Валидация на уровне serializers
- Транзакции для критичных операций (создание заказа)

**Frontend:**
- Error boundaries для React компонентов
- Toast уведомления для пользователя
- Retry логика для failed запросов
- Fallback UI для ошибок загрузки

### 10. Тестирование

**Backend:**
- Unit тесты для моделей
- API тесты для endpoints
- Integration тесты для бизнес-логики

**Frontend:**
- Unit тесты для утилит
- Component тесты (React Testing Library)
- E2E тесты для критичных флоу (Playwright)

## Масштабируемость

### Горизонтальное масштабирование
- Stateless backend (JWT)
- Shared session storage (Redis)
- CDN для статики и медиа
- Load balancer

### Вертикальное масштабирование
- Database optimization (индексы, партиционирование)
- Кеширование (Redis)
- Асинхронные задачи (Celery для email, отчетов)

### Будущие улучшения
- Микросервисная архитектура (отдельные сервисы для платежей, уведомлений)
- GraphQL вместо REST
- Server-Side Rendering (Next.js)
- Real-time обновления (WebSockets)
- Elasticsearch для поиска
- Recommendation engine

## Безопасность

- HTTPS обязательно
- CORS настроен правильно
- SQL injection защита (ORM)
- XSS защита (React escaping)
- CSRF токены
- Rate limiting для API
- Input validation на обоих уровнях
- Secure password hashing (Django default)
- JWT токены в httpOnly cookies (опционально)

## Мониторинг и логирование

- Structured logging (JSON)
- Error tracking (Sentry)
- Performance monitoring (New Relic / DataDog)
- Analytics (Google Analytics / Yandex Metrika)
- Health check endpoints

## Deployment

**Development:**
- Docker Compose для локальной разработки
- Hot reload для frontend и backend

**Production:**
- Docker containers
- Kubernetes для оркестрации
- PostgreSQL managed service
- S3-compatible storage для медиа
- CI/CD pipeline (GitHub Actions)

## Заключение

Архитектура спроектирована с учетом:
- ✅ Масштабируемости
- ✅ Поддерживаемости
- ✅ Производительности
- ✅ Безопасности
- ✅ Developer Experience

Модульная структура позволяет легко добавлять новые фичи и модифицировать существующие без риска сломать другие части системы.