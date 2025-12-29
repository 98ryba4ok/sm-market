import { ArrowRight, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { ProductGrid } from '../components/features/products/ProductGrid';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useProducts } from '../hooks/useProducts';

export const HomePage: React.FC = () => {
  // Fetch featured products (first page)
  const { products, isLoading } = useProducts({
    page: 1,
  });

  // Show only first 8 products for homepage
  const featuredProducts = products.slice(0, 8);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to SM Market
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover amazing products at unbeatable prices
            </p>
            <Link to="/products">
              <Button
                size="lg"
                variant="secondary"
                rightIcon={<ArrowRight size={20} />}
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="text-center p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={32} className="text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                <p className="text-gray-600">
                  Thousands of products across multiple categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                <p className="text-gray-600">
                  Competitive pricing and regular discounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center p-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Top Quality</h3>
                <p className="text-gray-600">
                  Verified products with customer reviews
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Check out our most popular items
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" rightIcon={<ArrowRight size={18} />}>
                View All
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our full catalog and find exactly what you're looking for
          </p>
          <Link to="/products">
            <Button size="lg" rightIcon={<ArrowRight size={20} />}>
              Explore Products
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};