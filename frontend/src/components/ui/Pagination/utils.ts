import type { PaginationItem } from './types';

/**
 * Генерирует массив чисел от start до end включительно
 */
export const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

/**
 * Вычисляет диапазон страниц для отображения в пагинации
 */
export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): PaginationItem[] => {
  const totalPageNumbers = siblingCount + 5; // siblings + first + last + current + 2 dots

  // Если страниц меньше, чем нужно показать - показываем все
  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  // Нет левых точек, но есть правые
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, 'dots', totalPages];
  }

  // Нет правых точек, но есть левые
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [firstPageIndex, 'dots', ...rightRange];
  }

  // Есть и левые, и правые точки
  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, 'dots', ...middleRange, 'dots', lastPageIndex];
  }

  return [];
};