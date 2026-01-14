
# План доработки оставшихся задач

## 📊 Текущее состояние проекта

### ✅ Полностью завершено (4 задачи):
1. **Восстановление пароля по почте** - Backend + Frontend работают
2. **Улучшение дизайна модалок сброса пароля** - Рефакторинг завершен
3. **CSS стили для лейблов товаров** - Добавлены градиентные стили для 4 типов
4. **Редактирование профиля** - Добавлены формы изменения ФИО, email, пароля

### 🔄 Backend готов, Frontend требует доработки (Задача 3):
- ✅ Backend: Room модель, миграции, API endpoints
- ✅ Backend: Product.label поле с 4 типами
- ✅ Backend: User ФИО поля (first_name, last_name, middle_name)
- ✅ Frontend: TypeScript типы и API методы
- ❌ Frontend: Компоненты фильтрации не обновлены

### ⏳ Не начато (Задача 4):
- Отображение рейтинга на карточке товара
- Сортировка по популярности
- Поиск товара по названию

---

## 🎯 ПЛАН ДОРАБОТКИ

---

## ЭТАП 1: Завершение реструктуризации категорий (Задача 3)

### 1.1. Обновить CategoryFilter для работы с Room → Category

**Файл:** `frontend/src/components/catalog/CategoryFilter/CategoryFilter.tsx`

**Текущая проблема:**
- Компонент работает со старой иерархией parent/subcategories
- Использует `category.subcategories` которого больше нет

**Новая логика:**
```
1. Загрузить список помещений (Rooms)
2. Отобразить помещения как верхний уровень
3. При выборе помещения загрузить его категории
4. Отобразить категории как второй уровень
5. При выборе категории обновить фильтр products
```

**Изменения в интерфейсе:**
```typescript
interface CategoryFilterProps {
  rooms: Room[];                    // Новое: список помещений
  selectedRoom: string | null;      // Новое: выбранное помещение (slug)
  categories: CategoryListItem[];   // Категории выбранного помещения
  selectedCategories: number[];
  onSelectRoom: (roomSlug: string | null) => void;  // Новое
  onToggleCategory: (categoryId: number) => void;
}
```

**Структура UI:**
```
CategoryFilter
├── Помещения (аккордеон)
│   ├── [x] Ванная комната
│   │   ├── [ ] Раковины
│   │   ├── [ ] Унитазы
│   │   └── [ ] Ванны
│   ├── [ ] Кухня
│   │   ├── [ ] Смесители
│   │   └── [ ] Мойки
│   └── [ ] Гостиная
```

**Ключевые моменты:**
- Убрать логику с `subcategories`
- Добавить двухуровневую структуру: Room → Categories
- При клике на Room загружать его категории через `roomsApi.getRoomCategories(slug)`
- Категории показывать только для выбранного помещения

---

### 1.2. Обновить ProductFilters - добавить фильтры room и label

**Файл:** `frontend/src/components/catalog/ProductFilters/ProductFilters.tsx`

**Что добавить:**

#### A. Фильтр по помещению (Room)
```typescript
// Новые props
interface ProductFiltersProps {
  // ... существующие props
  rooms: Room[];                    // Новое
  selectedRoom: string | null;      // Новое
  onRoomChange: (roomSlug: string | null) => void;  // Новое
}
```

**UI секция:**
```tsx
<div className="product-filters__section">
  <h4 className="product-filters__section-title">Помещение</h4>
  <div className="product-filters__room-list">
    {rooms.map((room) => (
      <label key={room.id} className="product-filters__radio-label">
        <input
          type="radio"
          name="room"
          checked={selectedRoom === room.slug}
          onChange={() => onRoomChange(room.slug)}
        />
        <span>{room.name}</span>
      </label>
    ))}
    {selectedRoom && (
      <button onClick={() => onRoomChange(null)}>
        Сбросить
      </button>
    )}
  </div>
</div>
```

#### B. Фильтр по лейблу (Label)
```typescript
// Новые props
interface ProductFiltersProps {
  // ... существующие props
  selectedLabels: string[];         // Новое: ['new', 'hit']
  onLabelsChange: (labels: string[]) => void;  // Новое
}
```

**UI секция:**
```tsx
<div className="product-filters__section">
  <h4 className="product-filters__section-title">Специальные предложения</h4>
  <div className="product-filters__label-list">
    <label className="product-filters__checkbox-label">
      <input
        type="checkbox"
        checked={selectedLabels.includes('new')}
        onChange={() => handleLabelToggle('new')}
      />
      <span className="product-filters__checkbox-custom"></span>
      <span>🟢 Новинки</span>
    </label>
    <label className="product-filters__checkbox-label">
      <input
        type="checkbox"
        checked={selectedLabels.includes('hit')}
        onChange={() => handleLabelToggle('hit')}
      />
      <span className="product-filters__checkbox-custom"></span>
      <span>🔴 Хиты продаж</span>
    </label>
    <label className="product-filters__checkbox-label">
      <input
        type="checkbox"
        checked={selectedLabels.includes('sale')}
        onChange={() => handleLabelToggle('sale')}
      />
      <span className="product-filters__checkbox-custom"></span>
      <span>🟠 Распродажа</span>
    </label>
    <label className="product-filters__checkbox-label">
      <input
        type="checkbox"
        checked={selectedLabels.includes('exclusive')}
        onChange={() => handleLabelToggle('exclusive')}
      />
      <span className="product-filters__checkbox-custom"></span>
      <span>🟣 Эксклюзив</span>
    </label>
  </div>
</div>
```

**Обновить hasActiveFilters:**
```typescript
const hasActiveFilters =
  minPrice !== undefined ||
  maxPrice !== undefined ||
  inStock ||
  onSale ||
  minRating !== undefined ||
  selectedBrands.length > 0 ||
  selectedRoom !== null ||        // Новое
  selectedLabels.length > 0;      // Новое
```

---

### 1.3. Обновить CatalogPage для новой логики фильтрации

**Файл:** `frontend/src/pages/CatalogPage/CatalogPage.tsx`

**Основные изменения:**

#### A. Добавить новые состояния
```typescript
const [rooms, setRooms] = useState<Room[]>([]);
const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
```

#### B. Загрузить помещения при монтировании
```typescript
useEffect(() => {
  const fetchRooms = async () => {
    try {
      const response = await roomsApi.getRooms();
      setRooms(response.data);
    } catch (err) {
      console.error("Ошибка загрузки помещений:", err);
    }
  };
  
  fetchRooms();
}, []);
```

#### C. Обновить логику загрузки категорий
```typescript
useEffect(() => {
  const fetchCategories = async () => {
    try {
      // Если выбрано помещение, загружаем только его категории
      if (selectedRoom) {
        const response = await roomsApi.getRoomCategories(selectedRoom);
        setCategories(response.data);
      } else {
        // Иначе загружаем все категории
        const response = await categoriesApi.list();
        setCategories(response.data.results);
      }
    } catch (err) {
      console.error("Ошибка загрузки категорий:", err);
    }
  };

  fetchCategories();
}, [selectedRoom]);
```

#### D. Обновить фильтры для API запроса
```typescript
useEffect(() => {
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters: ProductFiltersType = {};

      // Фильтр по помещению
      if (selectedRoom) {
        filters.room = selectedRoom;
      }

      // Фильтр по категории
      if (selectedCategories.length > 0) {
        const category = categories.find(
          (cat) => cat.id === selectedCategories[0]
        );
        if (category) {
          filters.category = category.slug;
        }
      }

      // Фильтр по лейблам (множественный)
      if (selectedLabels.length > 0) {
        // Backend поддерживает только один label за раз
        // Нужно либо изменить backend, либо делать несколько запросов
        // Временно берем первый лейбл
        filters.label = selectedLabels[0];
      }

      // ... остальные фильтры (цена, бренд, рейтинг и т.д.)

      const response = await productsApi.list(filters);
      setProducts(response.data.results);
    } catch (err) {
      console.error("Ошибка загрузки товаров:", err);
      setError("Не удалось загрузить товары");
    } finally {
      setIsLoading(false);
    }
  };

  fetchProducts();
}, [
  selectedRoom,        // Новое
  selectedCategories,
  selectedLabels,      // Новое
  searchQuery,
  ordering,
  // ... остальные зависимости
]);
```

#### E. Обновить URL параметры
```typescript
// Синхронизация с URL
useEffect(() => {
  const roomParam = searchParams.get("room");
  const categoryParam = searchParams.get("category");
  const labelParam = searchParams.get("label");

  if (roomParam && roomParam !== selectedRoom) {
    setSelectedRoom(roomParam);
  }

  // ... обработка category и label
}, [searchParams]);

// При изменении фильтров обновлять URL
const handleSelectRoom = (roomSlug: string | null) => {
  setSelectedRoom(roomSlug);
  
  const newParams = new URLSearchParams(searchParams);
  if (roomSlug) {
    newParams.set("room", roomSlug);
  } else {
    newParams.delete("room");
  }
  setSearchParams(newParams);
};
```

#### F. Обновить передачу props в компоненты
```tsx
<CategoryFilter
  rooms={rooms}
  selectedRoom={selectedRoom}
  categories={categories}
  selectedCategories={selectedCategories}
  onSelectRoom={handleSelectRoom}
  onToggleCategory={handleToggleCategory}
/>

<ProductFilters
  // ... существующие props
  rooms={rooms}
  selectedRoom={selectedRoom}
  selectedLabels={selectedLabels}
  onRoomChange={handleSelectRoom}
  onLabelsChange={setSelectedLabels}
/>
```

#### G. Обновить breadcrumbs (хлебные крошки)
```tsx
<div className="catalog-page__breadcrumbs">
  <Link to="/">Главная</Link>
  {selectedRoom && (
    <>
      <span> / </span>
      <span>{rooms.find(r => r.slug === selectedRoom)?.name}</span>
    </>
  )}
  {selectedCategoryNames.length > 0 && (
    <>
      <span> / </span>
      <span>{selectedCategoryNames[0].name}</span>
    </>
  )}
</div>
```

---

### 1.4. Обновить CategoriesSection на главной странице

**Файл:** `frontend/src/components/home/CategoriesSection/CategoriesSection.tsx`

**Текущая проблема:**
- Хардкод категорий с захардкоженными изображениями
- Не использует API

**Новая логика:**
```
1. Загрузить помещения (Rooms) через API
2. Отобразить помещения вместо категорий
3. При клике переходить в каталог с фильтром по помещению
```

**Изменения:**
```typescript
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { roomsApi } from "../../../api/roomsApi";
import type { Room } from "../../../types/room";
import arrowIcon from "../../../assets/arrow_right.svg";
import "./CategoriesSection.css";

export const CategoriesSection = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomsApi.getRooms();
        setRooms(response.data);
      } catch (err) {
        console.error("Ошибка загрузки помещений:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <section className="categories-section">
      <div className="categories-section__container">
        <h2 className="categories-section__title">Выберите помещение</h2>
        <div className="categories-section__grid">
          {rooms.map((room, index) => {
            // Определяем размер карточки по индексу (для красивой сетки)
            const size = index % 3 === 0 ? 'large' : index % 3 === 1 ? 'medium' : 'small';
            
            return (
              <Link
                key={room.id}
                to={`/catalog?room=${room.slug}`}
                className={`category-card category-card--${size}`}
              >
                {room.image && (
                  <img
                    src={room.image}
                    alt={room.name}
                    className="category-card__image"
                  />
                )}
                <div className="category-card__content">
                  <h3 className="category-card__title">{room.name}</h3>
                  {room.description && (
                    <p className="category-card__description">
                      {room.description}
                    </p>
                  )}
                </div>
                <div className="category-card__arrow">
                  <img src={arrowIcon} alt="" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
```

**Альтернативный вариант (если нужно показывать и категории):**
- Показывать помещения как основные карточки
- Под каждым помещением показывать его топ-3 категории
- Это потребует дополнительных API запросов

---

## ЭТАП 2: Реализация функций из Задачи 4

### 2.1. Добавить отображение рейтинга на карточке товара

**Файл:** `frontend/src/components/ui/ProductCard/ProductCard.tsx`

**Что добавить:**

#### A. Создать компонент StarRating
```typescript
// frontend/src/components/ui/StarRating/StarRating.tsx
import { Star } from "lucide-react";
import "./StarRating.css";

interface StarRatingProps {
  rating: number | null;
  reviewsCount?: number;
  size?: number;
  showCount?: boolean;
}

export const StarRating = ({ 
  rating, 
  reviewsCount = 0, 
  size = 16,
  showCount = true 
}: StarRatingProps) => {
  if (rating === null) {
    return null;
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="star-rating">
      <div className="star-rating__stars">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;
          
          return (
            <Star
              key={i}
              size={size}
              fill={isFilled || isHalf ? "currentColor" : "none"}
              className={`star-rating__star ${
                isFilled ? "star-rating__star--filled" : ""
              } ${isHalf ? "star-rating__star--half" : ""}`}
            />
          );
        })}
      </div>
      {showCount && reviewsCount > 0 && (
        <span className="star-rating__count">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
```

#### B. CSS для StarRating
```css
/* frontend/src/components/ui/StarRating/StarRating.css */
.star-rating {
  display: flex;
  align-items: center;
  gap: 6px;
}

.star-rating__stars {
  display: flex;
  gap: 2px;
}

.star-rating__star {
  color: #d1d5db;
  transition: color 0.2s;
}

.star-rating__star--filled {
  color: #fbbf24;
}

.star-rating__star--half {
  color: #fbbf24;
  /* Можно добавить градиент для половинки */
}

.star-rating__count {
  font-family: Montserrat, sans-serif;
  font-size: 13px;
  color: #6b7280;
}
```

#### C. Использовать в ProductCard
```tsx
import { StarRating } from "../StarRating/StarRating";

// В JSX ProductCard добавить после цены:
<StarRating 
  rating={product.average_rating} 
  reviewsCount={product.reviews_count}
  size={14}
/>
```

---

### 2.2. Добавить сортировку по популярности

**Backend изменения:**

#### A. Добавить поле orders_count в модель Product
```python
# backend/apps/catalog/models.py

class Product(models.Model):
    # ... существующие поля
    
    orders_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Количество заказов",
        help_text="Счетчик заказов для сортировки по популярности"
    )
```

#### B. Создать миграцию
```bash
python manage.py makemigrations
python manage.py migrate
```

#### C. Обновить ProductViewSet для поддержки сортировки
```python
# backend/apps/catalog/views.py

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    # ...
    ordering_fields = [
        'price', 
        'created_at', 
        'views_count', 
        'name',
        'orders_count'  # Новое
    ]
```

#### D. Обновить метод создания заказа для увеличения счетчика
```python
# backend/apps/orders/views.py или signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order

@receiver(post_save, sender=Order)
def update_product_orders_count(sender, instance, created, **kwargs):
    """Обновить счетчик заказов для товаров"""
    if created and instance.status == 'confirmed':
        for item in instance.items.all():
            item.product.orders_count += item.quantity
            item.product.save(update_fields=['orders_count'])
```

**Frontend изменения:**

#### Добавить кнопку сортировки в CatalogPage
```tsx
// В catalog-page__sort-buttons добавить:
<button
  className={`catalog-page__sort-button ${
    ordering === "-orders_count" ? "catalog-page__sort-button--active" : ""
  }`}
  onClick={() => setOrdering("-orders_count")}
>
  По популярности
</button>
```

---

### 2.3. Добавить поиск товара по названию на странице каталога

**Текущее состояние:**
- Поиск уже реализован в CatalogPage (строка 27, 120-122)
- Backend поддерживает поиск через `search_fields = ['name', 'description']`

**Что нужно добавить:**

#### A. Поле поиска в UI CatalogPage
```tsx
// Добавить перед catalog-page__sort-panel:
<div className="catalog-page__search">
  <input
    type="text"
    placeholder="Поиск товаров..."
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      // Обновить URL
      const newParams = new URLSearchParams(searchParams);
      if (e.target.value) {
        newParams.set("search", e.target.value);
      } else {
        newParams.delete("search");
      }
      setSearchParams(newParams);
    }}
    className="catalog-page__search-input"
  />
  {searchQuery && (
    <button
      onClick={handleClearSearch}
      className="catalog-page__search-clear"
    >
      <X size={18} />
    </button>
  )}
</div>
```

#### B. CSS для поля поиска
```css
.catalog-page__search {
  position: relative;
  margin-bottom: 24px;
}

.catalog-page__search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  transition: border-color 0.2s;
}

.catalog-page__search-input:focus {
  outline: none;
  border-color: #2563eb;
}

.catalog-page__search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.catalog-page__search-clear:hover {
  color: #374151;
}
```

**Примечание:** Поиск уже работает через URL параметр `?search=`, просто нужно добавить UI элемент.

---

## ЭТАП 3: Создание тестовых данных

### 3.1. Создать помещения через админ-панель

**Действия:**
1. Зайти в админ-панель Django: `http://localhost:8000/admin/`
2. Перейти в раздел "Помещения" (Rooms)
3. Создать помещения:

```
Помещение 1:
- Название: Ванная комната
- Slug: vannaya-komnata (автогенерация)
- Описание: Сантехника и аксессуары для ванной комнаты
- Порядок: 1
- Активно: ✓

Помещение 2:
- Название: Кухня
- Slug: kukhnya
- Описание: Оборудование и аксессуары для кухни
- Порядок: 2
- Активно: ✓

Помещение 3:
- Название: Гостиная
- Slug: gostinaya
- Описание: Мебель и декор для гостиной
- Порядок: 3
- Активно: ✓

Помещение 4:
- Название: Спальня
- Slug: spalnya
- Описание: Мебель и аксессуары для спальни
- Порядок: 4
- Активно: ✓
```

### 3.2. Привязать категории к помещениям

**Действия:**
1. Перейти в раздел "Категории" (Categories)
2. Для каждой категории выбрать подходящие помещения:

```
Раковины → Ванная комната
Унитазы → Ванная комната
Ванны → Ванная комната
Душевые кабины → Ванная комната
Смесители → Ванная комната, Кухня
Мойки → Кухня
Плитка → Ванная комната, Кухня
Мебель для ванной → Ванная комната
```

### 3.3. Установить лейблы для товаров

**Действия:**
1. Перейти в раздел "Товары" (Products)
2. Для каждого товара установить подходящий лейбл:

```
Новые товары (созданные недавно) → label: "new"
Популярные товары (много просмотров) → label: "hit"
Товары со скидкой → label: "sale"
Премиум товары → label: "exclusive"
```

### 3.4. Привязать товары к помещениям

**Действия:**
1. Для каждого товара выбрать помещение на основе его категории:

```
Если категория = Раковины → room = Ванная комната
Если категория = Смесители → room = Ванная комната или Кухня
Если категория = Мойки → room = Кухня
```

---

## ЭТАП 4: Тестирование

### 4.1. Backend API тестирование

**Проверить endpoints:**
```bash
# Помещения
GET /api/catalog/rooms/
GET /api/catalog/rooms/vannaya-komnata/
GET /api/catalog/rooms/vannaya-komnata/categories/

# Категории с фильтром по помещению
GET /api/catalog/categories/?room=vannaya-komnata

# Товары с фильтрами
GET /api/catalog/products/?room=vannaya-komnata
GET /api/catalog/products/?label=new
GET /api/catalog/products/?room=kukhnya&category=smesiteli
GET /api/catalog/products/?ordering=-orders_count
GET /api/catalog/products/?search=смеситель
```

### 4.2. Frontend тестирование

**Сценарии:**

1. **Главная страница:**
   - Отображаются помещения вместо категорий
   - Клик по помещению ведет в каталог с фильтром

2. **Страница каталога:**
   - Фильтр по помещениям работает
   - Фильтр по категориям внутри помещения работает
   - Фильтр по лейблам работает
   - Поиск по названию работает
   - Сортировка по популярности работает
   - Комбинированные фильтры работают

3. **Карточка товара:**
   - Отображается правильный лейбл
   - Отображается рейтинг со звездами
   - Количество отзывов корректно

4. **URL параметры:**
   - `/catalog?room=vannaya-komnata` - фильтр по помещению
   - `/catalog?room=kukhnya&category=smesiteli` - комбинированный
   - `/catalog?label=new` - фильтр по лейблу
   - `/catalog?search=смеситель` - поиск

5. **Breadcrumbs:**
   - Главная / Ванная комната
   - Главная / Кухня / Смесители

---

## 📋 ЧЕКЛИСТ ВЫПОЛНЕНИЯ

### Задача 3: Реструктуризация категорий

- [ ] 1.1. Обновить CategoryFilter для Room → Category
- [ ] 1.2. Обновить ProductFilters (добавить room и label)
- [ ] 1.3. Обновить CatalogPage (новая логика фильтрации)
- [ ] 1.4. Обновить CategoriesSection (показывать помещения)
- [ ] 1.5. Создать тестовые помещения через админку
- [ ] 1.6. Привязать категории к помещениям
- [ ] 1.7. Установить лейблы для товаров
- [ ] 1.8. Протестировать фильтрацию

### Задача 4: Рейтинг, поиск, сортировка

- [ ] 2.1. Создать компонент StarRating
- [ ] 2.2. Добавить рейтинг на ProductCard
- [ ] 2.3. Добавить поле orders_count в Product (backend)
- [ ] 2.4. Создать миграцию для orders_count
- [ ] 2.5. Добавить сортировку по популярности (frontend)
- [ ] 2.6. Добавить UI поля поиска в CatalogPage
- [ ] 2.7. Протестировать все функции

---

## 🎯 ПРИОРИТЕТЫ

### Критично (блокирует работу):
1. CategoryFilter - без этого фильтрация не работает
2. CatalogPage - основная страница каталога