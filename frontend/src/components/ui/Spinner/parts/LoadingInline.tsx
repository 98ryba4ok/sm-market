import type { FC } from 'react';

import { DEFAULT_LOADING_MESSAGE } from '../constants';
import { Spinner } from '../Spinner';
import { StyledInlineMessage, StyledLoadingInline } from '../styles';
import type { LoadingInlineProps } from '../types';

/**
 * Inline индикатор загрузки
 * 
 * @example
 * ```tsx
 * <LoadingInline />
 * <LoadingInline message="Fetching data..." />
 * ```
 */
export const LoadingInline: FC<LoadingInlineProps> = ({
  message = DEFAULT_LOADING_MESSAGE,
}) => {
  return (
    <StyledLoadingInline>
      <Spinner size="md" />
      <StyledInlineMessage>{message}</StyledInlineMessage>
    </StyledLoadingInline>
  );
};