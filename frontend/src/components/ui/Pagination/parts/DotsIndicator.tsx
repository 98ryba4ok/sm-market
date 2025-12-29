import { MoreHorizontal } from 'lucide-react';
import React from 'react';

import * as S from '../styles';

/**
 * Индикатор пропущенных страниц (троеточие)
 */
export const DotsIndicator: React.FC = () => {
  return (
    <S.DotsContainer aria-hidden="true">
      <MoreHorizontal size={16} />
    </S.DotsContainer>
  );
};