import type { FC } from 'react';

import { StyledCardFooter } from '../styles';
import type { CardFooterProps } from '../types';

/**
 * Футер карточки
 */
export const CardFooter: FC<CardFooterProps> = ({ children, ...props }) => {
  return (
    <StyledCardFooter {...props}>
      {children}
    </StyledCardFooter>
  );
};