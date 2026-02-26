import { Search, X, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";

import { productsApi } from "../../../../api/productsApi";
import type { ProductListItem } from "../../../../types";
import "./SearchModal.css";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductListItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to parse search history:", error);
      }
    }
  }, []);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search products with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const response = await productsApi.list({ search: searchQuery.trim() });
          setSearchResults(response.data.results.slice(0, 5)); // Show only first 5 results
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Save to search history
    const newHistoryItem: SearchHistoryItem = {
      query: query.trim(),
      timestamp: Date.now(),
    };

    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.query !== query.trim());
      const updated = [newHistoryItem, ...filtered].slice(0, 10); // Keep only last 10 searches
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      return updated;
    });

    // Navigate to catalog with search query
    navigate(`/catalog?search=${encodeURIComponent(query.trim())}`);
    onClose();
    setSearchQuery("");
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const handleRemoveHistoryItem = (query: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item.query !== query);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="search-modal__overlay" asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </Dialog.Overlay>
        <Dialog.Content className="search-modal__content" asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="search-modal__header">
              <div className="search-modal__search-wrapper">
                <Search className="search-modal__search-icon" size={20} />
                <form onSubmit={handleSubmit} className="search-modal__form">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Поиск товаров..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-modal__input"
                  />
                </form>
                {searchQuery && (
                  <button
                    className="search-modal__clear-btn"
                    onClick={() => setSearchQuery("")}
                    aria-label="Очистить поиск"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <Dialog.Close className="search-modal__close-btn">
                <X size={24} />
              </Dialog.Close>
            </div>

            <div className="search-modal__body">
              {searchQuery.trim().length >= 2 ? (
                // Search Results
                <div className="search-modal__results">
                  {isSearching ? (
                    <div className="search-modal__loading">Поиск...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="search-modal__results-header">
                        <h3>Результаты поиска</h3>
                        <span className="search-modal__results-count">
                          {searchResults.length} товаров
                        </span>
                      </div>
                      <div className="search-modal__results-list">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            className="search-modal__result-item"
                            onClick={() => handleSearch(product.name)}
                          >
                            <div className="search-modal__result-info">
                              <span className="search-modal__result-name">
                                {product.name}
                              </span>
                              <span className="search-modal__result-price">
                                {Number(product.final_price).toLocaleString("ru-RU")} ₽
                              </span>
                            </div>
                            <ArrowRight size={16} className="search-modal__result-arrow" />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="search-modal__empty">
                      <Search size={48} />
                      <p>Ничего не найдено</p>
                      <span>Попробуйте изменить поисковый запрос</span>
                    </div>
                  )}
                </div>
              ) : (
                // Search History
                searchHistory.length > 0 && (
                  <div className="search-modal__history">
                    <div className="search-modal__history-header">
                      <h3>
                        <Clock size={16} />
                        История поиска
                      </h3>
                      <button
                        className="search-modal__clear-history"
                        onClick={handleClearHistory}
                      >
                        Очистить
                      </button>
                    </div>
                    <div className="search-modal__history-list">
                      {searchHistory.map((item) => (
                        <button
                          key={item.query}
                          className="search-modal__history-item"
                          onClick={() => handleSearch(item.query)}
                        >
                          <Search size={16} />
                          <span>{item.query}</span>
                          <button
                            className="search-modal__history-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveHistoryItem(item.query);
                            }}
                            aria-label="Удалить из истории"
                          >
                            <X size={14} />
                          </button>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};