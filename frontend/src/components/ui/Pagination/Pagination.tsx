import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { Button } from '../Button';

import { DEFAULT_SHOW_FIRST_LAST, DEFAULT_SIBLING_COUNT, PAGINATION_ARIA_LABELS } from './constants';
import { DotsIndicator, PageButton } from './parts';
import * as S from './styles';
import type { PaginationProps } from './types';
import { getPaginationRange } from './utils';

/**
 * Компонент пагинации с номерами страниц
 * 
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => console.log(page)}
 *   siblingCount={1}
 * />
 * ```
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = DEFAULT_SIBLING_COUNT,
  showFirstLast = DEFAULT_SHOW_FIRST_LAST,
  className,
}) => {
  const paginationRange = React.useMemo(
    () => getPaginationRange(currentPage, totalPages, siblingCount),
    [totalPages, siblingCount, currentPage]
  );

  // Не показываем пагинацию если страниц меньше 2
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <S.PaginationNav
      className={className}
      aria-label={PAGINATION_ARIA_LABELS.navigation}
    >
      {/* Кнопка "Назад" */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        leftIcon={<ChevronLeft size={16} />}
        aria-label={PAGINATION_ARIA_LABELS.previous}
      >
        Previous
      </Button>

      {/* Номера страниц */}
      <S.PageNumbersContainer>
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === 'dots') {
            return <DotsIndicator key={`dots-${index}`} />;
          }

          return (
            <PageButton
              key={pageNumber}
              pageNumber={pageNumber}
              isActive={pageNumber === currentPage}
              onClick={onPageChange}
            />
          );
        })}
      </S.PageNumbersContainer>

      {/* Кнопка "Вперед" */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        rightIcon={<ChevronRight size={16} />}
        aria-label={PAGINATION_ARIA_LABELS.next}
      >
        Next
      </Button>
    </S.PaginationNav>
  );
};