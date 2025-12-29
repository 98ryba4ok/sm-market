/**
 * Форматирование цены в рубли
 */
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return '0 ₽';
  }
  
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

/**
 * Форматирование даты
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
    long: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
    time: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  };
  
  const options = optionsMap[format];
  
  return new Intl.DateTimeFormat('ru-RU', options).format(dateObj);
};

/**
 * Форматирование относительного времени (например, "2 часа назад")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'только что';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${pluralize(diffInMinutes, 'минуту', 'минуты', 'минут')} назад`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${pluralize(diffInHours, 'час', 'часа', 'часов')} назад`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${pluralize(diffInDays, 'день', 'дня', 'дней')} назад`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${pluralize(diffInWeeks, 'неделю', 'недели', 'недель')} назад`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${pluralize(diffInMonths, 'месяц', 'месяца', 'месяцев')} назад`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${pluralize(diffInYears, 'год', 'года', 'лет')} назад`;
};

/**
 * Плюрализация русских слов
 */
export const pluralize = (count: number, one: string, few: string, many: string): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  
  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }
  
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return few;
  }
  
  return many;
};

/**
 * Форматирование количества товаров
 */
export const formatItemsCount = (count: number): string => {
  return `${count} ${pluralize(count, 'товар', 'товара', 'товаров')}`;
};

/**
 * Форматирование рейтинга
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Форматирование номера телефона
 */
export const formatPhone = (phone: string): string => {
  // Удаляем все нецифровые символы
  const cleaned = phone.replace(/\D/g, '');
  
  // Форматируем как +7 (XXX) XXX-XX-XX
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
  }
  
  if (cleaned.length === 10) {
    return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`;
  }
  
  return phone;
};

/**
 * Сокращение текста с многоточием
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Форматирование размера файла
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Форматирование процента скидки
 */
export const formatDiscount = (originalPrice: number, discountPrice: number): string => {
  const discount = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  return `-${discount}%`;
};

/**
 * Получение инициалов из имени
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  
  if (parts.length === 0) {
    return '';
  }
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

/**
 * Форматирование URL изображения
 */
export const formatImageUrl = (url: string | null | undefined): string => {
  if (!url) {
    return '/placeholder-product.png';
  }
  
  // Если URL уже полный, возвращаем как есть
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Добавляем базовый URL медиа-файлов
  const mediaUrl = import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000';
  return `${mediaUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Форматирование slug для URL
 */
export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Форматирование номера заказа
 */
export const formatOrderNumber = (orderNumber: string): string => {
  return `#${orderNumber}`;
};

/**
 * Проверка, является ли цена со скидкой
 */
export const hasDiscount = (price: number, discountPrice: number | null): boolean => {
  return discountPrice !== null && discountPrice < price;
};

/**
 * Получение активной цены (со скидкой или обычной)
 */
export const getActivePrice = (price: number, discountPrice: number | null): number => {
  return hasDiscount(price, discountPrice) ? discountPrice! : price;
};