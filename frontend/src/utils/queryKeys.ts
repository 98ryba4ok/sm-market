/**
 * React Query keys factory
 * Централизованное управление ключами для кеширования запросов
 */

export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
    reviews: (id: number) => [...queryKeys.products.detail(id), 'reviews'] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: () => [...queryKeys.categories.lists()] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.categories.details(), id] as const,
    products: (id: number) => [...queryKeys.categories.detail(id), 'products'] as const,
  },

  // Cart
  cart: {
    all: ['cart'] as const,
    current: () => [...queryKeys.cart.all, 'current'] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.orders.details(), id] as const,
  },

  // Reviews
  reviews: {
    all: ['reviews'] as const,
    lists: () => [...queryKeys.reviews.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.reviews.lists(), filters] as const,
    details: () => [...queryKeys.reviews.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.reviews.details(), id] as const,
  },

  // Wishlist
  wishlist: {
    all: ['wishlist'] as const,
    current: () => [...queryKeys.wishlist.all, 'current'] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
} as const;

/**
 * Вспомогательные функции для инвалидации кеша
 */
export const invalidationHelpers = {
  // Инвалидировать все запросы продуктов
  invalidateProducts: () => queryKeys.products.all,
  
  // Инвалидировать конкретный продукт
  invalidateProduct: (id: number) => queryKeys.products.detail(id),
  
  // Инвалидировать корзину
  invalidateCart: () => queryKeys.cart.all,
  
  // Инвалидировать заказы
  invalidateOrders: () => queryKeys.orders.all,
  
  // Инвалидировать wishlist
  invalidateWishlist: () => queryKeys.wishlist.all,
  
  // Инвалидировать отзывы продукта
  invalidateProductReviews: (productId: number) => queryKeys.products.reviews(productId),
} as const;