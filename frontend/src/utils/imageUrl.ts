/**
 * Преобразует URL изображения в полный URL
 * Если URL уже абсолютный (http/https), возвращает его как есть
 * Если URL относительный, добавляет базовый URL
 */
export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return "";
  }

  // Если URL уже абсолютный (начинается с http:// или https://)
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // URL уже приходит с правильным URL-encoding от Django
  // Vite проксирует /media на backend:8000
  return imageUrl;
};
