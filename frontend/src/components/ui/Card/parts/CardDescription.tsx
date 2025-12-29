import type { FC } from 'react';

import { StyledCardDescription } from '../styles';
import type { CardDescriptionProps } from '../types';

/**
 * Описание карточки
 */
export const CardDescription: FC<CardDescriptionProps> = ({ children, ...props }) => {
  return (
    <StyledCardDescription {...props}>
      {children}
    </StyledCardDescription>
  );
};