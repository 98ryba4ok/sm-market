import React from 'react';

import { Button } from '../../Button';
import { DEFAULT_IS_LOADING } from '../constants';
import * as S from '../styles';
import type { SimplePaginationProps } from '../types';

/**
 * Упрощенная пагинация с кнопкой "Загрузить еще"
 */
export const SimplePagination: React.FC<SimplePaginationProps> = ({
  hasMore,
  onLoadMore,
  isLoading = DEFAULT_IS_LOADING,
}) => {
  if (!hasMore) return null;

  return (
    <S.SimplePaginationContainer>
      <Button
        variant="outline"
        onClick={onLoadMore}
        isLoading={isLoading}
        disabled={isLoading}
      >
        Load More
      </Button>
    </S.SimplePaginationContainer>
  );
};