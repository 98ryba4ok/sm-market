import { Star } from 'lucide-react';
import React from 'react';

export interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  readonly?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  readonly = true,
  onChange,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

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

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayValue;
          const isPartial = starValue === Math.ceil(displayValue) && displayValue % 1 !== 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform ${sizeStyles[size]}`}
              aria-label={`Rate ${starValue} out of ${max}`}
            >
              {isPartial ? (
                <div className="relative">
                  <Star className={`${sizeStyles[size]} text-gray-300`} fill="currentColor" />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${(displayValue % 1) * 100}%` }}
                  >
                    <Star className={`${sizeStyles[size]} text-yellow-400`} fill="currentColor" />
                  </div>
                </div>
              ) : (
                <Star
                  className={`${sizeStyles[size]} ${
                    isFilled ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                />
              )}
            </button>
          );
        })}
      </div>
      
      {showValue && (
        <span className="text-sm font-medium text-gray-700">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Compact rating display (just number with star)
export const RatingCompact: React.FC<{ value: number; className?: string }> = ({
  value,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
      <span className="text-sm font-medium text-gray-700">{value.toFixed(1)}</span>
    </div>
  );
};