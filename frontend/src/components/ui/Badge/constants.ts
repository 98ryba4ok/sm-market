import type { BadgeSize, BadgeVariant } from './types';

/**
 * Дефолтные значения для Badge
 */
export const BADGE_DEFAULTS = {
  variant: 'default' as BadgeVariant,
  size: 'md' as BadgeSize,
  dot: false,
} as const;

/**
 * Размер точки для разных размеров бейджа
 */
export const DOT_SIZES: Record<BadgeSize, number> = {
  sm: 6,
  md: 6,
  lg: 8,
} as const;