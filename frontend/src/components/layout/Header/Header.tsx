import { Search, User, Heart, ShoppingCart} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import "./Header.css";
import logo from "../../../assets/logo.png";
import categoryLogo from "../../../assets/categoryLogo.svg";
export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__content">
          <div  className="header__logo-catalog-wrapper">
          {/* Logo */}
          <Link to="/" className="header__logo">
          <img className="header__logo-icon" src={logo} alt="Logo" />
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
            <Link to="/login" className="header__action-link">
              <User size={20} />
              <span className="header__action-text">Войти</span>
            </Link>

            <Link to="/wishlist" className="header__action-link header__action-link--icon-only">
              <Heart size={20} />
              {/* Badge example */}
              {/* <span className="header__badge">3</span> */}
            </Link>

            <Link to="/cart" className="header__action-link header__action-link--icon-only">
              <ShoppingCart size={20} />
              {/* <span className="header__badge">5</span> */}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
