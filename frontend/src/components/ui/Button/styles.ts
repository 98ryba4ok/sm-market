import styled, { css } from 'styled-components';

import { tokens } from '../../../theme';

import type { ButtonSize, ButtonVariant } from './types';

/**
 * Стили для разных вариантов кнопки
 */
const variantStyles = {
  primary: css`
    background-color: ${tokens.colors.primary[600]};
    color: ${tokens.colors.white};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${tokens.colors.primary[700]};
    }

    &:active:not(:disabled) {
      background-color: ${tokens.colors.primary[800]};
    }

    &:disabled {
      background-color: ${tokens.colors.primary[300]};
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px ${tokens.colors.primary[100]};
    }
  `,

  secondary: css`
    background-color: ${tokens.colors.gray[600]};
    color: ${tokens.colors.white};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${tokens.colors.gray[700]};
    }

    &:active:not(:disabled) {
      background-color: ${tokens.colors.gray[800]};
    }

    &:disabled {
      background-color: ${tokens.colors.gray[300]};
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px ${tokens.colors.gray[100]};
    }
  `,

  outline: css`
    background-color: transparent;
    color: ${tokens.colors.primary[600]};
    border: 2px solid ${tokens.colors.primary[600]};

    &:hover:not(:disabled) {
      background-color: ${tokens.colors.primary[50]};
    }

    &:active:not(:disabled) {
      background-color: ${tokens.colors.primary[100]};
    }

    &:disabled {
      color: ${tokens.colors.gray[300]};
      border-color: ${tokens.colors.gray[300]};
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px ${tokens.colors.primary[100]};
    }
  `,

  ghost: css`
    background-color: transparent;
    color: ${tokens.colors.gray[700]};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${tokens.colors.gray[100]};
    }

    &:active:not(:disabled) {
      background-color: ${tokens.colors.gray[200]};
    }

    &:disabled {
      color: ${tokens.colors.gray[300]};
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px ${tokens.colors.gray[100]};
    }
  `,

  danger: css`
    background-color: ${tokens.colors.error[600]};
    color: ${tokens.colors.white};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${tokens.colors.error[700]};
    }

    &:active:not(:disabled) {
      background-color: ${tokens.colors.error[800]};
    }

    &:disabled {
      background-color: ${tokens.colors.error[300]};
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px ${tokens.colors.error[100]};
    }
  `,
};

/**
 * Стили для разных размеров кнопки
 */
const sizeStyles = {
  sm: css`
    padding: ${tokens.spacing[1.5]} ${tokens.spacing[3]};
    font-size: ${tokens.typography.fontSize.sm};
    line-height: ${tokens.typography.lineHeight.sm};
    gap: ${tokens.spacing[1.5]};
  `,

  md: css`
    padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
    font-size: ${tokens.typography.fontSize.base};
    line-height: ${tokens.typography.lineHeight.base};
    gap: ${tokens.spacing[2]};
  `,

  lg: css`
    padding: ${tokens.spacing[3]} ${tokens.spacing[6]};
    font-size: ${tokens.typography.fontSize.lg};
    line-height: ${tokens.typography.lineHeight.lg};
    gap: ${tokens.spacing[2]};
  `,
};

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}

/**
 * Основной styled-компонент кнопки
 */
export const StyledButton = styled.button<StyledButtonProps>`
  /* Базовые стили */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${tokens.typography.fontFamily.base};
  font-weight: ${tokens.typography.fontWeight.medium};
  border-radius: ${tokens.borderRadius.lg};
  transition: all ${tokens.transitions.fast};
  cursor: pointer;
  user-select: none;

  /* Применяем стили варианта */
  ${({ $variant }) => variantStyles[$variant]}

  /* Применяем стили размера */
  ${({ $size }) => sizeStyles[$size]}

  /* Полная ширина */
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  /* Состояние disabled */
  &:disabled {
    pointer-events: none;
  }
`;

/**
 * Контейнер для иконки
 */
export const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

/**
 * Контейнер для спиннера загрузки
 */
export const SpinnerWrapper = styled(IconWrapper)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;