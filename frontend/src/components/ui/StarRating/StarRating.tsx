import { Star } from "lucide-react";
import "./StarRating.css";

interface StarRatingProps {
  rating: number | null;
  reviewsCount?: number;
  size?: number;
  showCount?: boolean;
}

export const StarRating = ({ 
  rating, 
  reviewsCount = 0, 
  size = 16,
  showCount = true 
}: StarRatingProps) => {
  if (rating === null) {
    return null;
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="star-rating">
      <div className="star-rating__stars">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;
          
          return (
            <Star
              key={i}
              size={size}
              fill={isFilled || isHalf ? "currentColor" : "none"}
              className={`star-rating__star ${
                isFilled ? "star-rating__star--filled" : ""
              } ${isHalf ? "star-rating__star--half" : ""}`}
            />
          );
        })}
      </div>
      {showCount && reviewsCount > 0 && (
        <span className="star-rating__count">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};