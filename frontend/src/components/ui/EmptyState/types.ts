import type { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  /**
   * Иконка для отображения
   */
  icon?: LucideIcon;
  
  /**
   * Заголовок пустого состояния
   */
  title: string;
  
  /**
   * Описание пустого состояния
   */
  description?: string;
  
  /**
   * Действие с кнопкой
   */
  action?: {
    label: string;
    onClick: () => void;
  };
  
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}