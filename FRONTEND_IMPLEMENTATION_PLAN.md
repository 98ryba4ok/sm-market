# Frontend Implementation Plan - E-commerce Platform

## Обзор
Этот документ содержит детальный план реализации frontend части интернет-магазина на React + TypeScript с использованием современного стека технологий.

## Технологический стек

### Core
- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер

### Routing & State
- **React Router DOM v7** - маршрутизация
- **Zustand** - глобальное состояние (cart, auth, wishlist)
- **TanStack Query (React Query)** - серверное состояние и кэширование

### UI & Styling
- **Tailwind CSS** - utility-first CSS фреймворк
- **Lucide React** - иконки
- **React Hot Toast** - уведомления

### Forms & Validation
- **React Hook Form** - управление формами
- **Zod** - валидация схем

### HTTP Client
- **Axios** - HTTP запросы с интерцепторами

## Архитектура проекта

```
frontend/src/
├── api/                    # API клиенты и запросы
│   ├── axios.ts           # Конфигурация axios с интерцепторами
│   ├── products.ts        # API для продуктов
│   ├── categories.ts      # API для категорий
│   ├── cart.ts            # API для корзины
│   ├── orders.ts          # API для заказов
│   ├── reviews.ts         # API для отзывов
│   ├── wishlist.ts        # API для избранного
│   ├── auth.ts            # API для аутентификации
│   └── payment.ts         # API для платежей
│
├── components/            # Переиспользуемые компоненты
│   ├── ui/               # Базовые UI компоненты
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Rating.tsx
│   │   ├── Spinner.tsx
│   │   ├── Pagination.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── layout/           # Компоненты макета
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MainLayout.tsx
│   │   └── Breadcrumbs.tsx
│   │
│   └── shared/           # Общие компоненты
│       ├── ErrorBoundary.tsx
│       ├── ProtectedRoute.tsx
│       └── ScrollToTop.tsx
│
├── features/             # Функциональные модули
│   ├── auth/            # Аутентификация
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthModal.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── store/
│   │       └── authStore.ts
│   │
│   ├── products/        # Продукты
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductSort.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── CategoryList.tsx
│   │   │   ├── ProductImageGallery.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   └── AddToCartButton.tsx
│   │   └── hooks/
│   │       ├── useProducts.ts
│   │       └── useProductDetail.ts
│   │
│   ├── cart/            # Корзина
│   │   ├── components/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CartDrawer.tsx
│   │   ├── hooks/
│   │   │   └── useCart.ts
│   │   └── store/
│   │       └── cartStore.ts
│   │
│   ├── orders/          # Заказы
│   │   ├── components/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   ├── PaymentMethodSelector.tsx
│   │   │   ├── OrderCard.tsx
│   │   │   └── OrderDetail.tsx
│   │   └── hooks/
│   │       ├── useCheckout.ts
│   │       └── useOrders.ts
│   │
│   ├── reviews/         # Отзывы
│   │   ├── components/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewsList.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   └── ProductReviews.tsx
│   │   └── hooks/
│   │       └── useReviews.ts
│   │
│   └── wishlist/        # Избранное
│       ├── components/
│       │   └── WishlistButton.tsx
│       ├── hooks/
│       │   └── useWishlist.ts
│       └── store/
│           └── wishlistStore.ts
│
├── pages/               # Страницы приложения
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrdersPage.tsx
│   ├── OrderDetailPage.tsx
│   ├── WishlistPage.tsx
│   └── NotFoundPage.tsx
│
├── hooks/               # Глобальные хуки
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   └── useScrollToTop.ts
│
├── store/               # Глобальные сторы
│   └── index.ts        # Экспорт всех сторов
│
├── types/               # TypeScript типы
│   ├── product.ts
│   ├── cart.ts
│   ├── order.ts
│   ├── user.ts
│   ├── review.ts
│   └── api.ts
│
├── utils/               # Утилиты
│   ├── format.ts       # Форматирование (цены, даты)
│   ├── validation.ts   # Zod схемы валидации
│   ├── constants.ts    # Константы
│   └── queryKeys.ts    # React Query ключи
│
├── App.tsx             # Главный компонент
├── main.tsx            # Точка входа
└── index.css           # Глобальные стили
```

## Фазы реализации

### Фаза 1: Базовая настройка (Completed ✅)
- [x] Установка зависимостей
- [x] Настройка Tailwind CSS
- [x] Настройка PostCSS
- [x] Обновление index.css

### Фаза 2: TypeScript типы и API клиент
**Приоритет: Высокий**

#### 2.1 Создание типов
```typescript
// types/api.ts
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  [key: string]: any;
}

// types/product.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  parent: number | null;
  subcategories?: Category[];
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_main: boolean;
  order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_price: string | null;
  final_price: string;
  discount_percentage: number;
  category: Category;
  stock_quantity: number;
  in_stock: boolean;
  is_active: boolean;
  views_count: number;
  average_rating: number;
  reviews_count: number;
  main_image: string | null;
  created_at: string;
}

export interface ProductDetail extends Product {
  images: ProductImage[];
}

// types/cart.ts
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: string;
  added_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  total_price: string;
}

// types/order.ts
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price_at_purchase: string;
  subtotal: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: string;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string;
  phone: string;
  email: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// types/user.ts
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}
```

#### 2.2 Настройка Axios
```typescript
// api/axios.ts
import axios from 'axios';
import { authStore } from '@/store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor для добавления токена
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor для обработки ошибок и refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = authStore.getState().refreshToken;
        const response = await axios.post(`${API_URL}/users/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        authStore.getState().setTokens(access, refreshToken);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        authStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### Фаза 3: Базовые UI компоненты
**Приоритет: Высокий**

Создать переиспользуемые UI компоненты:
- Button (с вариантами: primary, secondary, outline, ghost)
- Input (с валидацией и ошибками)
- Card
- Modal
- Badge
- Rating (звезды)
- Spinner
- Pagination
- EmptyState

### Фаза 4: Layout компоненты
**Приоритет: Высокий**

- Header (навигация, поиск, корзина, пользователь)
- Footer
- MainLayout (обертка для страниц)
- Breadcrumbs
- Sidebar (фильтры)

### Фаза 5: Аутентификация
**Приоритет: Высокий**

#### 5.1 Auth Store (Zustand)
```typescript
// store/authStore.ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  setTokens: (access: string, refresh: string) => void;
}
```

#### 5.2 Компоненты
- LoginForm
- RegisterForm
- AuthModal
- ProtectedRoute

#### 5.3 API
```typescript
// api/auth.ts
export const authApi = {
  login: (credentials: LoginCredentials) => 
    axiosInstance.post('/users/login/', credentials),
  
  register: (data: RegisterData) => 
    axiosInstance.post('/users/register/', data),
  
  refreshToken: (refresh: string) => 
    axiosInstance.post('/users/token/refresh/', { refresh }),
  
  getProfile: () => 
    axiosInstance.get('/users/profile/'),
};
```

### Фаза 6: Продукты и каталог
**Приоритет: Высокий**

#### 6.1 API
```typescript
// api/products.ts
export const productsApi = {
  getProducts: (params?: ProductsParams) => 
    axiosInstance.get<PaginatedResponse<Product>>('/catalog/products/', { params }),
  
  getProduct: (id: number) => 
    axiosInstance.get<ProductDetail>(`/catalog/products/${id}/`),
  
  searchProducts: (query: string) => 
    axiosInstance.get<PaginatedResponse<Product>>('/catalog/products/', {
      params: { search: query }
    }),
};

// api/categories.ts
export const categoriesApi = {
  getCategories: () => 
    axiosInstance.get<Category[]>('/catalog/categories/'),
  
  getCategory: (id: number) => 
    axiosInstance.get<Category>(`/catalog/categories/${id}/`),
};
```

#### 6.2 Компоненты
- ProductCard (карточка товара)
- ProductGrid (сетка товаров)
- ProductFilters (фильтры)
- ProductSort (сортировка)
- SearchBar (поиск)
- CategoryList (список категорий)
- ProductImageGallery (галерея изображений)
- ProductInfo (информация о товаре)

#### 6.3 Hooks
```typescript
// hooks/useProducts.ts
export const useProducts = (params?: ProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
  });
};

// hooks/useProductDetail.ts
export const useProductDetail = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
  });
};
```

#### 6.4 Страницы
- ProductsPage (список товаров с фильтрами)
- ProductDetailPage (детальная страница товара)

### Фаза 7: Корзина
**Приоритет: Высокий**

#### 7.1 Cart Store (Zustand)
```typescript
// store/cartStore.ts
interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}
```

#### 7.2 API
```typescript
// api/cart.ts
export const cartApi = {
  getCart: () => 
    axiosInstance.get<Cart>('/orders/cart/'),
  
  addItem: (productId: number, quantity: number) => 
    axiosInstance.post('/orders/cart/add_item/', { product_id: productId, quantity }),
  
  updateItem: (itemId: number, quantity: number) => 
    axiosInstance.patch(`/orders/cart/update_item/${itemId}/`, { quantity }),
  
  removeItem: (itemId: number) => 
    axiosInstance.delete(`/orders/cart/remove_item/${itemId}/`),
  
  clearCart: () => 
    axiosInstance.post('/orders/cart/clear/'),
};
```

#### 7.3 Компоненты
- CartItem (элемент корзины)
- CartSummary (итоги корзины)
- CartDrawer (выдвижная корзина)
- AddToCartButton (кнопка добавления в корзину)

#### 7.4 Страница
- CartPage (страница корзины)

### Фаза 8: Оформление заказа
**Приоритет: Высокий**

#### 8.1 Валидация форм (Zod)
```typescript
// utils/validation.ts
export const checkoutSchema = z.object({
  delivery_address: z.string().min(5, 'Адрес должен содержать минимум 5 символов'),
  delivery_city: z.string().min(2, 'Укажите город'),
  delivery_postal_code: z.string().regex(/^\d{6}$/, 'Индекс должен содержать 6 цифр'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Неверный формат телефона'),
  email: z.string().email('Неверный email'),
  payment_method: z.enum(['card', 'cash']),
});
```

#### 8.2 API
```typescript
// api/orders.ts
export const ordersApi = {
  createOrder: (data: CreateOrderData) => 
    axiosInstance.post<Order>('/orders/orders/', data),
  
  getOrders: () => 
    axiosInstance.get<PaginatedResponse<Order>>('/orders/orders/'),
  
  getOrder: (id: number) => 
    axiosInstance.get<Order>(`/orders/orders/${id}/`),
  
  cancelOrder: (id: number) => 
    axiosInstance.post(`/orders/orders/${id}/cancel/`),
};
```

#### 8.3 Компоненты
- CheckoutForm (форма оформления)
- OrderSummary (итоги заказа)
- PaymentMethodSelector (выбор способа оплаты)
- OrderCard (карточка заказа)
- OrderDetail (детали заказа)

#### 8.4 Страницы
- CheckoutPage (оформление заказа)
- OrdersPage (история заказов)
- OrderDetailPage (детали заказа)

### Фаза 9: Отзывы
**Приоритет: Средний**

#### 9.1 API
```typescript
// api/reviews.ts
export const reviewsApi = {
  getReviews: (productId: number) => 
    axiosInstance.get<PaginatedResponse<Review>>(`/catalog/products/${productId}/reviews/`),
  
  createReview: (productId: number, data: CreateReviewData) => 
    axiosInstance.post(`/catalog/products/${productId}/reviews/`, data),
};
```

#### 9.2 Компоненты
- ReviewCard (карточка отзыва)
- ReviewsList (список отзывов)
- ReviewForm (форма отзыва)
- ProductReviews (отзывы на странице товара)

### Фаза 10: Избранное (Wishlist)
**Приоритет: Средний**

#### 10.1 Wishlist Store
```typescript
// store/wishlistStore.ts
interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}
```

#### 10.2 API
```typescript
// api/wishlist.ts
export const wishlistApi = {
  getWishlist: () => 
    axiosInstance.get<Wishlist>('/catalog/wishlist/'),
  
  addToWishlist: (productId: number) => 
    axiosInstance.post('/catalog/wishlist/add/', { product_id: productId }),
  
  removeFromWishlist: (productId: number) => 
    axiosInstance.delete(`/catalog/wishlist/remove/${productId}/`),
};
```

#### 10.3 Компоненты
- WishlistButton (кнопка добавления в избранное)

#### 10.4 Страница
- WishlistPage (страница избранного)

### Фаза 11: Главная страница
**Приоритет: Средний**

#### 11.1 Компоненты
- FeaturedProducts (рекомендуемые товары)
- CategoryShowcase (витрина категорий)
- Hero (главный баннер)

#### 11.2 Страница
- HomePage (главная страница)

### Фаза 12: React Query настройка
**Приоритет: Высокий**

```typescript
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      cacheTime: 10 * 60 * 1000, // 10 минут
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// utils/queryKeys.ts
export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (params?: ProductsParams) => [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
  },
  cart: ['cart'] as const,
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.orders.details(), id] as const,
  },
  wishlist: ['wishlist'] as const,
};
```

### Фаза 13: Роутинг
**Приоритет: Высокий**

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Фаза 14: Оптимизация и UX
**Приоритет: Средний**

- Skeleton loaders для загрузки
- Оптимистичные обновления для корзины
- Debounce для поиска
- Lazy loading изображений
- Infinite scroll или пагинация
- Toast уведомления
- Error boundaries
- Loading states

### Фаза 15: Адаптивность
**Приоритет: Высокий**

- Mobile-first подход
- Адаптивная навигация
- Адаптивная сетка товаров
- Touch-friendly элементы
- Тестирование на разных экранах

### Фаза 16: Доступность (A11y)
**Приоритет: Средний**

- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support
- Alt texts для изображений

### Фаза 17: Тестирование
**Приоритет: Средний**

- Тестирование всех флоу
- Тестирование на разных устройствах
- Тестирование производительности
- E2E тесты (опционально)

## Порядок реализации (Рекомендуемый)

1. **Фаза 2**: TypeScript типы и API клиент ✅
2. **Фаза 3**: Базовые UI компоненты ✅
3. **Фаза 4**: Layout компоненты ✅
4. **Фаза 12**: React Query настройка ✅
5. **Фаза 13**: Роутинг ✅
6. **Фаза 5**: Аутентификация ✅
7. **Фаза 6**: Продукты и каталог ✅
8. **Фаза 7**: Корзина ✅
9. **Фаза 8**: Оформление заказа ✅
10. **Фаза 11**: Главная страница ✅
11. **Фаза 9**: Отзывы ✅
12. **Фаза 10**: Избранное ✅
13. **Фаза 14**: Оптимизация и UX ✅
14. **Фаза 15**: Адаптивность ✅
15. **Фаза 16**: Доступность ✅
16. **Фаза 17**: Тестирование ✅

## Environment Variables

Создать файл `.env` в корне frontend:

```env
VITE_API_URL=http://localhost:8000/api
VITE_MEDIA_URL=http://localhost:8000/media
```

## Команды для разработки

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Preview production build
npm run preview

# Линтинг
npm run lint
```

## Следующие шаги

1. Установить зависимости: `cd frontend && npm install`
2. Создать структуру папок
3. Начать с Фазы 2: создание TypeScript типов
4. Последовательно реализовать каждую фазу

## Примечания

- Все компоненты должны быть типизированы
- Использовать React Query для всех API запросов
- Использовать Zustand только для клиентского состояния (cart, auth, wishlist)
- Следовать принципам DRY и SOLID
- Писать чистый, читаемый код с комментариями
- Использовать семантические HTML теги
- Оптимизировать производительность (memo, useMemo, useCallback где нужно)