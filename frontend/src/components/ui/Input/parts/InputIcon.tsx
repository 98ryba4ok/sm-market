import type { FC, ReactNode } from 'react';

import { StyledIconWrapper } from '../styles';

interface InputIconProps {
  children: ReactNode;
  position: 'left' | 'right';
}

/**
 * Компонент для отображения иконки в поле ввода
 */
export const InputIcon: FC<InputIconProps> = ({ children, position }) => {
  return (
    <StyledIconWrapper $position={position}>
      {children}
    </StyledIconWrapper>
  );
};