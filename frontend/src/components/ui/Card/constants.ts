import type { CardPadding, CardVariant } from './types';

/**
 * Дефолтные значения для Card
 */
export const CARD_DEFAULTS = {
  variant: 'default' as CardVariant,
  padding: 'md' as CardPadding,
  hoverable: false,
} as const;