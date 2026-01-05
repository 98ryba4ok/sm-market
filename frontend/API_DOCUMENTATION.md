# API Documentation - Frontend

## Структура API

Все API методы находятся в `src/api/`:

```
src/api/
├── axios.ts          # Настроенный axios instance с JWT автообновлением
├── authApi.ts        # Авторизация
├── categoriesApi.ts  # Категории товаров
├── productsApi.ts    # Товары
├── reviewsApi.ts     # Отзывы
├── wishlistApi.ts    # Список желаний
├── cartApi.ts        # Корзина
├── ordersApi.ts      # Заказы
└── index.ts          # Экспорт всех API модулей
```

## Типы

Все TypeScript типы находятся в `src/types/`:

```
src/types/
├── api.ts         # Общие типы (PaginatedResponse, ApiError, MessageResponse)
├── auth.ts        # Типы авторизации (User, LoginPayload, TokenResponse, etc.)
├── category.ts    # Типы категорий
├── product.ts     # Типы товаров и отзывов
├── cart.ts        # Типы корзины
├── order.ts       # Типы заказов
├── wishlist.ts    # Типы списка желаний
└── index.ts       # Экспорт всех типов
```

## Использование

### Импорт

```typescript
// Импорт API методов
import { authApi, productsApi, cartApi } from '@/api';

// Импорт типов
import type { User, Product, Cart } from '@/types';
```

### Auth API

```typescript
// Регистрация
const response = await authApi.register({
  email: 'user@example.com',
  phone: '+79991234567',
  password: 'password123'
});

// Вход
const { data } = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
});
// data: { access: string, refresh: string }

// Сохранить токены
localStorage.setItem('access', data.access);
localStorage.setItem('refresh', data.refresh);

// Получить текущего пользователя
const { data: user } = await authApi.me();

// Выход
await authApi.logout({ refresh: localStorage.getItem('refresh')! });
localStorage.removeItem('access');
localStorage.removeItem('refresh');
```

### Categories API

```typescript
// Список категорий
const { data } = await categoriesApi.list();

// Получить категорию
const { data: category } = await categoriesApi.retrieve('electronics');

// Товары категории
const { data: products } = await categoriesApi.products('electronics', {
  min_price: 100,
  max_price: 1000,
  ordering: '-price'
});
```

### Products API

```typescript
// Список товаров с фильтрацией
const { data } = await productsApi.list({
  category: 'electronics',
  min_price: 100,
  max_price: 1000,
  in_stock: true,
  on_sale: true,
  min_rating: 4,
  search: 'laptop',
  ordering: '-created_at',
  page: 1,
  page_size: 20
});

// Получить товар
const { data: product } = await productsApi.retrieve('laptop-hp-pavilion');
// или по ID
const { data: product2 } = await productsApi.retrieve(123);

// Отзывы товара
const { data: reviews } = await productsApi.reviews(123);
```

### Reviews API

```typescript
// Мои отзывы
const { data } = await reviewsApi.list();

// Создать отзыв
const { data: review } = await reviewsApi.create({
  product: 123,
  rating: 5,
  comment: 'Отличный товар!'
});

// Обновить отзыв
await reviewsApi.partialUpdate(456, {
  rating: 4,
  comment: 'Обновленный комментарий'
});

// Удалить отзыв
await reviewsApi.delete(456);
```

### Wishlist API

```typescript
// Получить список желаний
const { data: wishlist } = await wishlistApi.list();

// Добавить товар
await wishlistApi.add({ product_id: 123 });

// Удалить товар
await wishlistApi.remove({ product_id: 123 });

// Очистить список
await wishlistApi.clear();
```

### Cart API

```typescript
// Получить корзину
const { data: cart } = await cartApi.get();

// Добавить товар
const { data: updatedCart } = await cartApi.addItem({
  product_id: 123,
  quantity: 2
});

// Обновить количество
await cartApi.updateItem(456, { quantity: 3 });

// Удалить товар
await cartApi.removeItem(456);

// Очистить корзину
await cartApi.clear();
```

### Orders API

```typescript
// Список заказов
const { data } = await ordersApi.list();

// Создать заказ из корзины
const { data: order } = await ordersApi.create({
  delivery_address: 'ул. Пушкина, д. 10',
  delivery_city: 'Москва',
  delivery_postal_code: '123456',
  phone: '+79991234567',
  email: 'user@example.com',
  payment_method: 'card'
});

// Получить заказ
const { data: orderDetail } = await ordersApi.retrieve(123);

// Отменить заказ
await ordersApi.cancel(123);

// Обновить статус (только админ)
await ordersApi.updateStatus(123, { status: 'shipped' });
```

## Автоматическое обновление JWT токенов

Axios instance автоматически обновляет access токен при получении 401 ошибки:

1. При 401 ошибке axios interceptor перехватывает запрос
2. Отправляет refresh токен на `/auth/refresh/`
3. Получает новый access токен
4. Сохраняет его в localStorage
5. Повторяет оригинальный запрос с новым токеном
6. Обрабатывает очередь ожидающих запросов

Если refresh токен невалиден, пользователь автоматически перенаправляется на `/login`.

## Environment Variables

Создайте `.env` файл в корне frontend:

```env
VITE_API_URL=http://localhost:8000/api
```

## Обработка ошибок

```typescript
try {
  const { data } = await productsApi.list();
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      console.error('Не найдено');
    } else if (error.response?.status === 400) {
      const errors = error.response.data;
      console.error('Ошибка валидации:', errors);
    }
  }
}
```

## Pagination

Все списки возвращают пагинированный ответ:

```typescript
interface PaginatedResponse<T> {
  count: number;           // Общее количество элементов
  next: string | null;     // URL следующей страницы
  previous: string | null; // URL предыдущей страницы
  results: T[];            // Массив результатов
}
```

Пример:

```typescript
const { data } = await productsApi.list({ page: 1, page_size: 20 });
console.log(data.count);    // 150
console.log(data.results);  // [Product, Product, ...]
```
