// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  LOGOUT: '/auth/logout/',
  TOKEN_REFRESH: '/auth/refresh/',  // Fixed: was /auth/token/refresh/
  USER_PROFILE: '/auth/me/',         // Fixed: was /auth/profile/
  
  // Products
  PRODUCTS: '/catalog/products/',
  PRODUCT_DETAIL: (id: number) => `/catalog/products/${id}/`,
  PRODUCT_REVIEWS: (id: number) => `/catalog/products/${id}/reviews/`,
  
  // Categories
  CATEGORIES: '/catalog/categories/',
  CATEGORY_DETAIL: (id: number) => `/catalog/categories/${id}/`,
  CATEGORY_PRODUCTS: (id: number) => `/catalog/categories/${id}/products/`,
  
  // Cart - Fixed: all cart endpoints now use correct paths
  CART: '/cart/',                                      // GET /api/cart/
  CART_ADD: '/cart/add_item/',                        // POST /api/cart/add_item/
  CART_UPDATE: (itemId: number) => `/cart/items/${itemId}/`,  // PATCH /api/cart/items/{id}/
  CART_REMOVE: (itemId: number) => `/cart/items/${itemId}/`,  // DELETE /api/cart/items/{id}/
  CART_CLEAR: '/cart/clear/',                         // POST /api/cart/clear/
  
  // Orders
  ORDERS: '/orders/',
  ORDER_DETAIL: (id: number) => `/orders/${id}/`,
  ORDER_CANCEL: (id: number) => `/orders/${id}/cancel/`,
  
  // Reviews
  REVIEWS: '/catalog/reviews/',
  REVIEW_DETAIL: (id: number) => `/catalog/reviews/${id}/`,
  
  // Wishlist
  WISHLIST: '/catalog/wishlist/',
  WISHLIST_ADD: '/catalog/wishlist/add/',
  WISHLIST_REMOVE: (productId: number) => `/catalog/wishlist/remove/${productId}/`,
  
  // Payment
  PAYMENT_CREATE: '/payment/create/',
  PAYMENT_STATUS: '/payment/status/',
  PAYMENT_CONFIRM: '/payment/confirm/',
} as const;

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает обработки',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменен',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает оплаты',
  paid: 'Оплачен',
  failed: 'Ошибка оплаты',
  refunded: 'Возвращен',
};

// Payment methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  CASH: 'cash',
  YOOKASSA: 'yookassa',
} as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Банковская карта',
  cash: 'Наличные при получении',
  yookassa: 'ЮKassa',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48];

// Price range
export const PRICE_RANGE = {
  MIN: 0,
  MAX: 100000,
  STEP: 100,
};

// Rating
export const RATING_OPTIONS = [1, 2, 3, 4, 5];

// Sort options
export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Новинки' },
  { value: '-created_at', label: 'Сначала старые' },
  { value: 'price', label: 'Цена: по возрастанию' },
  { value: '-price', label: 'Цена: по убыванию' },
  { value: 'name', label: 'Название: А-Я' },
  { value: '-name', label: 'Название: Я-А' },
  { value: '-views_count', label: 'Популярные' },
] as const;

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  CART_ID: 'cart_id',
  WISHLIST: 'wishlist',
  RECENT_SEARCHES: 'recent_searches',
} as const;

// App config
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'SM Market';
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || 'Интернет-магазин';

// Image placeholders
export const PLACEHOLDER_IMAGE = '/placeholder-product.png';
export const PLACEHOLDER_AVATAR = '/placeholder-avatar.png';

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_COMMENT_LENGTH: 10,
  MAX_COMMENT_LENGTH: 1000,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 99,
} as const;

// Debounce delays
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  FILTER: 500,
} as const;

// Toast duration
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 3000,
} as const;