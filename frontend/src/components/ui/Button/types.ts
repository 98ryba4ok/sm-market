import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Визуальный вариант кнопки
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Размер кнопки
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Состояние загрузки
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Иконка слева от текста
   */
  leftIcon?: ReactNode;
  
  /**
   * Иконка справа от текста
   */
  rightIcon?: ReactNode;
  
  /**
   * Растянуть кнопку на всю ширину
   * @default false
   */
  fullWidth?: boolean;
}