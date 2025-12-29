import { Star } from 'lucide-react';
import { type FC, useState } from 'react';

import { RATING_DEFAULTS, STAR_SIZES } from './constants';
import {
    StyledPartialStarContainer,
    StyledPartialStarOverlay,
    StyledRatingContainer,
    StyledRatingValue,
    StyledStarButton,
    StyledStarsContainer,
} from './styles';
import type { RatingProps } from './types';

/**
 * Компонент рейтинга со звездами
 * 
 * @example
 * ```tsx
 * // Только для чтения
 * <Rating value={4.5} />
 * 
 * // С отображением значения
 * <Rating value={4.5} showValue />
 * 
 * // Интерактивный рейтинг
 * <Rating 
 *   value={rating} 
 *   readonly={false} 
 *   onChange={setRating} 
 * />
 * 
 * // Разные размеры
 * <Rating value={4} size="sm" />
 * <Rating value={4} size="lg" />
 * ```
 */
export const Rating: FC<RatingProps> = ({
  value,
  max = RATING_DEFAULTS.max,
  size = RATING_DEFAULTS.size,
  showValue = RATING_DEFAULTS.showValue,
  readonly = RATING_DEFAULTS.readonly,
  onChange,
  className,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null);
    }
  };

  const displayValue = hoverValue !== null ? hoverValue : value;
  const starSize = STAR_SIZES[size];

  return (
    <StyledRatingContainer className={className}>
      <StyledStarsContainer>
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayValue;
          const isPartial = starValue === Math.ceil(displayValue) && displayValue % 1 !== 0;

          return (
            <StyledStarButton
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              $readonly={readonly}
              aria-label={`Rate ${starValue} out of ${max}`}
            >
              {isPartial ? (
                <StyledPartialStarContainer>
                  <Star size={starSize} color="#d1d5db" fill="#d1d5db" />
                  <StyledPartialStarOverlay $percentage={(displayValue % 1) * 100}>
                    <Star size={starSize} color="#fbbf24" fill="#fbbf24" />
                  </StyledPartialStarOverlay>
                </StyledPartialStarContainer>
              ) : (
                <Star
                  size={starSize}
                  color={isFilled ? '#fbbf24' : '#d1d5db'}
                  fill={isFilled ? '#fbbf24' : '#d1d5db'}
                />
              )}
            </StyledStarButton>
          );
        })}
      </StyledStarsContainer>

      {showValue && (
        <StyledRatingValue>
          {value.toFixed(1)}
        </StyledRatingValue>
      )}
    </StyledRatingContainer>
  );
};