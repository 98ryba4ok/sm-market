import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import { productsApi } from "../../api/productsApi";
import { categoriesApi } from "../../api/categoriesApi";
import { cartApi } from "../../api/cartApi";
import { wishlistApi } from "../../api/wishlistApi";
import { CategoryFilter } from "../../components/catalog/CategoryFilter/CategoryFilter";
import { ProductCard } from "../../components/ui/ProductCard/ProductCard";
import { useToast } from "../../contexts/ToastContext";
import type { ProductListItem, ProductFilters } from "../../types/product";
import type { CategoryListItem } from "../../types/category";
import "./CatalogPage.css";

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ordering, setOrdering] = useState<string>("-created_at");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.list();
        setCategories(response.data.results);
      } catch (err) {
        console.error("Ошибка загрузки категорий:", err);
      }
    };

    fetchCategories();
  }, []);

  // Обработка параметров category и search из URL
  useEffect(() => {
    const categorySlug = searchParams.get("category");
    const searchParam = searchParams.get("search");

    // Обработка категории
    if (categorySlug && categories.length > 0) {
      // Находим категорию по slug
      const allCategories: CategoryListItem[] = [];
      categories.forEach((cat) => {
        allCategories.push(cat);
        if (cat.subcategories) {
          allCategories.push(...cat.subcategories);
        }
      });

      const foundCategory = allCategories.find((cat) => cat.slug === categorySlug);
      if (foundCategory && !selectedCategories.includes(foundCategory.id)) {
        setSelectedCategories([foundCategory.id]);
      }
    } else if (!categorySlug && selectedCategories.length > 0) {
      // Если параметра category нет, но есть выбранные категории, очищаем их
      setSelectedCategories([]);
    }

    // Обработка поиска - всегда синхронизируем с URL
    const newSearchQuery = searchParam || "";
    if (newSearchQuery !== searchQuery) {
      setSearchQuery(newSearchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, categories]);

  // Загрузка товаров с учетом фильтров
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const filters: ProductFilters = {};

        // Получаем slug первой выбранной категории (бэкенд поддерживает только одну)
        if (selectedCategories.length > 0) {
          const allCategories: CategoryListItem[] = [];
          categories.forEach((cat) => {
            allCategories.push(cat);
            if (cat.subcategories) {
              allCategories.push(...cat.subcategories);
            }
          });

          const firstCategory = allCategories.find(
            (cat) => cat.id === selectedCategories[0]
          );
          if (firstCategory) {
            filters.category = firstCategory.slug;
          }
        }

        if (searchQuery) {
          filters.search = searchQuery;
        }

        if (ordering && ordering !== "-created_at") {
          filters.ordering = ordering;
        }

        const response = await productsApi.list(filters);
        setProducts(response.data.results);
      } catch (err) {
        console.error("Ошибка загрузки товаров:", err);
        setError("Не удалось загрузить товары");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, searchQuery, ordering, categories]);

  const handleToggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) => {
      // Если категория уже выбрана, снимаем выбор
      if (prev.includes(categoryId)) {
        return [];
      }
      // Иначе выбираем только эту категорию (заменяя предыдущую)
      return [categoryId];
    });

    // Очищаем параметр category из URL при изменении фильтров
    if (searchParams.has("category")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("category");
      setSearchParams(newParams);
    }
  };

  const handleRemoveCategory = (categoryId: number) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));

    // Очищаем параметр category из URL
    if (searchParams.has("category")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("category");
      setSearchParams(newParams);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");

    // Очищаем параметр search из URL
    if (searchParams.has("search")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("search");
      setSearchParams(newParams);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await cartApi.addItem({ product_id: productId, quantity: 1 });
      showToast("Товар добавлен в корзину!", "success");
      // Уведомляем Header об обновлении корзины
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      console.error("Ошибка добавления в корзину:", err);
      if (err.response?.status === 401) {
        showToast("Войдите в систему для добавления товара в корзину", "error");
        navigate("/login");
      } else {
        showToast("Не удалось добавить товар в корзину", "error");
      }
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      await wishlistApi.add({ product_id: productId });
      showToast("Товар добавлен в избранное!", "success");
    } catch (err: any) {
      console.error("Ошибка добавления в избранное:", err);
      if (err.response?.status === 401) {
        showToast("Войдите в систему для добавления товара в избранное", "error");
        navigate("/login");
      } else if (err.response?.status === 400 && err.response?.data?.detail?.includes("уже в списке")) {
        showToast("Товар уже в избранном", "info");
      } else {
        showToast("Не удалось добавить товар в избранное", "error");
      }
    }
  };

  // Получаем имена выбранных категорий для отображения чипов
  const getSelectedCategoryNames = () => {
    const allCategories: CategoryListItem[] = [];
    categories.forEach((cat) => {
      allCategories.push(cat);
      if (cat.subcategories) {
        allCategories.push(...cat.subcategories);
      }
    });

    return selectedCategories
      .map((id) => allCategories.find((cat) => cat.id === id))
      .filter((cat): cat is CategoryListItem => cat !== undefined);
  };

  const selectedCategoryNames = getSelectedCategoryNames();

  return (
    <div className="catalog-page">
      <div className="catalog-page__container">
        {/* Боковая панель с фильтрами */}
        <aside className="catalog-page__sidebar">
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
          />
        </aside>

        {/* Основной контент */}
        <main className="catalog-page__main">
          <h1 className="catalog-page__title">
            {searchQuery
              ? `Результаты поиска: "${searchQuery}"`
              : selectedCategoryNames.length > 0
              ? selectedCategoryNames[0].name
              : "Каталог"}
          </h1>

          {/* Панель сортировки */}
          <div className="catalog-page__sort-panel">
            <span className="catalog-page__sort-label">Сортировка:</span>
            <div className="catalog-page__sort-buttons">
              <button
                className={`catalog-page__sort-button ${
                  ordering === "price" ? "catalog-page__sort-button--active" : ""
                }`}
                onClick={() => setOrdering("price")}
              >
                Цена: по возрастанию
              </button>
              <button
                className={`catalog-page__sort-button ${
                  ordering === "-price" ? "catalog-page__sort-button--active" : ""
                }`}
                onClick={() => setOrdering("-price")}
              >
                Цена: по убыванию
              </button>
              <button
                className={`catalog-page__sort-button ${
                  ordering === "-discount_percentage"
                    ? "catalog-page__sort-button--active"
                    : ""
                }`}
                onClick={() => setOrdering("-discount_percentage")}
              >
                По размеру скидки
              </button>
            </div>
          </div>

          {/* Активные фильтры */}
          {(selectedCategoryNames.length > 0 || searchQuery) && (
            <div className="catalog-page__active-filters">
              {/* Поисковый запрос */}
              {searchQuery && (
                <button
                  className="catalog-page__filter-chip catalog-page__filter-chip--search"
                  onClick={handleClearSearch}
                >
                  <span>Поиск: {searchQuery}</span>
                  <X size={16} strokeWidth={2.5} />
                </button>
              )}

              {/* Категории */}
              {selectedCategoryNames.map((category) => (
                <button
                  key={category.id}
                  className="catalog-page__filter-chip"
                  onClick={() => handleRemoveCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <X size={16} strokeWidth={2.5} />
                </button>
              ))}
            </div>
          )}

          {/* Сетка товаров */}
          {isLoading ? (
            <div className="catalog-page__loading">Загрузка товаров...</div>
          ) : error ? (
            <div className="catalog-page__error">{error}</div>
          ) : products.length === 0 ? (
            <div className="catalog-page__empty">Товары не найдены</div>
          ) : (
            <div className="catalog-page__grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
