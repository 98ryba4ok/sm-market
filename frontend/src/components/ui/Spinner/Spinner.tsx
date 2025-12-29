import { Loader2 } from 'lucide-react';
import type { FC } from 'react';

import { SPINNER_DEFAULTS, SPINNER_SIZES } from './constants';
import { StyledSpinnerWrapper } from './styles';
import type { SpinnerProps } from './types';

/**
 * Компонент спиннера для индикации загрузки
 * 
 * @example
 * ```tsx
 * // Базовое использование
 * <Spinner />
 * 
 * // С размером
 * <Spinner size="sm" />
 * <Spinner size="xl" />
 * ```
 */
export const Spinner: FC<SpinnerProps> = ({
  size = SPINNER_DEFAULTS.size,
  className,
}) => {
  const spinnerSize = SPINNER_SIZES[size];

  return (
    <StyledSpinnerWrapper className={className}>
      <Loader2 size={spinnerSize} aria-label="Loading" />
    </StyledSpinnerWrapper>
  );
};