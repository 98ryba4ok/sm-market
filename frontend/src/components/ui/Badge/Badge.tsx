import type { FC } from 'react';

import { BADGE_DEFAULTS, DOT_SIZES } from './constants';
import { StyledBadge, StyledBadgeDot } from './styles';
import type { BadgeProps } from './types';

/**
 * Компонент бейджа для отображения статусов, меток и категорий
 * 
 * @example
 * ```tsx
 * // Базовое использование
 * <Badge>New</Badge>
 * 
 * // С вариантом
 * <Badge variant="success">Active</Badge>
 * <Badge variant="danger">Error</Badge>
 * 
 * // С размером
 * <Badge size="sm">Small</Badge>
 * <Badge size="lg">Large</Badge>
 * 
 * // С точкой
 * <Badge dot variant="primary">Online</Badge>
 * ```
 */
export const Badge: FC<BadgeProps> = ({
  variant = BADGE_DEFAULTS.variant,
  size = BADGE_DEFAULTS.size,
  dot = BADGE_DEFAULTS.dot,
  children,
  ...props
}) => {
  const dotSize = DOT_SIZES[size];

  return (
    <StyledBadge $variant={variant} $size={size} {...props}>
      {dot && <StyledBadgeDot $variant={variant} $size={dotSize} aria-hidden="true" />}
      {children}
    </StyledBadge>
  );
};