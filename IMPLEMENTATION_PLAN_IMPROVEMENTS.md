# План реализации улучшений SM Market

## Обзор задач

1. **Редактирование пользовательских данных** - смена email/пароля в личном кабинете
2. **Восстановление пароля** - функционал сброса пароля по email
3. **Реструктуризация категорий** - разделение на "Помещения" и "Категории оборудования"
4. **Улучшения карточек товаров** - рейтинг, лейблы, поиск, сортировка по популярности

---

## Задача 1: Редактирование пользовательских данных

### Backend изменения

#### 1.1. Обновление модели User
**Файл:** `backend/apps/users/models.py`

```python
# Добавить поля:
- first_name (CharField, max_length=150, blank=True)
- last_name (CharField, max_length=150, blank=True)
- middle_name (CharField, max_length=150, blank=True) # Отчество
```

**Миграция:** `python manage.py makemigrations users`

#### 1.2. Новые сериализаторы
**Файл:** `backend/apps/users/serializers.py`

Добавить:
- `UserUpdateSerializer` - для обновления ФИО и телефона
- `ChangeEmailSerializer` - для смены email с подтверждением
- `ChangePasswordSerializer` - для смены пароля (требует старый пароль)

#### 1.3. Новые endpoints
**Файл:** `backend/apps/users/views.py`

Добавить views:
- `UserUpdateView` (PATCH) - обновление профиля
- `ChangeEmailView` (POST) - смена email
- `ChangePasswordView` (POST) - смена пароля

**Файл:** `backend/apps/users/urls.py`

Добавить маршруты:
```python
path('profile/update/', UserUpdateView.as_view()),
path('profile/change-email/', ChangeEmailView.as_view()),
path('profile/change-password/', ChangePasswordView.as_view()),
```

### Frontend изменения

#### 1.4. Обновление типов
**Файл:** `frontend/src/types/auth.ts`

```typescript
interface User {
  id: number;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  // ... остальные поля
}

interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone?: string;
}

interface ChangeEmailPayload {
  new_email: string;
  password: string;
}

interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
```

#### 1.5. API методы
**Файл:** `frontend/src/api/authApi.ts`

Добавить методы:
- `updateProfile(data: UpdateProfilePayload)`
- `changeEmail(data: ChangeEmailPayload)`
- `changePassword(data: ChangePasswordPayload)`

#### 1.6. Компонент редактирования профиля
**Файл:** `frontend/src/pages/ProfilePage/ProfilePage.tsx`

Добавить:
- Форму редактирования ФИО и телефона
- Модальное окно для смены email
- Модальное окно для смены пароля
- Валидацию полей

---

## Задача 2: Восстановление пароля по email

### Backend изменения

#### 2.1. Установка зависимостей
**Файл:** `backend/requirements.txt`

```
django-rest-passwordreset==1.3.0
```

#### 2.2. Настройка email
**Файл:** `backend/config/settings.py`

```python
# Email настройки
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)

# Добавить в INSTALLED_APPS
'django_rest_passwordreset',
```

#### 2.3. Модель для токенов сброса
**Файл:** `backend/apps/users/models.py`

```python
class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
```

#### 2.4. Views для сброса пароля
**Файл:** `backend/apps/users/views.py`

Добавить:
- `PasswordResetRequestView` (POST) - запрос на сброс (отправка email)
- `PasswordResetConfirmView` (POST) - подтверждение сброса с новым паролем

**Файл:** `backend/apps/users/urls.py`

```python
path('password-reset/', PasswordResetRequestView.as_view()),
path('password-reset/confirm/', PasswordResetConfirmView.as_view()),
```

#### 2.5. Email шаблоны
**Создать:** `backend/apps/users/templates/email/`

- `password_reset_email.html` - шаблон письма со ссылкой

### Frontend изменения

#### 2.6. Типы
**Файл:** `frontend/src/types/auth.ts`

```typescript
interface PasswordResetRequestPayload {
  email: string;
}

interface PasswordResetConfirmPayload {
  token: string;
  new_password: string;
  confirm_password: string;
}
```

#### 2.7. API методы
**Файл:** `frontend/src/api/authApi.ts`

```typescript
passwordResetRequest(data: PasswordResetRequestPayload)
passwordResetConfirm(data: PasswordResetConfirmPayload)
```

#### 2.8. Компоненты
**Создать:**
- `frontend/src/components/features/auth/PasswordResetModal/` - модалка запроса сброса
- `frontend/src/pages/PasswordResetPage/` - страница подтверждения сброса

**Обновить:** `frontend/src/App.tsx`

Добавить маршрут:
```typescript
<Route path="/password-reset/:token" element={<PasswordResetPage />} />
```

---

## Задача 3: Реструктуризация категорий (Помещения + Категории)

### Концепция

**Текущая структура:** Category (с parent/subcategories)

**Новая структура:**
- **Room** (Помещение) - Ванная, Кухня, Гостиная и т.д.
- **Category** (Категория оборудования) - Смесители, Раковины, Унитазы и т.д.
- **Product** связан с Room И Category

### Backend изменения

#### 3.1. Новая модель Room
**Файл:** `backend/apps/catalog/models.py`

```python
class Room(models.Model):
    """Помещение (Ванная, Кухня и т.д.)"""
    name = models.CharField(max_length=200, verbose_name="Название")
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='rooms/', null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Помещение"
        verbose_name_plural = "Помещения"
        ordering = ['order', 'name']
```

#### 3.2. Обновление модели Category
**Файл:** `backend/apps/catalog/models.py`

```python
class Category(models.Model):
    """Категория оборудования"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    # УДАЛИТЬ поле parent - больше не нужна вложенность
    rooms = models.ManyToManyField(
        Room,
        related_name='categories',
        verbose_name="Доступно для помещений",
        help_text="В каких помещениях используется эта категория"
    )
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    # ... остальные поля
```

#### 3.3. Обновление модели Product
**Файл:** `backend/apps/catalog/models.py`

```python
class Product(models.Model):
    # ... существующие поля
    room = models.ForeignKey(
        Room,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        verbose_name="Помещение"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name="Категория оборудования"
    )
    label = models.CharField(
        max_length=50,
        blank=True,
        choices=[
            ('new', 'Новинка'),
            ('hit', 'Хит продаж'),
            ('sale', 'Акция'),
            ('exclusive', 'Эксклюзив'),
        ],
        verbose_name="Лейбл"
    )
    # ... остальные поля
```

**Миграция:** Создать data migration для переноса существующих категорий

#### 3.4. Сериализаторы
**Файл:** `backend/apps/catalog/serializers.py`

Добавить:
- `RoomSerializer` - для помещений
- `RoomDetailSerializer` - детальная информация с категориями

Обновить:
- `CategorySerializer` - добавить поле `rooms`
- `ProductListSerializer` - добавить `room_id`, `room_name`, `label`
- `ProductDetailSerializer` - добавить полную информацию о room и label

#### 3.5. ViewSets
**Файл:** `backend/apps/catalog/views.py`

Добавить:
- `RoomViewSet` - CRUD для помещений
- Метод `categories` в RoomViewSet - получить категории для помещения

Обновить:
- `ProductViewSet.get_queryset()` - добавить фильтр по `room`
- Добавить фильтр по `label`

**Файл:** `backend/apps/catalog/urls.py`

```python
router.register(r'rooms', RoomViewSet, basename='room')
```

### Frontend изменения

#### 3.6. Типы
**Создать:** `frontend/src/types/room.ts`

```typescript
interface Room {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  order: number;
  is_active: boolean;
  categories?: Category[];
}
```

**Обновить:** `frontend/src/types/category.ts`

```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  rooms: number[]; // ID помещений
  image: string | null;
  // УДАЛИТЬ: parent, subcategories
}
```

**Обновить:** `frontend/src/types/product.ts`

```typescript
interface ProductListItem {
  // ... существующие поля
  room_id: number | null;
  room_name: string | null;
  label: 'new' | 'hit' | 'sale' | 'exclusive' | '';
}
```

#### 3.7. API
**Создать:** `frontend/src/api/roomsApi.ts`

```typescript
export const roomsApi = {
  list: () => api.get<Room[]>('/catalog/rooms/'),
  retrieve: (slug: string) => api.get<Room>(`/catalog/rooms/${slug}/`),
  categories: (slug: string) => api.get<Category[]>(`/catalog/rooms/${slug}/categories/`),
};
```

**Обновить:** `frontend/src/api/productsApi.ts`

Добавить в `ProductFilters`:
```typescript
room?: string; // slug помещения
label?: string;
```

#### 3.8. Компоненты

**Создать:** `frontend/src/components/catalog/RoomFilter/`
- Фильтр по помещениям (вместо старого CategoryFilter)

**Обновить:** `frontend/src/components/catalog/CategoryFilter/`
- Теперь показывает категории оборудования для выбранного помещения
- Убрать логику вложенности (subcategories)

**Обновить:** `frontend/src/components/ui/ProductCard/ProductCard.tsx`
- Заменить хардкод "Новинка!" на динамический `product.label`
- Добавить стили для разных лейблов (hit, sale, exclusive)

**Обновить:** `frontend/src/pages/CatalogPage/CatalogPage.tsx`
- Добавить выбор помещения (Room)
- Фильтрация категорий по выбранному помещению
- Обновить логику фильтрации товаров

**Обновить:** `frontend/src/pages/HomePage/HomePage.tsx`
- Секция с помещениями вместо/вместе с категориями

#### 3.9. Data Migration скрипт
**Создать:** `backend/apps/catalog/management/commands/migrate_categories_to_rooms.py`

Скрипт для переноса данных:
1. Создать Room для каждой родительской Category
2. Преобразовать subcategories в обычные Categories
3. Связать Categories с соответствующими Rooms
4. Обновить Products

---

## Задача 4: Улучшения карточек и каталога

### 4.1. Рейтинг на карточке товара

#### Backend
**Файл:** `backend/apps/catalog/serializers.py`

`ProductListSerializer` уже имеет `average_rating` - проверить что работает корректно

#### Frontend
**Обновить:** `frontend/src/components/ui/ProductCard/ProductCard.tsx`

```typescript
// Добавить компонент отображения рейтинга
<div className="product-card__rating">
  <StarRating rating={product.average_rating || 0} />
  <span className="product-card__reviews-count">
    ({product.reviews_count || 0})
  </span>
</div>
```

**Создать:** `frontend/src/components/ui/StarRating/`
- Компонент для отображения звездного рейтинга

### 4.2. Сортировка по популярности

#### Backend
**Файл:** `backend/apps/catalog/views.py`

Обновить `ProductViewSet`:
```python
ordering_fields = ['price', 'created_at', 'views_count', 'name']

# Добавить в get_queryset():
if ordering == 'popularity' or ordering == '-popularity':
    queryset = queryset.annotate(
        popularity_score=F('views_count') * 2 + Count('reviews') * 5
    ).order_by('-popularity_score' if ordering == '-popularity' else 'popularity_score')
```

#### Frontend
**Обновить:** `frontend/src/pages/CatalogPage/CatalogPage.tsx`

Добавить кнопку сортировки:
```typescript
<button
  className={`catalog-page__sort-button ${
    ordering === "-popularity" ? "catalog-page__sort-button--active" : ""
  }`}
  onClick={() => setOrdering("-popularity")}
>
  По популярности
</button>
```

### 4.3. Поиск по названию товара

#### Backend
**Файл:** `backend/apps/catalog/views.py`

`ProductViewSet` уже имеет:
```python
search_fields = ['name', 'description']
```

Проверить что работает корректно с параметром `?search=`

#### Frontend
**Обновить:** `frontend/src/pages/CatalogPage/CatalogPage.tsx`

Добавить поле поиска:
```typescript
<div className="catalog-page__search">
  <input
    type="text"
    placeholder="Поиск товаров..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="catalog-page__search-input"
  />
  <SearchIcon className="catalog-page__search-icon" />
</div>
```

Поиск уже реализован, нужно только добавить UI элемент

### 4.4. Скрытие поиска на других страницах

**Обновить:** `frontend/src/components/layout/Header/Header.tsx`

Добавить проп `showSearch` и условный рендеринг:
```typescript
const location = useLocation();
const showSearch = location.pathname === '/catalog';

{showSearch && (
  <div className="header__search">
    {/* поисковая форма */}
  </div>
)}
```

---

## Порядок реализации

### Этап 1: Подготовка (1-2 часа)
1. Создать ветку `feature/improvements`
2. Обновить зависимости backend
3. Настроить email для восстановления пароля

### Этап 2: Задача 1 - Редактирование профиля (3-4 часа)
1. Backend: модель User + миграция
2. Backend: сериализаторы и views
3. Frontend: типы и API
4. Frontend: UI компоненты
5. Тестирование

### Этап 3: Задача 2 - Восстановление пароля (2-3 часа)
1. Backend: модель токенов + views
2. Backend: email шаблоны
3. Frontend: компоненты и страницы
4. Тестирование email flow

### Этап 4: Задача 3 - Реструктуризация (5-6 часов)
1. Backend: модель Room
2. Backend: обновление Category и Product
3. Backend: data migration скрипт
4. Backend: сериализаторы и views
5. Frontend: типы и API
6. Frontend: компоненты фильтрации
7. Frontend: обновление страниц
8. Запуск миграции данных
9. Тестирование

### Этап 5: Задача 4 - Улучшения UI (2-3 часа)
1. Backend: сортировка по популярности
2. Frontend: рейтинг на карточках
3. Frontend: поле поиска в каталоге
4. Frontend: условный рендеринг поиска
5. Frontend: динамические лейблы
6. Тестирование

### Этап 6: Финализация (1-2 часа)
1. Общее тестирование
2. Исправление багов
3. Обновление документации
4. Code review
5. Merge в main

---

## Технические детали

### Миграции базы данных

**Порядок миграций:**
1. `0008_add_user_full_name.py` - добавить ФИО в User
2. `0009_password_reset_token.py` - модель для токенов сброса
3. `0010_create_room_model.py` - создать модель Room
4. `0011_update_category_remove_parent.py` - убрать parent из Category
5. `0012_add_room_to_product.py` - добавить room и label в Product
6. `0013_category_rooms_m2m.py` - связь Category-Room
7. `0014_migrate_data.py` - data migration (RunPython)

### Environment переменные

**Добавить в `.env`:**
```env
# Email settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@sm-market.com

# Frontend URL for password reset links
FRONTEND_URL=http://localhost:5173
```

### Тестирование

**Backend тесты:**
- `test_user_profile_update.py`
- `test_password_reset.py`
- `test_room_category_structure.py`
- `test_product_filtering.py`

**Frontend тесты:**
- Ручное тестирование всех форм
- Проверка валидации
- Тестирование фильтрации и поиска

---

## Потенциальные проблемы и решения

### Проблема 1: Миграция существующих данных
**Решение:** Создать подробный data migration скрипт с откатом

### Проблема 2: Email не отправляется
**Решение:** Использовать console backend для разработки, настроить SMTP для продакшена

### Проблема 3: Конфликты в фильтрации Room + Category
**Решение:** Четкая логика: сначала выбор Room, затем фильтр по Categories этого Room

### Проблема 4: Производительность при подсчете популярности
**Решение:** Добавить индексы на views_count, кэшировать результаты

---

## Чеклист перед деплоем

- [ ] Все миграции применены
- [ ] Data migration выполнена успешно
- [ ] Email настроен и тестирован
- [ ] Все формы валидируются
- [ ] Фильтрация работает корректно
- [ ] Поиск работает
- [ ] Рейтинг отображается
- [ ] Лейблы динамические
- [ ] Мобильная версия работает
- [ ] Документация обновлена
- [ ] Тесты пройдены

---

## Оценка времени

- **Задача 1:** 3-4 часа
- **Задача 2:** 2-3 часа
- **Задача 3:** 5-6 часов
- **Задача 4:** 2-3 часа
- **Тестирование и баги:** 2-3 часа

**Итого:** 14-19 часов работы

---

## Примечания

1. Все изменения должны быть обратно совместимы где возможно
2. Старые API endpoints сохранить с deprecation warning
3. Добавить версионирование API если нужно
4. Документировать все новые endpoints в API_DOCUMENTATION.md
5. Обновить README.md с новыми фичами