import { Star } from 'lucide-react';
import type { FC } from 'react';

import { COMPACT_STAR_SIZE } from '../constants';
import { StyledCompactValue, StyledRatingCompact } from '../styles';
import type { RatingCompactProps } from '../types';

/**
 * Компактное отображение рейтинга (звезда + число)
 * 
 * @example
 * ```tsx
 * <RatingCompact value={4.5} />
 * ```
 */
export const RatingCompact: FC<RatingCompactProps> = ({ value, className }) => {
  return (
    <StyledRatingCompact className={className}>
      <Star size={COMPACT_STAR_SIZE} color="#fbbf24" fill="#fbbf24" />
      <StyledCompactValue>{value.toFixed(1)}</StyledCompactValue>
    </StyledRatingCompact>
  );
};