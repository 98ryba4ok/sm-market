import { Heart } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ProductGrid } from '../components/features/products/ProductGrid';
import { MainLayout } from '../components/layout/MainLayout';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { useWishlist } from '../hooks/useWishlist';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save your favorite products to your wishlist"
            action={{
              label: 'Browse Products',
              onClick: () => navigate('/products'),
            }}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlist.products.length} {wishlist.products.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <ProductGrid products={wishlist.products} />
      </div>
    </MainLayout>
  );
};