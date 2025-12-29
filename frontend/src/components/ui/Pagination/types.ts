/**
 * Элемент пагинации (номер страницы или многоточие)
 */
export type PaginationItem = number | 'dots';

/**
 * Пропсы для Pagination компонента
 */
export interface PaginationProps {
  /** Текущая страница (начинается с 1) */
  currentPage: number;
  
  /** Общее количество страниц */
  totalPages: number;
  
  /** Callback при изменении страницы */
  onPageChange: (page: number) => void;
  
  /** Количество соседних страниц вокруг текущей */
  siblingCount?: number;
  
  /** Показывать ли кнопки первой/последней страницы */
  showFirstLast?: boolean;
  
  /** Дополнительный CSS класс */
  className?: string;
}

/**
 * Пропсы для SimplePagination (кнопка "Загрузить еще")
 */
export interface SimplePaginationProps {
  /** Есть ли еще данные для загрузки */
  hasMore: boolean;
  
  /** Callback при клике на "Загрузить еще" */
  onLoadMore: () => void;
  
  /** Состояние загрузки */
  isLoading?: boolean;
}

/**
 * Пропсы для PageButton
 */
export interface PageButtonProps {
  /** Номер страницы */
  pageNumber: number;
  
  /** Активна ли страница */
  isActive: boolean;
  
  /** Callback при клике */
  onClick: (page: number) => void;
}