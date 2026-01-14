# 🎯 Финальный план доработки проекта SM-Market

**Дата создания:** 14 января 2026  
**Статус:** Готов к реализации

---

## 📊 Общий статус выполнения

### ✅ Полностью завершено (20%)
- ✅ Восстановление пароля по почте (Backend + Frontend)
- ✅ Backend для реструктуризации категорий (Room, Category, Product models)
- ✅ TypeScript типы и API методы для Room
- ✅ Динамические лейблы в ProductCard компоненте

### 🔄 В процессе (10%)
- 🔄 Улучшение дизайна модалки и страницы сброса пароля

### ⏳ Ожидает реализации (70%)
- ⏳ Редактирование профиля (email/пароль) в личном кабинете
- ⏳ CSS стили для лейблов товаров
- ⏳ Обновление компонентов фильтрации (CategoryFilter, ProductFilters)
- ⏳ Обновление CatalogPage для новой логики
- ⏳ Обновление главной страницы (CategoriesSection)
- ⏳ Сортировка по популярности
- ⏳ Отображение рейтинга на карточках
- ⏳ Создание тестовых данных

---

## 🎨 БЛОК 1: Улучшение дизайна сброса пароля

### Приоритет: 🔴 Высокий (быстрое исправление)

### Задачи:
1. ✅ Переделать PasswordResetModal с использованием компонента Modal
2. ✅ Использовать Input и Button компоненты для единообразия
3. ✅ Добавить правильные отступы и валидацию
4. ✅ Улучшить PasswordResetPage с теми же компонентами

### Файлы для изменения:
- `frontend/src/components/features/auth/PasswordResetModal/PasswordResetModal.tsx`
- `frontend/src/components/features/auth/PasswordResetModal/PasswordResetModal.css`
- `frontend/src/pages/PasswordResetPage/PasswordResetPage.tsx`
- `frontend/src/pages/PasswordResetPage/PasswordResetPage.css`

**Детали реализации см. в файле CATEGORY_RESTRUCTURE_STATUS.md**

---

## 👤 БЛОК 2: Редактирование профиля

### Приоритет: 🔴 Высокий

### Задачи:
1. Добавить UI для редактирования ФИО и телефона
2. Добавить форму смены email с подтверждением паролем
3. Добавить форму смены пароля
4. Добавить CSS стили для форм редактирования

### Файлы для изменения:
- `frontend/src/pages/ProfilePage/ProfilePage.tsx` - добавить 3 новые секции
- `frontend/src/pages/ProfilePage/ProfilePage.css` - добавить стили

### Ключевые моменты:
- Использовать существующие state переменные (isEditingProfile, isChangingEmail, isChangingPassword)
- Использовать компоненты Input и Button для единообразия
- Добавить валидацию на фронтенде
- Показывать формы inline (не в модалках)

---

## 🏷️ БЛОК 3: CSS стили для лейблов товаров

### Приоритет: 🔴 Критично (блокирует отображение)

### Задача:
Добавить CSS стили для динамических лейблов товаров

### Файл:
`frontend/src/components/ui/ProductCard/ProductCard.css`

### Стили для добавления:
```css
.product-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.product-card__badge--new { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; }
.product-card__badge--hit { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; }
.product-card__badge--sale { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; }
.product-card__badge--exclusive { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; }
```

---

## 🏠 БЛОК 4: Реструктуризация категорий - CategoryFilter

### Приоритет: 🟡 Средний

### Задача:
Переделать CategoryFilter для работы с Room → Category иерархией

### Файлы:
- `frontend/src/components/catalog/CategoryFilter/CategoryFilter.tsx` - полная переработка
- `frontend/src/components/catalog/CategoryFilter/CategoryFilter.css` - новые стили

### Новая логика:
1. Загружать список помещений (Room) через `roomsApi.getRooms()`
2. При клике на помещение - загружать его категории через `roomsApi.getRoomCategories(slug)`
3. Показывать категории как чекбоксы под развернутым помещением
4. Передавать выбранное помещение и категории в родительский компонент

### Props интерфейс:
```typescript
interface CategoryFilterProps {
  selectedRoom: string | null;
  selectedCategories: number[];
  onRoomChange: (roomSlug: string | null) => void;
  onToggleCategory: (categoryId: number) => void;
}
```

---

## 🔍 БЛОК 5: ProductFilters - добавление фильтров

### Приоритет: 🟡 Средний

### Задачи:
1. Добавить фильтр по лейблам (new, hit, sale, exclusive)
2. Убрать или адаптировать старые фильтры если нужно

### Файл:
`frontend/src/components/catalog/ProductFilters/ProductFilters.tsx`

### Добавить в Props:
```typescript
interface ProductFiltersProps {
  // ... существующие props
  selectedLabels: string[];
  onLabelsChange: (labels: string[]) => void;
}
```

### Добавить секцию фильтра:
```tsx
<div className="product-filters__section">
  <h4 className="product-filters__section-title">Лейблы</h4>
  <div className="product-filters__checkboxes">
    <label className="product-filters__checkbox-label">
      <input type="checkbox" value="new" 
        checked={selectedLabels.includes('new')}
        onChange={(e) => {
          if (e.target.checked) {
            onLabelsChange([...selectedLabels, 'new']);
          } else {
            onLabelsChange(selectedLabels.filter(l => l !== 'new'));
          }
        }}
      />
      <span>Новинки</span>
    </label>
    {/* Аналогично для hit, sale, exclusive */}
  </div>
</div>
```

---

## 📄 БЛОК 6: CatalogPage - новая логика фильтрации

### Приоритет: 🟡 Средний

### Задачи:
1. Добавить state для selectedRoom и selectedLabels
2. Обновить логику загрузки товаров с новыми фильтрами
3. Обновить URL параметры (добавить room, label)
4. Обновить breadcrumbs для отображения Room → Category
5. Добавить сортировку по популярности

### Файл:
`frontend/src/pages/CatalogPage/CatalogPage.tsx`

### Новые state переменные:
```typescript
const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
```

### Обновить фильтры для API:
```typescript
if (selectedRoom) {
  filters.room = selectedRoom;
}
if (selectedLabels.length > 0) {
  filters.label = selectedLabels;
}
```

### Добавить сортировку по популярности:
```tsx
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

## 🏡 БЛОК 7: Главная страница - CategoriesSection

### Приоритет: 🟢 Низкий

### Задача:
Показывать помещения (Rooms) вместо категорий на главной странице

### Файл:
`frontend/src/components/home/CategoriesSection/CategoriesSection.tsx`

### Изменения:
1. Загружать rooms вместо categories
2. При клике переходить в каталог с фильтром по room: `/catalog?room={slug}`
3. Обновить отображение карточек

```typescript
const [rooms, setRooms] = useState<Room[]>([]);

useEffect(() => {
  const fetchRooms = async () => {
    const response = await roomsApi.getRooms();
    setRooms(response.data);
  };
  fetchRooms();
}, []);

// В JSX:
{rooms.map((room) => (
  <Link to={`/catalog?room=${room.slug}`} key={room.id}>
    <CategoryCard
      name={room.name}
      image={room.image}
      description={room.description}
    />
  </Link>
))}
```

---

## ⭐ БЛОК 8: Отображение рейтинга на карточках

### Приоритет: 🟢 Низкий

### Задачи:
1. Создать компонент StarRating
2. Добавить отображение рейтинга в ProductCard
3. Добавить стили

### Новый файл:
`frontend/src/components/ui/StarRating/StarRating.tsx`

```tsx
import { Star } from "lucide-react";
import "./StarRating.css";

interface StarRatingProps {
  rating: number; // 0-5
  size?: number;
  showNumber?: boolean;
}

export const StarRating = ({ rating, size = 16, showNumber = true }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      <div className="star-rating__stars">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} fill="#fbbf24" stroke="#fbbf24" />
        ))}
        {hasHalfStar && (
          <div className="star-rating__half-star">
            <Star size={size} fill="#fbbf24" stroke="#fbbf24" style={{ clipPath: "inset(0 50% 0 0)" }} />
            <Star size={size} fill="none" stroke="#d1d5db" style={{ position: "absolute", left: 0 }} />
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} fill="none" stroke="#d1d5db" />
        ))}
      </div>
      {showNumber && <span className="star-rating__number">{rating.toFixed(1)}</span>}
    </div>
  );
};
```

### Добавить в ProductCard:
```tsx
{product.average_rating > 0 && (
  <div className="product-card__rating">
    <StarRating rating={product.average_rating} size={14} />
  </div>
)}
```

---

## 🗄️ БЛОК 9: Backend - добавить orders_count

### Приоритет: 🟡 Средний

### Задача:
Добавить поле orders_count в модель Product для сортировки по популярности

### Файл:
`backend/apps/catalog/models.py`

### Добавить в модель Product:
```python
class Product(models.Model):
    # ... существующие поля
    orders_count = models.IntegerField(default=0, verbose_name="Количество заказов")
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-orders_count']),  # Индекс для быстрой сортировки
        ]
```

### Создать миграцию:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Обновить при создании заказа:
В `backend/apps/orders/views.py` в методе создания заказа:

```python
# После создания OrderItem
for item in order.items.all():
    product = item.product
    product.orders_count += item.quantity
    product.save(update_fields=['orders_count'])
```

### Добавить в сериализатор:
`backend/apps/catalog/serializers.py`

```python
class ProductListSerializer(serializers.ModelSerializer):
    # ... существующие поля
    orders_count = serializers.IntegerField(read_only=True)
```

### Добавить в ViewSet фильтрацию:
```python
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    # ... существующий код
    ordering_fields = ['price', 'created_at', 'discount_percentage', 'orders_count']
```

---

## 📝 БЛОК 10: Создание тестовых данных

### Приоритет: 🟢 Низкий (делается через админку)

### Задачи:
1. Создать помещения (Rooms) через админку
2. Привязать категории к помещениям
3. Установить лейблы для товаров
4. Привязать товары к помещениям

### Примеры помещений:
1. **Ванная комната**
   - Категории: Ванны, Раковины, Унитазы, Смесители для ванной, Душевые кабины
   
2. **Кухня**
   - Категории: Мойки, Смесители для кухни, Вытяжки, Аксессуары для кухни

3. **Туалет**
   - Категории: Унитазы, Биде, Аксессуары для туалета

4. **Прихожая**
   - Категории: Зеркала, Вешалки, Обувницы

### Шаги:
1. Войти в админку: http://localhost:8000/admin/
2. Перейти в Catalog → Rooms
3. Создать помещения с названиями и описаниями
4. Перейти в Catalog → Categories
5. Для каждой категории выбрать подходящие помещения в поле "Rooms"
6. Перейти в Catalog → Products
7. Для каждого товара:
   - Выбрать Room
   - Установить Label (new/hit/sale/exclusive или оставить пустым)

---

## 🧪 БЛОК 11: Тестирование

### Приоритет: 🔴 Критично (перед деплоем)

### Чек-лист тестирования:

#### Backend API:
- [ ] GET `/catalog/rooms/` - список помещений
- [ ] GET `/catalog/rooms/{slug}/` - детали помещения
- [ ] GET `/catalog/rooms/{slug}/categories/` - категории помещения
- [ ] GET `/catalog/categories/?room=slug` - фильтрация категорий
- [ ] GET `/catalog/products/?room=slug` - фильтрация товаров по помещению
- [ ] GET `/catalog/products/?label=new` - фильтрация по лейблу
- [ ] GET `/catalog/products/?ordering=-orders_count` - сортировка по популярности

#### Frontend:
- [ ] Отображение лейблов на карточках товаров (все 4 типа)
- [ ] Фильтрация по помещениям в CategoryFilter
- [ ] Фильтрация по категориям внутри помещения
- [ ] Фильтрация по лейблам в ProductFilters
- [ ] Комбинированная фильтрация (room + category + label)
- [ ] Сортировка по популярности
- [ ] Отображение рейтинга на карточках
- [ ] Поиск через Header работает корректно
- [ ] Breadcrumbs показывают Room → Category
- [ ] Главная страница показывает помещения
- [ ] Клик по помещению на главной ведет в каталог с фильтром

#### Редактирование профиля:
- [ ] Редактирование ФИО и телефона
- [ ] Смена email с подтверждением паролем
- [ ] Смена пароля с валидацией
- [ ] Все формы показывают ошибки корректно

#### Сброс пароля:
- [ ] Модалка сброса пароля выглядит единообразно
- [ ] Страница ввода нового пароля выглядит хорошо
- [ ] Отступы везде правильные
- [ ] Валидация работает

---

## 📋 Порядок реализации (рекомендуемый)

### Этап 1: Быстрые исправления (1-2 часа)
1. ✅ CSS стили для лейблов (БЛОК 3)
2. ✅ Улучшение дизайна сброса пароля (БЛОК 1)

### Этап 2: Редактирование профиля (2-3 часа)
3. ✅ Добавить UI редактирования в ProfilePage (БЛОК 2)

### Этап 3: Backend для популярности (1 час)
4. ✅ Добавить orders_count в Product (БЛОК 9)
5. ✅ Обновить сериализаторы и views

### Этап 4: Компонент рейтинга (1 час)
6. ✅ Создать StarRating компонент (БЛОК 8)
7. ✅ Добавить в ProductCard

### Этап 5: Реструктуризация фильтров (3-4 часа)
8. ✅ Обновить CategoryFilter (БЛОК 4)
9. ✅ Обновить ProductFilters (БЛОК 5)
10. ✅ Обновить CatalogPage (БЛОК 6)

### Этап 6: Главная страница (1 час)
11. ✅ Обновить CategoriesSection (БЛОК 7)

### Этап 7: Тестовые данные (30 минут)
12. ✅ Создать помещения и привязать категории (БЛОК 10)

### Этап 8: Тестирование (2-3 часа)
13. ✅ Полное тестирование всех функций (БЛОК 11)

**Общее время: 11-15 часов**

---

## 🚀 Команды для запуска

### Backend:
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Админка:
```
URL: http://localhost:8000/admin/
```

---

## 📚 Полезные ссылки

- [CATEGORY_RESTRUCTURE_STATUS.md](./CATEGORY_RESTRUCTURE_STATUS.md) - детальный статус реструктуризации
- [API_DOCUMENTATION.md](./frontend/API_DOCUMENTATION.md) - документация API
- [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md) - настройка email

---

## ✅ Критерии завершения

Проект считается завершенным когда:

1. ✅ Все лейблы товаров отображаются корректно
2. ✅ Фильтрация по помещениям и категориям работает
3. ✅ Сортировка по популярности работает
4. ✅ Рейтинг отображается на карточках
5. ✅ Редактирование профиля полностью функционально
6. ✅ Дизайн сброса пароля единообразен
7. ✅ Все тесты из чек-листа пройдены
8. ✅ Нет критических багов
9. ✅ Код чистый и читаемый
10. ✅ Документация обновлена

---

**Удачи в реализации! 🚀**