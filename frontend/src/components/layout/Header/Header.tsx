import { ChevronDown, Heart, LogOut, Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authApi } from "../../../api/authApi";
import { cartApi } from "../../../api/cartApi";
import categoryLogo from "../../../assets/categoryLogo.svg";
import logo from "../../../assets/logo.svg";
import { LoginModal } from "../../features/auth/LoginModal/LoginModal";
import { RegisterModal } from "../../features/auth/RegisterModal/RegisterModal";
import "./Header.css";

export const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

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
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await authApi.logout({ refresh: refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Очищаем данные в любом случае
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      setIsAuthenticated(false);
      setUserEmail(null);
      setShowUserMenu(false);
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
          <div className="header__logo-catalog-wrapper">
            {/* Logo */}
            <Link to="/" className="header__logo">
              <div className="header__logo-box">
                <img className="header__logo-text" src={logo} alt="CM" />
              </div>
            </Link>

            {/* Catalog Button */}
            <Link to="/catalog" className="header__catalog-btn">
              <img src={categoryLogo} alt="" />
              <span className="header__catalog-text">Каталог</span>
            </Link>
          </div>

          {/* Search */}
          <div className="header__search">
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

          {/* Actions */}
          <div className="header__actions">
            {isAuthenticated ? (
              <div className="header__user-menu">
                <button
                  className="header__user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User size={20} />
                  <span className="header__user-email">{userEmail}</span>
                  <ChevronDown size={16} />
                </button>
                {showUserMenu && (
                  <div className="header__user-dropdown">
                    <Link
                      to="/profile"
                      className="header__user-dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={18} />
                      Мой профиль
                    </Link>
                    <Link
                      to="/orders"
                      className="header__user-dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <ShoppingCart size={18} />
                      Мои заказы
                    </Link>
                    <button className="header__user-dropdown-item" onClick={handleLogout}>
                      <LogOut size={18} />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="header__action-link header__action-btn"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <User size={20} />
                  <span className="header__action-text">Войти</span>
                </button>
                {/* <button
                  className="header__action-link header__action-btn header__register-btn"
                  onClick={() => setIsRegisterModalOpen(true)}
                >
                  <span className="header__action-text">Регистрация</span>
                </button> */}
              </>
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
        </div>
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
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
    </header>
  );
};
