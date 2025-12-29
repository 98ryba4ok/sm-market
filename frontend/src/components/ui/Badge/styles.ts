import styled, { css } from 'styled-components';

import { tokens } from '../../../theme';

import type { BadgeSize, BadgeVariant } from './types';

/**
 * Стили для разных вариантов бейджа
 */
const variantStyles = {
  default: css`
    background-color: ${tokens.colors.gray[100]};
    color: ${tokens.colors.gray[800]};
  `,

  primary: css`
    background-color: ${tokens.colors.primary[100]};
    color: ${tokens.colors.primary[800]};
  `,

  success: css`
    background-color: ${tokens.colors.success[100]};
    color: ${tokens.colors.success[700]};
  `,

  warning: css`
    background-color: ${tokens.colors.warning[100]};
    color: ${tokens.colors.warning[700]};
  `,

  danger: css`
    background-color: ${tokens.colors.danger[100]};
    color: ${tokens.colors.danger[800]};
  `,

  info: css`
    background-color: ${tokens.colors.info[100]};
    color: ${tokens.colors.info[700]};
  `,
};

/**
 * Стили для разных размеров бейджа
 */
const sizeStyles = {
  sm: css`
    padding: ${tokens.spacing[0.5]} ${tokens.spacing[2]};
    font-size: ${tokens.typography.fontSize.xs};
    line-height: ${tokens.typography.lineHeight.tight};
    gap: ${tokens.spacing[1]};
  `,

  md: css`
    padding: ${tokens.spacing[0.5]} ${tokens.spacing[2.5]};
    font-size: ${tokens.typography.fontSize.sm};
    line-height: ${tokens.typography.lineHeight.tight};
    gap: ${tokens.spacing[1.5]};
  `,

  lg: css`
    padding: ${tokens.spacing[1]} ${tokens.spacing[3]};
    font-size: ${tokens.typography.fontSize.base};
    line-height: ${tokens.typography.lineHeight.tight};
    gap: ${tokens.spacing[1.5]};
  `,
};

interface StyledBadgeProps {
  $variant: BadgeVariant;
  $size: BadgeSize;
}

/**
 * Основной styled-компонент бейджа
 */
export const StyledBadge = styled.span<StyledBadgeProps>`
  display: inline-flex;
  align-items: center;
  font-weight: ${tokens.typography.fontWeight.medium};
  border-radius: ${tokens.borderRadius.full};
  white-space: nowrap;

  /* Применяем стили варианта */
  ${({ $variant }) => variantStyles[$variant]}

  /* Применяем стили размера */
  ${({ $size }) => sizeStyles[$size]}
`;

/**
 * Цвета точки для разных вариантов
 */
const dotVariantColors = {
  default: tokens.colors.gray[500],
  primary: tokens.colors.primary[500],
  success: tokens.colors.success[500],
  warning: tokens.colors.warning[500],
  danger: tokens.colors.danger[500],
  info: tokens.colors.info[500],
};

interface StyledBadgeDotProps {
  $variant: BadgeVariant;
  $size: number;
}

/**
 * Точка в бейдже
 */
export const StyledBadgeDot = styled.span<StyledBadgeDotProps>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${tokens.borderRadius.full};
  background-color: ${({ $variant }) => dotVariantColors[$variant]};
  flex-shrink: 0;
`;