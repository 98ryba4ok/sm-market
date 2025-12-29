import styled, { css } from 'styled-components';

import { tokens } from '../../../theme';

/**
 * Контейнер для рейтинга
 */
export const StyledRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[2]};
`;

/**
 * Контейнер для звезд
 */
export const StyledStarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[0.5]};
`;

interface StyledStarButtonProps {
  $readonly: boolean;
}

/**
 * Кнопка звезды
 */
export const StyledStarButton = styled.button<StyledStarButtonProps>`
  padding: 0;
  border: none;
  background: none;
  transition: transform ${tokens.transitions.fast};
  
  ${({ $readonly }) =>
    $readonly
      ? css`
          cursor: default;
        `
      : css`
          cursor: pointer;
          
          &:hover {
            transform: scale(1.1);
          }
        `}
  
  &:focus {
    outline: none;
  }
  
  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.borderRadius.sm};
  }
`;

/**
 * Контейнер для частично заполненной звезды
 */
export const StyledPartialStarContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

/**
 * Оверлей для частичного заполнения
 */
export const StyledPartialStarOverlay = styled.div<{ $percentage: number }>`
  position: absolute;
  inset: 0;
  overflow: hidden;
  width: ${({ $percentage }) => $percentage}%;
`;

/**
 * Текст значения рейтинга
 */
export const StyledRatingValue = styled.span`
  font-size: ${tokens.typography.fontSize.sm};
  font-weight: ${tokens.typography.fontWeight.medium};
  color: ${tokens.colors.gray[700]};
`;

/**
 * Компактный контейнер рейтинга
 */
export const StyledRatingCompact = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.spacing[1]};
`;

/**
 * Текст в компактном рейтинге
 */
export const StyledCompactValue = styled.span`
  font-size: ${tokens.typography.fontSize.sm};
  font-weight: ${tokens.typography.fontWeight.medium};
  color: ${tokens.colors.gray[700]};
`;