import type { FC } from 'react';

import { StyledBox } from './styles';
import type { BoxProps } from './types';

/**
 * Box - базовый примитив для создания layout
 * Предоставляет удобные пропсы для spacing, sizing и позиционирования
 */
export const Box: FC<BoxProps> = ({ children, ...props }) => {
  return <StyledBox {...props}>{children}</StyledBox>;
};

Box.displayName = 'Box';