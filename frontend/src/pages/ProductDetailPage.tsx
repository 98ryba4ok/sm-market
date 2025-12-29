import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import * as productsApi from '../api/products';
import * as reviewsApi from '../api/reviews';
import { ReviewForm } from '../components/features/reviews/ReviewForm';
import { ReviewsList } from '../components/features/reviews/ReviewsList';
import { WishlistButton } from '../components/features/wishlist/WishlistButton';
import type { BreadcrumbItem } from '../components/layout/Breadcrumbs';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { MainLayout } from '../components/layout/MainLayout';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Rating } from '../components/ui/Rating';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import type { CreateReviewData, ProductDetail, ProductImage } from '../types/product';
import { formatPrice } from '../utils/format';
import { queryKeys } from '../utils/queryKeys';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: queryKeys.products.detail(Number(id)),
    queryFn: () => productsApi.fetchProductById(Number(id)),
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: queryKeys.products.reviews(Number(id)),
    queryFn: () => reviewsApi.fetchReviews({ product: Number(id) }),
    enabled: !!id,
  });

  const reviews = reviewsData?.results || [];

  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewData) =>
      reviewsApi.createReview({ product: Number(id), ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.reviews(Number(id)) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(Number(id)) });
      toast.success('Review submitted successfully');
    },
    onError: () => {
      toast.error('Failed to submit review');
    },
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart({ product_id: product.id, quantity });
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && product && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleReviewSubmit = async (data: CreateReviewData) => {
    await createReviewMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Product not found</p>
        </div>
      </MainLayout>
    );
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Products', href: '/products' },
    { label: product.category.name, href: `/products?category=${product.category.id}` },
    { label: product.name },
  ];

  // Handle images - ProductDetail has images array, Product has main_image
  const productWithImages = product as ProductDetail;
  const images: ProductImage[] = productWithImages.images && productWithImages.images.length > 0
    ? productWithImages.images
    : product.main_image
    ? [{ id: 0, image: product.main_image, alt_text: product.name, is_main: true, order: 0 }]
    : [];
  const inStock = product.in_stock;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          leftIcon={<ChevronLeft size={18} />}
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Back
        </Button>

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            {images.length > 0 && (
              <>
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={images[selectedImage].image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img: ProductImage, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                        }`}
                      >
                        <img src={img.image} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <Rating value={product.average_rating} readonly />
                  <span className="text-sm text-gray-600">
                    ({product.reviews_count} reviews)
                  </span>
                </div>
              </div>
              <WishlistButton productId={product.id} />
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold text-primary-600 mb-2">
                {formatPrice(product.final_price)}
              </p>
              {inStock ? (
                <Badge variant="success">In Stock ({product.stock_quantity} available)</Badge>
              ) : (
                <Badge variant="danger">Out of Stock</Badge>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Quantity & Add to Cart */}
            {inStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock_quantity}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  isLoading={isAddingToCart}
                  leftIcon={<ShoppingCart size={18} />}
                  className="w-full"
                  size="lg"
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {isAuthenticated && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <ReviewForm 
                  productId={product.id} 
                  onSubmit={handleReviewSubmit}
                  isSubmitting={createReviewMutation.isPending}
                />
              </div>
            )}
            <ReviewsList reviews={reviews} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};