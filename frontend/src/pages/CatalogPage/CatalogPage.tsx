import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { brandsApi } from "../../api/brandsApi";
import { cartApi } from "../../api/cartApi";
import { categoriesApi } from "../../api/categoriesApi";
import { productsApi } from "../../api/productsApi";
import { getRoomCategories, getRooms } from "../../api/roomsApi";
import { wishlistApi } from "../../api/wishlistApi";
import { CategoryFilter } from "../../components/catalog/CategoryFilter/CategoryFilter";
import { ProductFilters } from "../../components/catalog/ProductFilters/ProductFilters";
import { ProductCard } from "../../components/ui/ProductCard/ProductCard";
import { useToast } from "../../contexts/ToastContext";
import type { Brand } from "../../types";
import type { CategoryListItem } from "../../types/category";
import type { ProductFilters as ProductFiltersType, ProductListItem } from "../../types/product";
import type { Room } from "../../types/room";
import "./CatalogPage.css";

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  
  // Данные
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  // Фильтры
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ordering, setOrdering] = useState<string>("-created_at");
  
  // Фильтры цены и прочее
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [inStock, setInStock] = useState<boolean>(false);
  const [onSale, setOnSale] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка помещений и брендов при монтировании
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms();
        setRooms(response.results);
      } catch (err) {
        console.error("Ошибка загрузки помещений:", err);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await brandsApi.list();
        setBrands(response.data);
      } catch (err) {
        console.error("Ошибка загрузки брендов:", err);
      }
    };

    fetchRooms();
    fetchBrands();
  }, []);

  // Загрузка категорий при изменении выбранного помещения
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (selectedRoom) {
          // Загружаем категории выбранного помещения
          const response = await getRoomCategories(selectedRoom);
          setCategories(response.categories);
        } else {
          // Загружаем все категории
          const response = await categoriesApi.list();
          setCategories(response.data.results);
        }
      } catch (err) {
        console.error("Ошибка загрузки категорий:", err);
      }
    };

    fetchCategories();
    // Сбрасываем выбранные категории при смене помещения
    setSelectedCategories([]);
  }, [selectedRoom]);

  // Синхронизация с URL параметрами
  useEffect(() => {
    const roomParam = searchParams.get("room");
    const categoryParam = searchParams.get("category");
    const labelParam = searchParams.get("label");
    const searchParam = searchParams.get("search");

    // Синхронизация помещения
    if (roomParam !== selectedRoom) {
      setSelectedRoom(roomParam);
    }

    // Синхронизация поиска
    const newSearchQuery = searchParam || "";
    if (newSearchQuery !== searchQuery) {
      setSearchQuery(newSearchQuery);
    }

    // Синхронизация лейбла
    if (labelParam && !selectedLabels.includes(labelParam)) {
      setSelectedLabels([labelParam]);
    } else if (!labelParam && selectedLabels.length > 0) {
      setSelectedLabels([]);
    }

    // Синхронизация категории
    if (categoryParam && categories.length > 0) {
      const foundCategory = categories.find((cat) => cat.slug === categoryParam);
      if (foundCategory && !selectedCategories.includes(foundCategory.id)) {
        setSelectedCategories([foundCategory.id]);
      }
    } else if (!categoryParam && selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, categories]);

  // Загрузка товаров при изменении фильтров
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const filters: ProductFiltersType = {};

        // Фильтр по помещению
        if (selectedRoom) {
          filters.room = selectedRoom;
        }

        // Фильтр по категории
        if (selectedCategories.length > 0) {
          const category = categories.find((cat) => cat.id === selectedCategories[0]);
          if (category) {
            filters.category = category.slug;
          }
        }

        // Фильтр по лейблам (берем первый, так как backend поддерживает только один)
        if (selectedLabels.length > 0) {
          filters.label = selectedLabels[0];
        }

        // Поиск
        if (searchQuery) {
          filters.search = searchQuery;
        }

        // Сортировка
        if (ordering && ordering !== "-created_at") {
          filters.ordering = ordering;
        }

        // Фильтры цены
        if (minPrice !== undefined) {
          filters.min_price = minPrice;
        }
        if (maxPrice !== undefined) {
          filters.max_price = maxPrice;
        }

        // Дополнительные фильтры
        if (inStock) {
          filters.in_stock = true;
        }
        if (onSale) {
          filters.on_sale = true;
        }
        if (minRating !== undefined) {
          filters.min_rating = minRating;
        }

        // Фильтр по брендам
        if (selectedBrands.length > 0) {
          filters.brand = selectedBrands.length === 1 ? selectedBrands[0] : selectedBrands;
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
  }, [
    selectedRoom,
    selectedCategories,
    selectedLabels,
    searchQuery,
    ordering,
    categories,
    minPrice,
    maxPrice,
    inStock,
    onSale,
    minRating,
    selectedBrands,
  ]);

  // Обработчики
  const handleSelectRoom = (roomSlug: string | null) => {
    setSelectedRoom(roomSlug);
    
    const newParams = new URLSearchParams(searchParams);
    if (roomSlug) {
      newParams.set("room", roomSlug);
    } else {
      newParams.delete("room");
    }
    // Сбрасываем категорию при смене помещения
    newParams.delete("category");
    setSearchParams(newParams);
  };

  const handleToggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [categoryId];
      }
    });

    // Обновляем URL
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      const newParams = new URLSearchParams(searchParams);
      if (selectedCategories.includes(categoryId)) {
        newParams.delete("category");
      } else {
        newParams.set("category", category.slug);
      }
      setSearchParams(newParams);
    }
  };

  const handleRemoveCategory = (categoryId: number) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("category");
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    setSearchParams(newParams);
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await cartApi.addItem({ product_id: productId, quantity: 1 });
      showToast("Товар добавлен в корзину!", "success");
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error("Ошибка добавления в корзину:", err);
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 401) {
        showToast("Войдите в систему для добавления товара в корзину", "error");
        window.dispatchEvent(new CustomEvent("openLoginModal"));
      } else {
        showToast("Не удалось добавить товар в корзину", "error");
      }
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      await wishlistApi.add({ product_id: productId });
      showToast("Товар добавлен в избранное!", "success");
    } catch (err) {
      console.error("Ошибка добавления в избранное:", err);
      const error = err as { response?: { status?: number; data?: { detail?: string } } };
      if (error.response?.status === 401) {
        showToast("Войдите в систему для добавления товара в избранное", "error");
        window.dispatchEvent(new CustomEvent("openLoginModal"));
      } else if (error.response?.status === 400 && error.response?.data?.detail?.includes("уже в списке")) {
        showToast("Товар уже в избранном", "info");
      } else {
        showToast("Не удалось добавить товар в избранное", "error");
      }
    }
  };

  // Получаем имена для отображения
  const selectedRoomName = selectedRoom ? rooms.find(r => r.slug === selectedRoom)?.name : null;
  const selectedCategoryNames = selectedCategories
    .map((id) => categories.find((cat) => cat.id === id))
    .filter((cat): cat is CategoryListItem => cat !== undefined);

  return (
    <div className="catalog-page">
      <div className="catalog-page__container">
        {/* Боковая панель с фильтрами */}
        <aside className="catalog-page__sidebar">
          <CategoryFilter
            rooms={rooms}
            selectedRoom={selectedRoom}
            categories={categories}
            selectedCategories={selectedCategories}
            onSelectRoom={handleSelectRoom}
            onToggleCategory={handleToggleCategory}
          />
          <ProductFilters
            brands={brands}
            rooms={rooms}
            minPrice={minPrice}
            maxPrice={maxPrice}
            inStock={inStock}
            onSale={onSale}
            minRating={minRating}
            selectedRoom={selectedRoom}
            selectedLabels={selectedLabels}
            selectedBrands={selectedBrands}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onInStockChange={setInStock}
            onSaleChange={setOnSale}
            onMinRatingChange={setMinRating}
            onRoomChange={handleSelectRoom}
            onLabelsChange={setSelectedLabels}
            onBrandsChange={setSelectedBrands}
          />
        </aside>

        {/* Основной контент */}
        <main className="catalog-page__main">
          <h1 className="catalog-page__title">
            {searchQuery
              ? `Результаты поиска: "${searchQuery}"`
              : selectedCategoryNames.length > 0
              ? selectedCategoryNames[0].name
              : selectedRoomName
              ? selectedRoomName
              : "Каталог"}
          </h1>

          {/* Поле поиска */}
          <div className="catalog-page__search">
            <Search className="catalog-page__search-icon" size={20} />
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="catalog-page__search-input"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="catalog-page__search-clear"
              >
                <X size={18} />
              </button>
            )}
          </div>

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
              <button
                className={`catalog-page__sort-button ${
                  ordering === "-orders_count"
                    ? "catalog-page__sort-button--active"
                    : ""
                }`}
                onClick={() => setOrdering("-orders_count")}
              >
                По популярности
              </button>
            </div>
          </div>

          {/* Активные фильтры */}
          {(selectedRoomName || selectedCategoryNames.length > 0 || searchQuery) && (
            <div className="catalog-page__active-filters">
              {/* Помещение */}
              {selectedRoomName && (
                <button
                  className="catalog-page__filter-chip"
                  onClick={() => handleSelectRoom(null)}
                >
                  <span>{selectedRoomName}</span>
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
