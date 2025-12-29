import type { RatingSize } from './types';

/**
 * Дефолтные значения для Rating
 */
export const RATING_DEFAULTS = {
  max: 5,
  size: 'md' as RatingSize,
  showValue: false,
  readonly: true,
} as const;

/**
 * Размеры звезд в пикселях
 */
export const STAR_SIZES: Record<RatingSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

/**
 * Размер компактной звезды
 */
export const COMPACT_STAR_SIZE = 16;