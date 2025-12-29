import type { FC } from 'react';

import { StyledCardContent } from '../styles';
import type { CardContentProps } from '../types';

/**
 * Контент карточки
 */
export const CardContent: FC<CardContentProps> = ({ children, ...props }) => {
  return (
    <StyledCardContent {...props}>
      {children}
    </StyledCardContent>
  );
};