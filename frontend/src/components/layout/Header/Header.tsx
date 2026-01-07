import { ChevronDown, Heart, LogOut, Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { authApi } from "../../../api/authApi";
import categoryLogo from "../../../assets/categoryLogo.svg";
import logo from "../../../assets/logo.svg";
import { LoginModal } from "../../features/auth/LoginModal/LoginModal";
import { RegisterModal } from "../../features/auth/RegisterModal/RegisterModal";
import "./Header.css";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
  }, []);

  const handleLoginSuccess = () => {
    const storedEmail = localStorage.getItem("userEmail");
    setIsAuthenticated(true);
    setUserEmail(storedEmail);
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
            <button className="header__catalog-btn">
              <img src={categoryLogo} alt="" />
              <span className="header__catalog-text">Каталог</span>
            </button>
          </div>

          {/* Search */}
          <div className="header__search">
            <div className="header__search-wrapper">
              <input
                type="text"
                placeholder="Найти товары"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header__search-input"
              />
              <button className="header__search-btn">
                <Search size={20} />
              </button>
            </div>
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

            <Link to="/cart" className="header__action-link header__action-link--icon-only">
              <ShoppingCart size={20} />
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
