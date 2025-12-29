import type { FC } from 'react';

import { Spinner } from '../Spinner';
import { StyledLoadingOverlay, StyledOverlayMessage } from '../styles';
import type { LoadingOverlayProps } from '../types';

/**
 * Полноэкранный оверлей загрузки
 * 
 * @example
 * ```tsx
 * <LoadingOverlay />
 * <LoadingOverlay message="Loading data..." />
 * ```
 */
export const LoadingOverlay: FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <StyledLoadingOverlay>
      <Spinner size="xl" />
      {message && <StyledOverlayMessage>{message}</StyledOverlayMessage>}
    </StyledLoadingOverlay>
  );
};