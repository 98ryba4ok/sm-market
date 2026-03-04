import { Home, Package, Heart, ClipboardList, User, LogOut, X, ShoppingCart, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

import { performLogout } from "../../../../utils/auth";
import "./MobileMenu.css";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userEmail: string | null;
  onOpenLoginModal?: () => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  isAuthenticated,
  userEmail,
  onOpenLoginModal,
}: MobileMenuProps) => {
  const handleLogout = async () => {
    try {
      performLogout();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-menu__overlay" asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </Dialog.Overlay>
        <Dialog.Content className="mobile-menu__content" asChild>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="mobile-menu__header">
              <h2 className="mobile-menu__title">Меню</h2>
              <Dialog.Close className="mobile-menu__close-btn">
                <X size={24} />
              </Dialog.Close>
            </div>

            <nav className="mobile-menu__nav">
              <Link to="/" className="mobile-menu__item" onClick={onClose}>
                <Home size={20} />
                <span>Главная</span>
              </Link>

              <Link to="/catalog" className="mobile-menu__item" onClick={onClose}>
                <Package size={20} />
                <span>Каталог</span>
              </Link>

              <Link to="/wishlist" className="mobile-menu__item" onClick={onClose}>
                <Heart size={20} />
                <span>Избранное</span>
              </Link>

              <Link to="/orders" className="mobile-menu__item" onClick={onClose}>
                <ClipboardList size={20} />
                <span>Мои заказы</span>
              </Link>

              <Link to="/cart" className="mobile-menu__item" onClick={onClose}>
                <ShoppingCart size={20} />
                <span>Корзина</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="mobile-menu__item" onClick={onClose}>
                    <User size={20} />
                    <span>Профиль</span>
                  </Link>

                  <button className="mobile-menu__item mobile-menu__item--logout" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Выйти</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="mobile-menu__item"
                    onClick={() => {
                      onOpenLoginModal?.();
                      onClose();
                    }}
                  >
                    <LogIn size={20} />
                    <span>Войти в аккаунт</span>
                  </button>
                </>
              )}
            </nav>

            {isAuthenticated && userEmail && (
              <div className="mobile-menu__user-info">
                <User size={16} />
                <span>{userEmail}</span>
              </div>
            )}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};