import { MessageSquare } from 'lucide-react';
import React from 'react';

import type { Review } from '../../../types/product';
import { EmptyState } from '../../ui/EmptyState';
import { Pagination } from '../../ui/Pagination';

import { ReviewCard } from './ReviewCard';

interface ReviewsListProps {
  reviews: Review[];
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  isLoading = false,
  className = '',
}) => {
  // Show empty state if no reviews
  if (!isLoading && reviews.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No reviews yet"
        description="Be the first to review this product"
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};