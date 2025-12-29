import { forwardRef, useId } from 'react';

import { INPUT_DEFAULTS } from './constants';
import { InputErrorIcon, InputIcon } from './parts';
import {
    StyledErrorText,
    StyledHelperText,
    StyledInput,
    StyledInputContainer,
    StyledInputWrapper,
    StyledLabel,
} from './styles';
import type { InputProps } from './types';

/**
 * Компонент поля ввода с поддержкой меток, иконок, ошибок и вспомогательного текста
 * 
 * @example
 * ```tsx
 * // Базовое использование
 * <Input placeholder="Enter text" />
 * 
 * // С меткой
 * <Input label="Email" type="email" />
 * 
 * // С иконками
 * <Input leftIcon={<SearchIcon />} placeholder="Search..." />
 * 
 * // С ошибкой
 * <Input label="Password" error="Password is required" />
 * 
 * // С вспомогательным текстом
 * <Input label="Username" helperText="Must be at least 3 characters" />
 * 
 * // Полная ширина
 * <Input fullWidth placeholder="Full width input" />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = INPUT_DEFAULTS.fullWidth,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hasError = !!error;

    return (
      <StyledInputWrapper $fullWidth={fullWidth}>
        {label && (
          <StyledLabel htmlFor={inputId}>
            {label}
          </StyledLabel>
        )}
        
        <StyledInputContainer>
          {leftIcon && (
            <InputIcon position="left">
              {leftIcon}
            </InputIcon>
          )}
          
          <StyledInput
            ref={ref}
            id={inputId}
            $hasError={hasError}
            $hasLeftIcon={!!leftIcon}
            $hasRightIcon={!!rightIcon || hasError}
            {...props}
          />
          
          {!hasError && rightIcon && (
            <InputIcon position="right">
              {rightIcon}
            </InputIcon>
          )}
          
          {hasError && <InputErrorIcon />}
        </StyledInputContainer>
        
        {error && (
          <StyledErrorText>{error}</StyledErrorText>
        )}
        
        {helperText && !error && (
          <StyledHelperText>{helperText}</StyledHelperText>
        )}
      </StyledInputWrapper>
    );
  }
);

Input.displayName = 'Input';