import type { SpinnerSize } from './types';

/**
 * Дефолтные значения для Spinner
 */
export const SPINNER_DEFAULTS = {
  size: 'md' as SpinnerSize,
} as const;

/**
 * Размеры спиннера в пикселях
 */
export const SPINNER_SIZES: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

/**
 * Дефолтное сообщение для LoadingInline
 */
export const DEFAULT_LOADING_MESSAGE = 'Loading...';