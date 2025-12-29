import type { HTMLAttributes } from 'react';

export type CardVariant = 'default' | 'bordered' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Визуальный вариант карточки
   * @default 'default'
   */
  variant?: CardVariant;
  
  /**
   * Внутренние отступы карточки
   * @default 'md'
   */
  padding?: CardPadding;
  
  /**
   * Добавить эффект при наведении
   * @default false
   */
  hoverable?: boolean;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}