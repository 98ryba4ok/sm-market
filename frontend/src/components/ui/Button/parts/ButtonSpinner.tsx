import { Loader2 } from 'lucide-react';
import type { FC } from 'react';

import { SpinnerWrapper } from '../styles';

interface ButtonSpinnerProps {
  size: number;
}

/**
 * Компонент для отображения спиннера загрузки в кнопке
 */
export const ButtonSpinner: FC<ButtonSpinnerProps> = ({ size }) => {
  return (
    <SpinnerWrapper style={{ width: size, height: size }}>
      <Loader2 size={size} />
    </SpinnerWrapper>
  );
};