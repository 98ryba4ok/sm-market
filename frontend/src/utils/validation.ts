import { z } from 'zod';

import { VALIDATION } from './constants';

/**
 * Схемы валидации для форм с использованием Zod
 */

// Общие схемы
const emailSchema = z
  .string()
  .min(1, 'Email обязателен')
  .email('Некорректный email');

const passwordSchema = z
  .string()
  .min(VALIDATION.MIN_PASSWORD_LENGTH, `Минимум ${VALIDATION.MIN_PASSWORD_LENGTH} символов`)
  .max(VALIDATION.MAX_PASSWORD_LENGTH, `Максимум ${VALIDATION.MAX_PASSWORD_LENGTH} символов`);

const phoneSchema = z
  .string()
  .min(1, 'Телефон обязателен')
  .regex(/^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/, 'Некорректный номер телефона');

const nameSchema = z
  .string()
  .min(VALIDATION.MIN_NAME_LENGTH, `Минимум ${VALIDATION.MIN_NAME_LENGTH} символа`)
  .max(VALIDATION.MAX_NAME_LENGTH, `Максимум ${VALIDATION.MAX_NAME_LENGTH} символов`);

// Схема регистрации
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  password_confirm: z.string(),
  first_name: nameSchema,
  last_name: nameSchema,
}).refine((data) => data.password === data.password_confirm, {
  message: 'Пароли не совпадают',
  path: ['password_confirm'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Схема входа
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Пароль обязателен'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Схема оформления заказа
export const checkoutSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  delivery_address: z
    .string()
    .min(5, 'Минимум 5 символов')
    .max(200, 'Максимум 200 символов'),
  delivery_city: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(100, 'Максимум 100 символов'),
  delivery_postal_code: z
    .string()
    .regex(/^\d{6}$/, 'Индекс должен содержать 6 цифр'),
  payment_method: z.enum(['card', 'cash', 'yookassa'], {
    errorMap: () => ({ message: 'Выберите способ оплаты' }),
  }),
  comment: z.string().max(500, 'Максимум 500 символов').optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Схема отзыва
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Выберите оценку')
    .max(5, 'Максимальная оценка 5'),
  comment: z
    .string()
    .min(VALIDATION.MIN_COMMENT_LENGTH, `Минимум ${VALIDATION.MIN_COMMENT_LENGTH} символов`)
    .max(VALIDATION.MAX_COMMENT_LENGTH, `Максимум ${VALIDATION.MAX_COMMENT_LENGTH} символов`),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// Схема профиля пользователя
export const profileSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Схема изменения пароля
export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Введите текущий пароль'),
  new_password: passwordSchema,
  new_password_confirm: z.string(),
}).refine((data) => data.new_password === data.new_password_confirm, {
  message: 'Пароли не совпадают',
  path: ['new_password_confirm'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Схема поиска
export const searchSchema = z.object({
  query: z.string().min(1, 'Введите поисковый запрос').max(100, 'Максимум 100 символов'),
});

export type SearchFormData = z.infer<typeof searchSchema>;

// Схема фильтров продуктов
export const productFiltersSchema = z.object({
  category: z.number().optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  min_rating: z.number().min(1).max(5).optional(),
  in_stock: z.boolean().optional(),
  search: z.string().optional(),
  ordering: z.string().optional(),
}).refine((data) => {
  if (data.min_price !== undefined && data.max_price !== undefined) {
    return data.min_price <= data.max_price;
  }
  return true;
}, {
  message: 'Минимальная цена не может быть больше максимальной',
  path: ['min_price'],
});

export type ProductFiltersData = z.infer<typeof productFiltersSchema>;

// Схема добавления в корзину
export const addToCartSchema = z.object({
  product_id: z.number().positive('Некорректный ID продукта'),
  quantity: z
    .number()
    .min(VALIDATION.MIN_QUANTITY, `Минимум ${VALIDATION.MIN_QUANTITY}`)
    .max(VALIDATION.MAX_QUANTITY, `Максимум ${VALIDATION.MAX_QUANTITY}`),
});

export type AddToCartData = z.infer<typeof addToCartSchema>;

// Схема обновления количества в корзине
export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .min(VALIDATION.MIN_QUANTITY, `Минимум ${VALIDATION.MIN_QUANTITY}`)
    .max(VALIDATION.MAX_QUANTITY, `Максимум ${VALIDATION.MAX_QUANTITY}`),
});

export type UpdateCartItemData = z.infer<typeof updateCartItemSchema>;

/**
 * Вспомогательные функции валидации
 */

// Валидация email
export const isValidEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

// Валидация телефона
export const isValidPhone = (phone: string): boolean => {
  return phoneSchema.safeParse(phone).success;
};

// Валидация пароля
export const isValidPassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

// Получение сообщений об ошибках валидации
export const getValidationErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
};

// Проверка силы пароля
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 2) {
    return { score, label: 'Слабый', color: 'red' };
  } else if (score <= 4) {
    return { score, label: 'Средний', color: 'yellow' };
  } else {
    return { score, label: 'Сильный', color: 'green' };
  }
};