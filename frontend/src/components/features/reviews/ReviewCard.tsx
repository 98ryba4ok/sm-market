import { Calendar, User } from 'lucide-react';
import React from 'react';

import type { Review } from '../../../types/product';
import { formatDate } from '../../../utils/format';
import { Badge } from '../../ui/Badge';
import { Rating } from '../../ui/Rating';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {review.user.first_name} {review.user.last_name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                {formatDate(review.created_at)}
              </span>
            </div>
          </div>
        </div>
        
        {review.is_verified_purchase && (
          <Badge variant="success" size="sm">
            Verified Purchase
          </Badge>
        )}
      </div>

      {/* Rating */}
      <div className="mb-3">
        <Rating value={review.rating} readonly size="sm" />
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {review.comment}
        </p>
      )}
    </div>
  );
};