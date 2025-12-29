import { forwardRef } from 'react';

import { BUTTON_DEFAULTS, ICON_SIZES, SPINNER_SIZES } from './constants';
import { ButtonIcon, ButtonSpinner } from './parts';
import { StyledButton } from './styles';
import type { ButtonProps } from './types';

/**
 * Компонент кнопки с поддержкой различных вариантов, размеров и состояний
 * 
 * @example
 * ```tsx
 * // Базовое использование
 * <Button>Click me</Button>
 * 
 * // С вариантом и размером
 * <Button variant="secondary" size="lg">Large Button</Button>
 * 
 * // С иконками
 * <Button leftIcon={<Icon />}>With Icon</Button>
 * 
 * // Состояние загрузки
 * <Button isLoading>Loading...</Button>
 * 
 * // Полная ширина
 * <Button fullWidth>Full Width</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = BUTTON_DEFAULTS.variant,
      size = BUTTON_DEFAULTS.size,
      isLoading = BUTTON_DEFAULTS.isLoading,
      fullWidth = BUTTON_DEFAULTS.fullWidth,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const iconSize = ICON_SIZES[size];
    const spinnerSize = SPINNER_SIZES[size];

    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <ButtonSpinner size={spinnerSize} />}
        
        {!isLoading && leftIcon && (
          <ButtonIcon size={iconSize}>{leftIcon}</ButtonIcon>
        )}
        
        {children}
        
        {!isLoading && rightIcon && (
          <ButtonIcon size={iconSize}>{rightIcon}</ButtonIcon>
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';