import type { FC } from 'react';

import { StyledFlex } from './styles';
import type { FlexProps } from './types';

/**
 * Flex - примитив для flexbox layout
 * Расширяет Box и добавляет flexbox свойства
 */
export const Flex: FC<FlexProps> = ({ children, ...props }) => {
  return <StyledFlex {...props}>{children}</StyledFlex>;
};

Flex.displayName = 'Flex';