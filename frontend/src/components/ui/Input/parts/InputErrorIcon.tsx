import { AlertCircle } from 'lucide-react';
import type { FC } from 'react';

import { ERROR_ICON_SIZE } from '../constants';
import { StyledErrorIconWrapper } from '../styles';

/**
 * Компонент для отображения иконки ошибки в поле ввода
 */
export const InputErrorIcon: FC = () => {
  return (
    <StyledErrorIconWrapper $position="right">
      <AlertCircle size={ERROR_ICON_SIZE} />
    </StyledErrorIconWrapper>
  );
};