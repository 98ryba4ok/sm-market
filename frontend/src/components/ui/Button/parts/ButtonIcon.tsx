import type { FC, ReactNode } from 'react';

import { IconWrapper } from '../styles';

interface ButtonIconProps {
  children: ReactNode;
  size: number;
}

/**
 * Компонент для отображения иконки в кнопке
 */
export const ButtonIcon: FC<ButtonIconProps> = ({ children, size }) => {
  return (
    <IconWrapper style={{ width: size, height: size }}>
      {children}
    </IconWrapper>
  );
};