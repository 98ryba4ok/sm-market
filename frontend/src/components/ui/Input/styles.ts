import styled, { css } from 'styled-components';

import { tokens } from '../../../theme';

interface StyledInputWrapperProps {
  $fullWidth: boolean;
}

/**
 * Обертка для всего компонента Input
 */
export const StyledInputWrapper = styled.div<StyledInputWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing[1]};
  
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
`;

/**
 * Метка поля ввода
 */
export const StyledLabel = styled.label`
  display: block;
  font-size: ${tokens.typography.fontSize.sm};
  font-weight: ${tokens.typography.fontWeight.medium};
  color: ${tokens.colors.gray[700]};
  line-height: ${tokens.typography.lineHeight.sm};
`;

/**
 * Контейнер для поля ввода с иконками
 */
export const StyledInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

interface StyledInputProps {
  $hasError: boolean;
  $hasLeftIcon: boolean;
  $hasRightIcon: boolean;
}

/**
 * Само поле ввода
 */
export const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  padding: ${tokens.spacing[2]} ${tokens.spacing[3]};
  font-family: ${tokens.typography.fontFamily.base};
  font-size: ${tokens.typography.fontSize.base};
  line-height: ${tokens.typography.lineHeight.base};
  color: ${tokens.colors.gray[900]};
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.gray[300]};
  border-radius: ${tokens.borderRadius.lg};
  transition: all ${tokens.transitions.fast};
  
  /* Отступы для иконок */
  ${({ $hasLeftIcon }) =>
    $hasLeftIcon &&
    css`
      padding-left: ${tokens.spacing[10]};
    `}
  
  ${({ $hasRightIcon }) =>
    $hasRightIcon &&
    css`
      padding-right: ${tokens.spacing[10]};
    `}
  
  /* Состояния */
  &:hover:not(:disabled) {
    border-color: ${tokens.colors.gray[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError }) =>
      $hasError ? tokens.colors.error[500] : tokens.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ $hasError }) =>
      $hasError ? tokens.colors.error[100] : tokens.colors.primary[100]};
  }
  
  &:disabled {
    background-color: ${tokens.colors.gray[100]};
    cursor: not-allowed;
    color: ${tokens.colors.gray[500]};
  }
  
  /* Состояние ошибки */
  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: ${tokens.colors.error[500]};
      
      &:hover:not(:disabled) {
        border-color: ${tokens.colors.error[600]};
      }
    `}
  
  /* Placeholder */
  &::placeholder {
    color: ${tokens.colors.gray[400]};
  }
`;

/**
 * Контейнер для иконки
 */
export const StyledIconWrapper = styled.div<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.gray[400]};
  pointer-events: none;
  
  ${({ $position }) =>
    $position === 'left'
      ? css`
          left: ${tokens.spacing[3]};
        `
      : css`
          right: ${tokens.spacing[3]};
        `}
`;

/**
 * Контейнер для иконки ошибки
 */
export const StyledErrorIconWrapper = styled(StyledIconWrapper)`
  color: ${tokens.colors.error[500]};
`;

/**
 * Текст ошибки
 */
export const StyledErrorText = styled.p`
  font-size: ${tokens.typography.fontSize.sm};
  line-height: ${tokens.typography.lineHeight.sm};
  color: ${tokens.colors.error[600]};
  margin: 0;
`;

/**
 * Вспомогательный текст
 */
export const StyledHelperText = styled.p`
  font-size: ${tokens.typography.fontSize.sm};
  line-height: ${tokens.typography.lineHeight.sm};
  color: ${tokens.colors.gray[500]};
  margin: 0;
`;