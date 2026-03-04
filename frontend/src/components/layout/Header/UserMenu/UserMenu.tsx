import { User, ShoppingCart, LogOut, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";

import { performLogout } from "../../../../utils/auth";
import "./UserMenu.css";

interface UserMenuProps {
  userEmail: string | null;
  onLogout: () => void;
}

export const UserMenu = ({ userEmail, onLogout }: UserMenuProps) => {
  const handleLogout = async () => {
    try {
      performLogout();
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="user-menu__trigger">
          <User size={20} />
          <span className="user-menu__email">{userEmail}</span>
          <ChevronDown size={16} className="user-menu__chevron" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="user-menu__content" sideOffset={8} align="end">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <DropdownMenu.Item asChild>
              <Link to="/profile" className="user-menu__item">
                <User size={18} />
                <span>Мой профиль</span>
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link to="/orders" className="user-menu__item">
                <ShoppingCart size={18} />
                <span>Мои заказы</span>
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="user-menu__separator" />

            <DropdownMenu.Item
              className="user-menu__item user-menu__item--danger"
              onSelect={handleLogout}
            >
              <LogOut size={18} />
              <span>Выйти</span>
            </DropdownMenu.Item>
          </motion.div>

          <DropdownMenu.Arrow className="user-menu__arrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};