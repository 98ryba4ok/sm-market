import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, ShoppingCart, ChevronRight, Star, Edit2, Trash2, X } from "lucide-react";
import { productsApi } from "../../api/productsApi";
import { reviewsApi } from "../../api/reviewsApi";
import { cartApi } from "../../api/cartApi";
import { wishlistApi } from "../../api/wishlistApi";
import { Button } from "../../components/ui/Button/Button";
import { ProductCard } from "../../components/ui/ProductCard/ProductCard";
import type { Product, ProductReview, ProductListItem } from "../../types";
import "./ProductDetailPage.css";

export const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
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
  const [similarLoading, setSimilarLoading] = useState(false);

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
        setSelectedImage(mainImg?.image || response.data.images[0]?.image || "");

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
      alert("Товар добавлен в корзину!");
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      if (err.response?.status === 401) {
        alert("Войдите в систему для добавления товара в корзину");
        navigate("/login");
      } else {
        alert("Ошибка при добавлении в корзину");
      }
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

    try {
      await wishlistApi.add({ product_id: product.id });
      alert("Товар добавлен в избранное!");
    } catch (err: any) {
      console.error("Error adding to wishlist:", err);
      if (err.response?.status === 401) {
        alert("Войдите в систему для добавления товара в избранное");
        navigate("/login");
      } else {
        alert("Ошибка при добавлении в избранное");
      }
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      if (editingReview) {
        // Update existing review
        await reviewsApi.partialUpdate(editingReview.id, reviewFormData);
        alert("Отзыв обновлен!");
      } else {
        // Create new review
        await reviewsApi.create({
          product: product.id,
          rating: reviewFormData.rating,
          comment: reviewFormData.comment,
        });
        alert("Отзыв добавлен!");
      }

      // Reload reviews
      loadReviews(product.id);

      // Reset form
      setShowReviewForm(false);
      setEditingReview(null);
      setReviewFormData({ rating: 5, comment: "" });
    } catch (err: any) {
      console.error("Error submitting review:", err);
      if (err.response?.status === 401) {
        alert("Войдите в систему для добавления отзыва");
        navigate("/login");
      } else if (err.response?.data?.detail) {
        alert(err.response.data.detail);
      } else {
        alert("Ошибка при сохранении отзыва");
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
      alert("Отзыв удален!");
      if (product) loadReviews(product.id);
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Ошибка при удалении отзыва");
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
          {/* Left: Image Gallery */}
          <div className="product-detail-page__gallery">
            <div className="product-detail-page__main-image">
              {selectedImage && (
                <img src={selectedImage} alt={product.name} />
              )}
              {hasDiscount && (
                <div className="product-detail-page__discount-badge">
                  -{discountPercentage}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="product-detail-page__thumbnails">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    className={`product-detail-page__thumbnail ${
                      selectedImage === img.image ? "product-detail-page__thumbnail--active" : ""
                    }`}
                    onClick={() => setSelectedImage(img.image)}
                  >
                    <img src={img.image} alt={img.alt_text || product.name} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="product-detail-page__info">
            <h1 className="product-detail-page__title">{product.name}</h1>

            {product.sku && (
              <div className="product-detail-page__sku">
                Код товара: {product.sku}
              </div>
            )}

            {/* Rating */}
            {product.average_rating !== null && (
              <div className="product-detail-page__rating">
                <div className="product-detail-page__stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.round(product.average_rating || 0) ? "currentColor" : "none"}
                    />
                  ))}
                  <span>{product.average_rating.toFixed(1)}</span>
                  <span className="product-detail-page__reviews-count">
                    ({product.reviews_count} {product.reviews_count === 1 ? 'отзыв' : 'отзывов'})
                  </span>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="product-detail-page__price-section">
              <div className="product-detail-page__price-wrapper">
                <span className="product-detail-page__price">
                  {Number(product.final_price).toLocaleString("ru-RU")} ₽
                </span>
                {hasDiscount && (
                  <>
                    <span className="product-detail-page__old-price">
                      {Number(product.price).toLocaleString("ru-RU")} ₽
                    </span>
                    <span className="product-detail-page__discount-percent">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="product-detail-page__actions">
              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                style={{ flex: 1 }}
              >
                <ShoppingCart size={20} />
                {product.in_stock ? "Добавить в корзину" : "Нет в наличии"}
              </Button>
              <button
                className="product-detail-page__wishlist-btn"
                onClick={handleAddToWishlist}
                aria-label="В избранное"
              >
                <Heart size={20} />
              </button>
            </div>

            {/* Status */}
            {product.in_stock ? (
              <div className="product-detail-page__stock-status product-detail-page__stock-status--in">
                ✓ В наличии
              </div>
            ) : (
              <div className="product-detail-page__stock-status product-detail-page__stock-status--out">
                ✗ Нет в наличии
              </div>
            )}

            {/* Delivery & Warranty */}
            <div className="product-detail-page__meta">
              <div className="product-detail-page__meta-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <path d="M16 8h5l3 3v5h-2"></path>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>Доставка 1-2 дня</span>
              </div>
              <div className="product-detail-page__meta-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Гарантия {product.warranty_months >= 12 ? `${product.warranty_months / 12} ${product.warranty_months === 12 ? 'год' : 'лет'}` : `${product.warranty_months} мес.`}</span>
              </div>
            </div>
          </div>

          {/* Brand Card (Right Sidebar) */}
          {product.brand && (
            <div className="product-detail-page__brand-card">
              <h3 className="product-detail-page__brand-title">{product.brand.name}</h3>
              {product.country_of_origin && (
                <div className="product-detail-page__brand-meta">
                  <strong>Страна производителя:</strong> {product.country_of_origin}
                </div>
              )}
              {product.brand.description && (
                <p className="product-detail-page__brand-description">
                  {product.brand.description}
                </p>
              )}
            </div>
          )}
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
                  {!showReviewForm && (
                    <Button
                      variant="primary"
                      onClick={() => setShowReviewForm(true)}
                    >
                      Написать отзыв
                    </Button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="product-detail-page__review-form">
                    <div className="product-detail-page__review-form-header">
                      <h4>{editingReview ? "Редактировать отзыв" : "Написать отзыв"}</h4>
                      <button
                        className="product-detail-page__review-form-close"
                        onClick={handleCancelReview}
                        aria-label="Закрыть"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <form onSubmit={handleSubmitReview}>
                      <div className="product-detail-page__form-group">
                        <label>Рейтинг:</label>
                        <div className="product-detail-page__rating-input">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              className="product-detail-page__rating-star"
                              onClick={() => setReviewFormData({ ...reviewFormData, rating: i + 1 })}
                            >
                              <Star
                                size={24}
                                fill={i < reviewFormData.rating ? "currentColor" : "none"}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="product-detail-page__form-group">
                        <label htmlFor="comment">Комментарий:</label>
                        <textarea
                          id="comment"
                          value={reviewFormData.comment}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                          rows={4}
                          required
                          placeholder="Расскажите о вашем опыте использования товара..."
                        />
                      </div>
                      <div className="product-detail-page__form-actions">
                        <Button type="submit" variant="primary">
                          {editingReview ? "Обновить отзыв" : "Отправить отзыв"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleCancelReview}>
                          Отмена
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

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
          <div className="product-detail-page__similar">
            <h2>Похожие товары</h2>
            {similarLoading ? (
              <div className="product-detail-page__similar-loading">Загрузка...</div>
            ) : (
              <div className="product-detail-page__similar-grid">
                {similarProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={async (id) => {
                      try {
                        await cartApi.addItem({ product_id: id, quantity: 1 });
                        alert("Товар добавлен в корзину!");
                      } catch (err: any) {
                        if (err.response?.status === 401) {
                          alert("Войдите в систему");
                          navigate("/login");
                        }
                      }
                    }}
                    onAddToWishlist={async (id) => {
                      try {
                        await wishlistApi.add({ product_id: id });
                        alert("Товар добавлен в избранное!");
                      } catch (err: any) {
                        if (err.response?.status === 401) {
                          alert("Войдите в систему");
                          navigate("/login");
                        }
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
