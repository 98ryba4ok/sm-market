import React from 'react';

import { PAGINATION_ARIA_LABELS } from '../constants';
import * as S from '../styles';

interface PageButtonProps {
  pageNumber: number;
  isActive: boolean;
  onClick: (page: number) => void;
}

/**
 * Кнопка для выбора конкретной страницы
 */
export const PageButton: React.FC<PageButtonProps> = ({
  pageNumber,
  isActive,
  onClick,
}) => {
  return (
    <S.PageButton
      $isActive={isActive}
      onClick={() => onClick(pageNumber)}
      aria-label={PAGINATION_ARIA_LABELS.page(pageNumber)}
      aria-current={isActive ? PAGINATION_ARIA_LABELS.currentPage : undefined}
    >
      {pageNumber}
    </S.PageButton>
  );
};