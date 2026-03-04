import { Check, ChevronRight, Edit2, Heart, ShoppingCart, Star, Trash2, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { cartApi } from "../../api/cartApi";
import { productsApi } from "../../api/productsApi";
import { reviewsApi } from "../../api/reviewsApi";
import { wishlistApi } from "../../api/wishlistApi";
import { Button } from "../../components/ui/Button/Button";
import { ProductImageGallery } from "../../components/product/ProductImageGallery";
import { MobileProductInfo } from "../../components/product/MobileProductInfo";
import { ReviewFormDrawer } from "../../components/product/ReviewFormDrawer";
import { SimilarProductsSlider } from "../../components/product/SimilarProductsSlider";
import { useToast } from "../../contexts/ToastContext";
import { getImageUrl } from "../../utils/imageUrl";
import type { Product, ProductListItem, ProductReview } from "../../types";
import "./ProductDetailPage.css";

export const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ProductReview | null>(null);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    comment: "",
  });

  // Similar products state
  const [similarProducts, setSimilarProducts] = useState<ProductListItem[]>([]);
  const [_similarLoading, setSimilarLoading] = useState(false);

  // User state (для проверки авторизации)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем авторизацию пользователя
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // Можно декодировать JWT токен для получения email, но для простоты используем другой подход
      // В реальном приложении лучше хранить user data в контексте или state management
      setCurrentUserEmail(localStorage.getItem("userEmail"));
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      setLoading(true);
      setError("");

      try {
        const response = await productsApi.retrieve(slug);
        setProduct(response.data);

        // Set main image or first image as selected
        const mainImg = response.data.images.find(img => img.is_main);
        const initialImage = mainImg?.image || response.data.images[0]?.image || "";
        setSelectedImage(getImageUrl(initialImage));

        // Load reviews
        loadReviews(response.data.id);

        // Load similar products
        loadSimilarProducts(response.data.category, response.data.id);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Не удалось загрузить товар");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const loadReviews = async (productId: number) => {
    setReviewsLoading(true);
    try {
      const response = await productsApi.reviews(productId);
      setReviews(response.data.results);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadSimilarProducts = async (categoryId: number, currentProductId: number) => {
    setSimilarLoading(true);
    try {
      const response = await productsApi.list({
        category: categoryId.toString(),
        page_size: 5
      });
      // Фильтруем текущий товар
      const filtered = response.data.results.filter(p => p.id !== currentProductId);
      setSimilarProducts(filtered.slice(0, 4));
    } catch (err) {
      console.error("Error loading similar products:", err);
    } finally {
      setSimilarLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await cartApi.addItem({ product_id: product.id, quantity: 1 });
      showToast("Товар добавлен в корзину!", "success");
      // Уведомляем Header об обновлении корзины
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      if (err.response?.status === 401) {
        showToast("Войдите в систему для добавления товара в корзину", "error");
        window.dispatchEvent(new CustomEvent("openLoginModal"));
      } else {
        showToast("Ошибка при добавлении в корзину", "error");
      }
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

    try {
      await wishlistApi.add({ product_id: product.id });
      showToast("Товар добавлен в избранное!", "success");
    } catch (err: any) {
      console.error("Error adding to wishlist:", err);
      if (err.response?.status === 401) {
        showToast("Войдите в систему для добавления товара в избранное", "error");
        window.dispatchEvent(new CustomEvent("openLoginModal"));
      } else {
        showToast("Ошибка при добавлении в избранное", "error");
      }
    }
  };


  const handleEditReview = (review: ProductReview) => {
    setEditingReview(review);
    setReviewFormData({
      rating: review.rating,
      comment: review.comment,
    });
    setShowReviewForm(true);
    setActiveTab("reviews");
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить отзыв?")) return;

    try {
      await reviewsApi.delete(reviewId);
      showToast("Отзыв удален!", "success");
      if (product) loadReviews(product.id);
    } catch (err) {
      console.error("Error deleting review:", err);
      showToast("Ошибка при удалении отзыва", "error");
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    setReviewFormData({ rating: 5, comment: "" });
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-detail-page__loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-detail-page__error">
            {error || "Товар не найден"}
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discount_price !== null;
  const discountPercentage = hasDiscount ? product.discount_percentage : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="product-detail-page__breadcrumbs">
          <Link to="/">Главная</Link>
          <ChevronRight size={16} />
          <Link to={`/catalog?category=${product.category_slug}`}>{product.category_name}</Link>
          <ChevronRight size={16} />
          <span>{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className="product-detail-page__main">
          {/* Desktop Layout */}
          <div className="product-detail-page__desktop-layout">
            {/* Left: Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="product-detail-page__thumbnails-vertical">
                {product.images.map((img) => {
                  const imageUrl = getImageUrl(img.image);
                  return (
                    <button
                      key={img.id}
                      className={`product-detail-page__thumbnail-vertical ${
                        selectedImage === imageUrl ? "product-detail-page__thumbnail-vertical--active" : ""
                      }`}
                      onClick={() => setSelectedImage(imageUrl)}
                    >
                      <img src={imageUrl} alt={img.alt_text || product.name} />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Center: Main Image */}
            <div className="product-detail-page__main-image-container">
              <div className="product-detail-page__main-image">
                {selectedImage ? (
                  <img src={selectedImage} alt={product.name} />
                ) : (
                  <div className="product-detail-page__no-image">
                    Нет изображения
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Info - Split into 2 columns */}
            <div className="product-detail-page__info">
              {/* Left Column: Product Details */}
              <div className="product-detail-page__info-left">
                <h1 className="product-detail-page__title">{product.name}</h1>
                
                {product.sku && (
                  <div className="product-detail-page__sku">
                    Код товара: {product.sku}
                  </div>
                )}

                {product.average_rating !== null && (
                  <div className="product-detail-page__rating">
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <span>{product.average_rating.toFixed(1)}</span>
                  </div>
                )}

                {/* Color Selector - показываем только если есть несколько изображений */}
                {product.images && product.images.length > 1 && (
                  <div className="product-detail-page__color-section">
                    <div className="product-detail-page__label">Варианты</div>
                    <div className="product-detail-page__color-options">
                      {product.images.slice(0, 5).map((img) => {
                        const imageUrl = getImageUrl(img.image);
                        return (
                          <button
                            key={img.id}
                            className={`product-detail-page__color-option ${
                              selectedImage === imageUrl ? "product-detail-page__color-option--active" : ""
                            }`}
                            onClick={() => setSelectedImage(imageUrl)}
                          >
                            <img src={imageUrl} alt={img.alt_text || product.name} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* About Product Section */}
                <div className="product-detail-page__about">
                  <div className="product-detail-page__about-header">
                    <h3>О товаре</h3>
                    <div className="product-detail-page__about-link" onClick={() => setActiveTab("specifications")}>Все характеристики</div>
                  </div>
                  <table className="product-detail-page__specs-table-compact">
                    <tbody>
                      {product.brand && (
                        <tr>
                          <td>Бренд</td>
                          <td>{product.brand.name}</td>
                        </tr>
                      )}
                      {Object.entries(product.specifications || {}).slice(0, 5).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Price & Actions */}
              <div className="product-detail-page__info-right">
                <div className="product-detail-page__price-row">
                  <span className="product-detail-page__price">
                    {Number(product.final_price).toLocaleString("ru-RU")} ₽
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="product-detail-page__old-price">
                        {Number(product.price).toLocaleString("ru-RU")} ₽
                      </span>
                      <span className="product-detail-page__discount-badge-new">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="product-detail-page__cart-button"
                >
                  <ShoppingCart size={20} />
                  Добавить в корзину
                </Button>

                <button
                  className="product-detail-page__wishlist-button"
                  onClick={handleAddToWishlist}
                >
                  <Heart size={20} />
                  В избранное
                </button>

                {/* Status Items */}
                <div className="product-detail-page__status-list">
                  {product.in_stock && (
                    <div className="product-detail-page__status-item">
                      <Check size={20} className="product-detail-page__status-icon" />
                      <span>В наличии</span>
                    </div>
                  )}

                  <div className="product-detail-page__status-item">
                    <Truck size={20} className="product-detail-page__status-icon-green" />
                    <span>Доставка за 1 - 2 дня</span>
                  </div>

                  <div className="product-detail-page__status-item">
                    <Check size={20} className="product-detail-page__status-icon-green" />
                    <span>Гарантия {product.warranty_months >= 12 ? `${product.warranty_months / 12} ${product.warranty_months === 12 ? 'год' : 'лет'}` : `${product.warranty_months} мес.`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="product-detail-page__mobile-layout">
            <ProductImageGallery images={product.images} productName={product.name} />
            <MobileProductInfo
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onSpecsClick={() => setActiveTab("specifications")}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="product-detail-page__tabs-section">
          <div className="product-detail-page__tabs">
            <button
              className={`product-detail-page__tab ${
                activeTab === "description" ? "product-detail-page__tab--active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              Описание
            </button>
            <button
              className={`product-detail-page__tab ${
                activeTab === "specifications" ? "product-detail-page__tab--active" : ""
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Характеристики
            </button>
            <button
              className={`product-detail-page__tab ${
                activeTab === "reviews" ? "product-detail-page__tab--active" : ""
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Отзывы ({reviews.length})
            </button>
          </div>

          <div className="product-detail-page__tab-content">
            {activeTab === "description" && (
              <div className="product-detail-page__description">
                <h3>{product.name}</h3>
                {product.country_of_origin && (
                  <div className="product-detail-page__description-meta">
                    <strong>Страна производителя:</strong> {product.country_of_origin}
                  </div>
                )}
                {product.warranty_months && (
                  <div className="product-detail-page__description-meta">
                    <strong>Гарантия:</strong> {product.warranty_months >= 12 ? `${product.warranty_months / 12} ${product.warranty_months === 12 ? 'год' : 'лет'}` : `${product.warranty_months} месяцев`} от производителя
                  </div>
                )}
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="product-detail-page__specifications">
                <h3>Все характеристики</h3>
                <table className="product-detail-page__specs-table">
                  <tbody>
                    {product.brand && (
                      <tr>
                        <td>Бренд</td>
                        <td>{product.brand.name}</td>
                      </tr>
                    )}
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                    {product.country_of_origin && (
                      <tr>
                        <td>Страна бренда</td>
                        <td>{product.country_of_origin}</td>
                      </tr>
                    )}
                    {product.sku && (
                      <tr>
                        <td>Артикул</td>
                        <td>{product.sku}</td>
                      </tr>
                    )}
                    {product.warranty_months && (
                      <tr>
                        <td>Гарантия</td>
                        <td>{product.warranty_months >= 12 ? `${product.warranty_months / 12} ${product.warranty_months === 12 ? 'год' : 'лет'}` : `${product.warranty_months} месяцев`}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="product-detail-page__reviews">
                <div className="product-detail-page__reviews-header">
                  <h3>Отзывы ({reviews.length})</h3>
                  <Button
                    variant="primary"
                    onClick={() => setShowReviewForm(true)}
                  >
                    Написать отзыв
                  </Button>
                </div>

                {/* Review Form Drawer */}
                <ReviewFormDrawer
                  isOpen={showReviewForm}
                  onClose={handleCancelReview}
                  onSubmit={async (rating, comment) => {
                    if (!product) return;
                    
                    try {
                      if (editingReview) {
                        await reviewsApi.partialUpdate(editingReview.id, { rating, comment });
                        showToast("Отзыв обновлен!", "success");
                      } else {
                        await reviewsApi.create({
                          product: product.id,
                          rating,
                          comment,
                        });
                        showToast("Отзыв добавлен!", "success");
                      }

                      loadReviews(product.id);
                      setShowReviewForm(false);
                      setEditingReview(null);
                      setReviewFormData({ rating: 5, comment: "" });
                    } catch (err: unknown) {
                      console.error("Error submitting review:", err);
                      if (err && typeof err === 'object' && 'response' in err) {
                        const error = err as { response?: { status?: number; data?: { detail?: string } } };
                        if (error.response?.status === 401) {
                          showToast("Войдите в систему для добавления отзыва", "error");
                          window.dispatchEvent(new CustomEvent("openLoginModal"));
                        } else if (error.response?.data?.detail) {
                          showToast(error.response.data.detail, "error");
                        } else {
                          showToast("Ошибка при сохранении отзыва", "error");
                        }
                      } else {
                        showToast("Ошибка при сохранении отзыва", "error");
                      }
                    }
                  }}
                  initialRating={reviewFormData.rating}
                  initialComment={reviewFormData.comment}
                  isEditing={!!editingReview}
                />

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="product-detail-page__reviews-loading">Загрузка отзывов...</div>
                ) : reviews.length > 0 ? (
                  <div className="product-detail-page__reviews-list">
                    {reviews.map((review) => {
                      const isOwnReview = currentUserEmail && review.user.email === currentUserEmail;

                      return (
                        <div key={review.id} className="product-detail-page__review">
                          <div className="product-detail-page__review-header">
                            <div className="product-detail-page__review-rating">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  fill={i < review.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                            <div className="product-detail-page__review-meta">
                              <span className="product-detail-page__review-author">
                                {review.user.email}
                              </span>
                              {review.is_verified_purchase && (
                                <span className="product-detail-page__review-verified">
                                  ✓ Подтвержденная покупка
                                </span>
                              )}
                              <span className="product-detail-page__review-date">
                                {new Date(review.created_at).toLocaleDateString("ru-RU")}
                              </span>
                            </div>
                            {isOwnReview && (
                              <div className="product-detail-page__review-actions">
                                <button
                                  className="product-detail-page__review-action-btn"
                                  onClick={() => handleEditReview(review)}
                                  aria-label="Редактировать"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  className="product-detail-page__review-action-btn product-detail-page__review-action-btn--delete"
                                  onClick={() => handleDeleteReview(review.id)}
                                  aria-label="Удалить"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="product-detail-page__review-comment">{review.comment}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="product-detail-page__no-reviews">Пока нет отзывов. Будьте первым!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <SimilarProductsSlider
            products={similarProducts}
            onAddToCart={async (id) => {
              try {
                await cartApi.addItem({ product_id: id, quantity: 1 });
                showToast("Товар добавлен в корзину!", "success");
                window.dispatchEvent(new Event('cartUpdated'));
              } catch (err: unknown) {
                if (err && typeof err === 'object' && 'response' in err) {
                  const error = err as { response?: { status?: number } };
                  if (error.response?.status === 401) {
                    showToast("Войдите в систему", "error");
                    window.dispatchEvent(new CustomEvent("openLoginModal"));
                  } else {
                    showToast("Ошибка при добавлении в корзину", "error");
                  }
                } else {
                  showToast("Ошибка при добавлении в корзину", "error");
                }
              }
            }}
            onAddToWishlist={async (id) => {
              try {
                await wishlistApi.add({ product_id: id });
                showToast("Товар добавлен в избранное!", "success");
              } catch (err: unknown) {
                if (err && typeof err === 'object' && 'response' in err) {
                  const error = err as { response?: { status?: number } };
                  if (error.response?.status === 401) {
                    showToast("Войдите в систему", "error");
                    window.dispatchEvent(new CustomEvent("openLoginModal"));
                  } else {
                    showToast("Ошибка при добавлении в избранное", "error");
                  }
                } else {
                  showToast("Ошибка при добавлении в избранное", "error");
                }
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
