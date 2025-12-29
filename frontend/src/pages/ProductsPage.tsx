import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';
import React from 'react';

import * as categoriesApi from '../api/categories';
import type { ProductFiltersState } from '../components/features/products/ProductFilters';
import { ProductFilters } from '../components/features/products/ProductFilters';
import { ProductGrid } from '../components/features/products/ProductGrid';
import type { SortOption } from '../components/features/products/ProductSort';
import { ProductSort } from '../components/features/products/ProductSort';
import type { BreadcrumbItem } from '../components/layout/Breadcrumbs';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { MainLayout } from '../components/layout/MainLayout';
import { Sidebar } from '../components/layout/Sidebar';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { Spinner } from '../components/ui/Spinner';
import { useProducts } from '../hooks/useProducts';
import { queryKeys } from '../utils/queryKeys';

export const ProductsPage: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState<ProductFiltersState>({});
  const [sort, setSort] = React.useState<SortOption>('newest');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Fetch categories for filters
  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: categoriesApi.fetchCategories,
  });

  // Fetch products with filters
  const { products, count, isLoading } = useProducts({
    page,
    category: filters.category,
    min_price: filters.minPrice,
    max_price: filters.maxPrice,
    min_rating: filters.minRating,
    ordering: sort === 'price_asc' ? 'price' : sort === 'price_desc' ? '-price' : '-created_at',
  });

  const totalPages = Math.ceil(count / 20); // Assuming 20 items per page

  const handleFiltersChange = (newFilters: ProductFiltersState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Products' },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-600 mt-1">
              {count} {count === 1 ? 'product' : 'products'} found
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              leftIcon={<SlidersHorizontal size={18} />}
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
            >
              Filters
            </Button>

            {/* Sort */}
            <ProductSort value={sort} onChange={setSort} />
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Sidebar with Filters */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title="Filters"
            className="lg:w-64"
          >
            <ProductFilters
              categories={categories}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </Sidebar>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                <ProductGrid products={products} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};