import { X } from 'lucide-react';
import React from 'react';

import type { Category } from '../../../types/product';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Rating } from '../../ui/Rating';

export interface ProductFiltersState {
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
}

interface ProductFiltersProps {
  categories: Category[];
  filters: ProductFiltersState;
  onFiltersChange: (filters: ProductFiltersState) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleCategoryChange = (categoryId: number) => {
    onFiltersChange({
      ...filters,
      category: filters.category === categoryId ? undefined : categoryId,
    });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    onFiltersChange({
      ...filters,
      [field]: numValue,
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? undefined : rating,
    });
  };

  const hasActiveFilters =
    filters.category !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minRating !== undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<X size={16} />}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-sm mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.category === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-sm mb-3">Price Range</h4>
        <div className="space-y-3">
          <Input
            type="number"
            placeholder="Min price"
            value={filters.minPrice ?? ''}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            min="0"
          />
          <Input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice ?? ''}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            min="0"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-medium text-sm mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <div className="flex items-center space-x-1">
                <Rating value={rating} readonly size="sm" />
                <span className="text-sm text-gray-600">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};