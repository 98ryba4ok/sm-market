export interface BreadcrumbItem {
  /**
   * Текст элемента
   */
  label: string;
  
  /**
   * Ссылка (опционально для последнего элемента)
   */
  href?: string;
}

export interface BreadcrumbsProps {
  /**
   * Элементы хлебных крошек
   */
  items: BreadcrumbItem[];
  
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}