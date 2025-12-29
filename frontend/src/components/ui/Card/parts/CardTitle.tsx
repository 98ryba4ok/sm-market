import type { FC } from 'react';

import { StyledCardTitle } from '../styles';
import type { CardTitleProps } from '../types';

/**
 * Заголовок карточки
 */
export const CardTitle: FC<CardTitleProps> = ({ children, ...props }) => {
  return (
    <StyledCardTitle {...props}>
      {children}
    </StyledCardTitle>
  );
};