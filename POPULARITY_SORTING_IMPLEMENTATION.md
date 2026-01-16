# Реализация сортировки по популярности

## Обзор

Добавлена полноценная система сортировки товаров по популярности на основе количества заказов.

## Что было сделано

### 1. Автоматическое обновление счетчика заказов

**Файл:** `backend/apps/orders/models.py`

#### При создании заказа (OrderItem.save)
```python
def save(self, *args, **kwargs):
    # Проверяем, это новый элемент заказа или обновление существующего
    is_new = self.pk is None
    
    # Сохранить snapshot данных товара
    if not self.price_at_purchase:
        self.price_at_purchase = self.product.final_price
    if not self.product_name:
        self.product_name = self.product.name
    
    super().save(*args, **kwargs)

    # Увеличить счетчик заказов товара только для новых элементов
    if is_new and self.product:
        self.product.orders_count += self.quantity
        self.product.save(update_fields=['orders_count'])
```

**Логика:**
- ✅ Счетчик увеличивается только для **новых** элементов заказа
- ✅ Учитывается **количество** товара в заказе (quantity)
- ✅ Обновление происходит **автоматически** при создании заказа

#### При отмене заказа (Order.cancel)
```python
def cancel(self):
    """Отменить заказ"""
    if self.can_be_cancelled:
        self.status = 'cancelled'
        # Вернуть товары на склад и уменьшить счетчик заказов
        for item in self.items.all():
            item.product.stock_quantity += item.quantity
            item.product.orders_count = max(0, item.product.orders_count - item.quantity)
            item.product.save(update_fields=['stock_quantity', 'orders_count'])
        self.save(update_fields=['status'])
        return True
    return False
```

**Логика:**
- ✅ При отмене заказа счетчик **уменьшается**
- ✅ Используется `max(0, ...)` для предотвращения отрицательных значений
- ✅ Товары возвращаются на склад одновременно с обновлением счетчика

### 2. Оптимизация базы данных

**Файл:** `backend/apps/catalog/models.py`

Добавлен индекс для поля `orders_count`:

```python
class Meta:
    verbose_name = "Товар"
    verbose_name_plural = "Товары"
    ordering = ['-created_at']
    indexes = [
        models.Index(fields=['slug']),
        models.Index(fields=['category', 'is_active']),
        models.Index(fields=['brand', 'is_active']),
        models.Index(fields=['price']),
        models.Index(fields=['-created_at']),
        models.Index(fields=['-orders_count']),  # Индекс для сортировки по популярности
    ]
```

**Преимущества:**
- ⚡ Быстрая сортировка по популярности
- ⚡ Оптимизированные запросы к базе данных
- ⚡ Снижение нагрузки на сервер при большом количестве товаров

### 3. Миграция базы данных

**Файл:** `backend/apps/catalog/migrations/0010_add_orders_count_index.py`

Создана и применена миграция для добавления индекса:

```bash
docker-compose exec backend python manage.py makemigrations catalog --name add_orders_count_index
docker-compose exec backend python manage.py migrate catalog
```

## Как работает сортировка

### Backend (уже реализовано)

**Файл:** `backend/apps/catalog/views.py`

```python
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    ordering_fields = ['price', 'created_at', 'views_count', 'orders_count', 'name']
    ordering = ['-created_at']
```

### Frontend (уже реализовано)

**Файл:** `frontend/src/pages/CatalogPage/CatalogPage.tsx`

```typescript
<button
  className={`catalog-page__sort-button ${
    ordering === "-orders_count"
      ? "catalog-page__sort-button--active"
      : ""
  }`}
  onClick={() => setOrdering("-orders_count")}
>
  По популярности
</button>
```

## Метрика популярности

**Поле:** `Product.orders_count` (PositiveIntegerField)

**Значение:** Общее количество единиц товара, заказанных пользователями

**Примеры:**
- Товар заказан 1 раз по 2 шт → `orders_count = 2`
- Товар заказан 3 раза по 1 шт → `orders_count = 3`
- Товар заказан 2 раза (3 шт + 5 шт) → `orders_count = 8`

## Преимущества реализации

✅ **Автоматическое обновление** - не требует ручного вмешательства
✅ **Точность** - учитывает количество товара в каждом заказе
✅ **Обратимость** - корректно обрабатывает отмену заказов
✅ **Производительность** - оптимизировано с помощью индекса
✅ **Надежность** - защита от отрицательных значений

## Тестирование

### Проверка работы счетчика

1. Создайте заказ с товаром:
```python
from apps.catalog.models import Product
from apps.orders.models import Order, OrderItem

product = Product.objects.first()
print(f"До заказа: orders_count = {product.orders_count}")

# Создать заказ через API или админку
# ...

product.refresh_from_db()
print(f"После заказа: orders_count = {product.orders_count}")
```

2. Отмените заказ:
```python
order = Order.objects.last()
order.cancel()

product.refresh_from_db()
print(f"После отмены: orders_count = {product.orders_count}")
```

### Проверка сортировки

1. Откройте каталог: `http://localhost:3000/catalog`
2. Нажмите кнопку "По популярности"
3. Товары должны отсортироваться по убыванию `orders_count`

## Дальнейшие улучшения (опционально)

### 1. Добавить вес для недавних заказов
```python
# Учитывать время заказа для более актуальной популярности
