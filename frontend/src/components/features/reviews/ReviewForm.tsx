import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Rating } from '../../ui/Rating';

// Validation schema
const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: number;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onSubmit,
  isSubmitting = false,
  className = '',
}) => {
  const [rating, setRating] = React.useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setValue('rating', newRating, { shouldValidate: true });
  };

  const handleFormSubmit = async (data: ReviewFormData) => {
    try {
      await onSubmit(data);
      // Reset form on success
      reset();
      setRating(0);
    } catch (error) {
      // Error is handled by parent component
      console.error('Review submission failed:', error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <Rating
              value={rating}
              onChange={handleRatingChange}
              size="lg"
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Review *
            </label>
            <textarea
              id="comment"
              rows={5}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                errors.comment ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Share your experience with this product..."
              {...register('comment')}
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimum 10 characters, maximum 1000 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          >
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};