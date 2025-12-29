import styled, { css } from 'styled-components';

import { tokens } from '../../../theme';

import type { CardPadding, CardVariant } from './types';

/**
 * Стили для разных вариантов карточки
 */
const variantStyles = {
  default: css`
    background-color: ${tokens.colors.white};
  `,

  bordered: css`
    background-color: ${tokens.colors.white};
    border: 1px solid ${tokens.colors.gray[200]};
  `,

  elevated: css`
    background-color: ${tokens.colors.white};
    box-shadow: ${tokens.shadows.md};
  `,
};

/**
 * Стили для разных размеров отступов
 */
const paddingStyles = {
  none: css`
    padding: 0;
  `,

  sm: css`
    padding: ${tokens.spacing[3]};
  `,

  md: css`
    padding: ${tokens.spacing[4]};
  `,

  lg: css`
    padding: ${tokens.spacing[6]};
  `,
};

interface StyledCardProps {
  $variant: CardVariant;
  $padding: CardPadding;
  $hoverable: boolean;
}

/**
 * Основной styled-компонент карточки
 */
export const StyledCard = styled.div<StyledCardProps>`
  border-radius: ${tokens.borderRadius.lg};
  transition: box-shadow ${tokens.transitions.base};

  /* Применяем стили варианта */
  ${({ $variant }) => variantStyles[$variant]}

  /* Применяем стили отступов */
  ${({ $padding }) => paddingStyles[$padding]}

  /* Эффект при наведении */
  ${({ $hoverable }) =>
    $hoverable &&
    css`
      cursor: pointer;
      
      &:hover {
        box-shadow: ${tokens.shadows.lg};
      }
    `}
`;

/**
 * Заголовок карточки
 */
export const StyledCardHeader = styled.div`
  margin-bottom: ${tokens.spacing[4]};
`;

/**
 * Заголовок карточки (h3)
 */
export const StyledCardTitle = styled.h3`
  margin: 0;
  font-size: ${tokens.typography.fontSize.lg};
  font-weight: ${tokens.typography.fontWeight.semibold};
  line-height: ${tokens.typography.lineHeight.tight};
  color: ${tokens.colors.gray[900]};
`;

/**
 * Описание карточки
 */
export const StyledCardDescription = styled.p`
  margin: ${tokens.spacing[1]} 0 0;
  font-size: ${tokens.typography.fontSize.sm};
  line-height: ${tokens.typography.lineHeight.normal};
  color: ${tokens.colors.gray[600]};
`;

/**
 * Контент карточки
 */
export const StyledCardContent = styled.div`
  /* Контент без дополнительных стилей, полностью кастомизируемый */
`;

/**
 * Футер карточки
 */
export const StyledCardFooter = styled.div`
  margin-top: ${tokens.spacing[4]};
  padding-top: ${tokens.spacing[4]};
  border-top: 1px solid ${tokens.colors.gray[200]};
`;