import { Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authApi } from "../../../api/authApi";
import { cartApi } from "../../../api/cartApi";
import categoryLogo from "../../../assets/categoryLogo.svg";
import logo from "../../../assets/images/logo.jpg";
import { performLogout } from "../../../utils/auth";
import { LoginModal } from "../../features/auth/LoginModal/LoginModal";
import { PasswordResetModal } from "../../features/auth/PasswordResetModal/PasswordResetModal";
import { RegisterModal } from "../../features/auth/RegisterModal/RegisterModal";

import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";
import { UserMenu } from "./UserMenu";
import "./Header.css";

export const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    const checkAuth = () => {
      const accessToken = localStorage.getItem("accessToken");
      const storedEmail = localStorage.getItem("userEmail");

      if (accessToken && storedEmail) {
        setIsAuthenticated(true);
        setUserEmail(storedEmail);
      }
    };

    checkAuth();
    loadCartCount();
  }, []);

  const loadCartCount = async () => {
    try {
      const response = await cartApi.get();
      setCartItemsCount(response.data.total_items || 0);
    } catch (error) {
      console.error("Failed to load cart count:", error);
    }
  };

  // Обновляем количество товаров при изменении корзины
  useEffect(() => {
    const handleCartUpdate = () => {
      loadCartCount();
    };

    // Слушаем кастомное событие обновления корзины
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Слушаем событие открытия модалки логина (из axios interceptor)
  useEffect(() => {
    const handleOpenLoginModal = () => {
      setIsLoginModalOpen(true);
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal);

    return () => {
      window.removeEventListener('openLoginModal', handleOpenLoginModal);
    };
  }, []);

  // Слушаем событие logout для синхронизации состояния
  useEffect(() => {
    const handleUserLoggedOut = () => {
      console.log("[Header] userLoggedOut event received");
      setIsAuthenticated(false);
      setUserEmail(null);
      setCartItemsCount(0);
      console.log("[Header] State updated after logout");
    };

    window.addEventListener('userLoggedOut', handleUserLoggedOut);
    console.log("[Header] userLoggedOut event listener registered");

    return () => {
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, []);

  const handleLoginSuccess = () => {
    const storedEmail = localStorage.getItem("userEmail");
    setIsAuthenticated(true);
    setUserEmail(storedEmail);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    // Обновляем количество товаров в корзине после входа
    loadCartCount();
  };

  const handleLogout = async () => {
    console.log("[Header] handleLogout called");
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await authApi.logout({ refresh: refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Используем централизованную функцию logout
      performLogout();
      // Локальное состояние обновится через событие userLoggedOut
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__content">
          {/* Logo */}
          <Link to="/" className="header__logo">
            <div className="header__logo-box">
              <img className="header__logo-text" src={logo} alt="CM" />
            </div>
          </Link>

          {/* Search - Desktop */}
          <div className="header__search header__search--desktop">
            <form className="header__search-wrapper" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Найти товары"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="header__search-input"
              />
              <button type="submit" className="header__search-btn">
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Search - Mobile */}
          <div className="header__search header__search--mobile">
            <form className="header__search-wrapper" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="header__search-input"
              />
              <button type="submit" className="header__search-btn">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Actions - Desktop */}
          <div className="header__actions header__actions--desktop">
            {/* Catalog Button */}
            <Link to="/catalog" className="header__catalog-btn header__catalog-btn--desktop">
              <img src={categoryLogo} alt="" />
              <span className="header__catalog-text">Каталог</span>
            </Link>

            {isAuthenticated ? (
              <UserMenu userEmail={userEmail} onLogout={handleLogout} />
            ) : (
              <button
                className="header__action-link header__action-btn"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <span className="header__action-text">Войти</span>
              </button>
            )}

            <Link to="/wishlist" className="header__action-link header__action-link--icon-only">
              <Heart size={20} />
            </Link>

            <Link to="/cart" className="header__action-link header__action-link--icon-only header__cart-link">
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="header__badge">{cartItemsCount}</span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="header__mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onSwitchToPasswordReset={() => {
          setIsLoginModalOpen(false);
          setIsPasswordResetModalOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
      <PasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={() => setIsPasswordResetModalOpen(false)}
      />
    </header>
  );
};
