import type { FC } from 'react';

import { StyledCardHeader } from '../styles';
import type { CardHeaderProps } from '../types';

/**
 * Заголовочная секция карточки
 */
export const CardHeader: FC<CardHeaderProps> = ({ children, ...props }) => {
  return (
    <StyledCardHeader {...props}>
      {children}
    </StyledCardHeader>
  );
};