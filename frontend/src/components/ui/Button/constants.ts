import type { ButtonSize, ButtonVariant } from './types';

/**
 * Дефолтные значения для Button
 */
export const BUTTON_DEFAULTS = {
  variant: 'primary' as ButtonVariant,
  size: 'md' as ButtonSize,
  isLoading: false,
  fullWidth: false,
} as const;

/**
 * Размеры иконок для разных размеров кнопки
 */
export const ICON_SIZES: Record<ButtonSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

/**
 * Размеры спиннера загрузки для разных размеров кнопки
 */
export const SPINNER_SIZES: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
} as const;