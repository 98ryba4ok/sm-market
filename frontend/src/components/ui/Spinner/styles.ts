import styled, { keyframes } from 'styled-components';

import { tokens } from '../../../theme';

/**
 * Анимация вращения
 */
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

/**
 * Обертка для спиннера
 */
export const StyledSpinnerWrapper = styled.div`
  display: inline-flex;
  color: ${tokens.colors.primary[600]};
  animation: ${spin} 1s linear infinite;
`;

/**
 * Оверлей для полноэкранной загрузки
 */
export const StyledLoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${tokens.zIndex.modal};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
`;

/**
 * Сообщение в оверлее
 */
export const StyledOverlayMessage = styled.p`
  margin-top: ${tokens.spacing[4]};
  font-size: ${tokens.typography.fontSize.lg};
  font-weight: ${tokens.typography.fontWeight.medium};
  color: ${tokens.colors.gray[700]};
`;

/**
 * Контейнер для inline загрузки
 */
export const StyledLoadingInline = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing[3]};
  padding: ${tokens.spacing[8]} 0;
`;

/**
 * Сообщение для inline загрузки
 */
export const StyledInlineMessage = styled.span`
  color: ${tokens.colors.gray[600]};
  font-size: ${tokens.typography.fontSize.base};
`;