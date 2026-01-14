# 🚀 Быстрый старт - Доработка SM-Market

## 📋 Что нужно сделать (краткая версия)

### 1️⃣ Быстрые исправления (30 минут)

#### A. CSS для лейблов товаров
**Файл:** `frontend/src/components/ui/ProductCard/ProductCard.css`

Добавить в конец файла:
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.product-card__badge--new { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; }
.product-card__badge--hit { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; }
.product-card__badge--sale { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; }
.product-card__badge--exclusive { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; }
```

#### B. Исправить дизайн сброса пароля
1. Переделать `PasswordResetModal.tsx` - использовать компонент Modal
2. Переделать `PasswordResetPage.tsx` - использовать Input и Button компоненты

---

### 2️⃣ Редактирование профиля (2 часа)

**Файл:** `frontend/src/pages/ProfilePage/ProfilePage.tsx`

Добавить 3 новые секции после строки 233:
1. Редактирование ФИО и телефона
2. Смена email
3. Смена пароля

Добавить импорты:
```tsx
import { Lock } from "lucide-react";
import { Input } from "../../components/ui/Input/Input";
```

Добавить CSS стили в `ProfilePage.css`

---

### 3️⃣ Backend - популярность товаров (30 минут)

**Файл:** `backend/apps/catalog/models.py`

Добавить в модель Product:
```python
orders_count = models.IntegerField(default=0, verbose_name="Количество заказов")
```

Создать миграцию:
```bash
python manage.py makemigrations
python manage.py migrate
```

Обновить сериализатор и добавить в ordering_fields

---

### 4️⃣ Компонент рейтинга (1 час)

Создать новый компонент `StarRating`:
- `frontend/src/components/ui/StarRating/StarRating.tsx`
- `frontend/src/components/ui/StarRating/StarRating.css`

Добавить в ProductCard

---

### 5️⃣ Реструктуризация фильтров (3 часа)

1. **CategoryFilter** - полная переработка для Room → Category
2. **ProductFilters** - добавить фильтр по лейблам
3. **CatalogPage** - обновить логику с новыми фильтрами
4. **CategoriesSection** - показывать помещения вместо категорий

---

### 6️⃣ Тестовые данные (30 минут)

Через админку создать:
1. Помещения (Ванная, Кухня, Туалет, Прихожая)
2. Привязать категории к помещениям
3. Установить лейблы товарам
4. Привязать товары к помещениям

---

## 🎯 Порядок выполнения

```
1. CSS лейблов (5 мин) ✅
2. Дизайн сброса пароля (25 мин) ✅
3. Редактирование профиля (2 часа) ✅
4. Backend популярности (30 мин) ✅
5. Компонент рейтинга (1 час) ✅
6. Реструктуризация фильтров (3 часа) ✅
7. Тестовые данные (30 мин) ✅
8. Тестирование (2 часа) ✅
```

**Итого: ~10 часов**

---

## 📁 Основные файлы для изменения

### Frontend (приоритет):
1. ✅ `ProductCard.css` - стили лейблов
2. ✅ `PasswordResetModal.tsx` + `.css` - дизайн
3. ✅ `PasswordResetPage.tsx` + `.css` - дизайн
4. ✅ `ProfilePage.tsx` + `.css` - редактирование
5. ⏳ `StarRating.tsx` + `.css` - новый компонент
6. ⏳ `CategoryFilter.tsx` + `.css` - переработка
7. ⏳ `ProductFilters.tsx` - добавить фильтры
8. ⏳ `CatalogPage.tsx` - новая логика
9. ⏳ `CategoriesSection.tsx` - показывать rooms

### Backend (приоритет):
1. ⏳ `models.py` - добавить orders_count
2. ⏳ `serializers.py` - обновить
3. ⏳ `views.py` - обновить ordering

---

## 🔥 Самое важное

### Критичные задачи (без них не работает):
1. ✅ CSS стили для лейблов
2. ⏳ CategoryFilter переработка
3. ⏳ CatalogPage обновление

### Важные задачи (улучшают UX):
4. ✅ Дизайн сброса пароля
5. ✅ Редактирование профиля
6. ⏳ Рейтинг на карточках
7. ⏳ Сортировка по популярности

### Желательные задачи:
8. ⏳ Главная страница с rooms
9. ⏳ Тестовые данные

---

## 💡 Полезные команды

```bash
# Backend
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm run dev

# Админка
http://localhost:8000/admin/
```

---

## 📖 Детальная документация

Полный план с примерами кода: **[FINAL_IMPLEMENTATION_PLAN.md](./FINAL_IMPLEMENTATION_PLAN.md)**

Статус реструктуризации: **[CATEGORY_RESTRUCTURE_STATUS.md](./CATEGORY_RESTRUCTURE_STATUS.md)**

---

**Готово к реализации! Начинай с пункта 1 и двигайся по порядку 🚀**