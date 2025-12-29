import type { HTMLAttributes } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Визуальный вариант бейджа
   * @default 'default'
   */
  variant?: BadgeVariant;
  
  /**
   * Размер бейджа
   * @default 'md'
   */
  size?: BadgeSize;
  
  /**
   * Показать точку перед текстом
   * @default false
   */
  dot?: boolean;
}