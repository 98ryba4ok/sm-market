import { Heart, Menu, ShoppingCart, X } from 'lucide-react';
import React from 'react';

import { useAuthStore } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';
import { useUIStore } from '../../../store/uiStore';
import { useWishlistStore } from '../../../store/wishlistStore';

import { ARIA_LABELS, ICON_SIZE, NAV_ITEMS } from './constants';
import {
    IconButton,
    Logo,
    MobileMenu,
    Navigation,
    SearchBar,
    UserMenu,
} from './parts';
import * as S from './styles';
import type { HeaderProps } from './types';

/**
 * Главный заголовок приложения
 * 
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { itemsCount, openCart } = useCartStore();
  const { productIds } = useWishlistStore();
  const { isMobileMenuOpen, toggleMobileMenu, openAuthModal } = useUIStore();

  const handleAuthClick = () => {
    openAuthModal('login');
  };

  return (
    <S.HeaderContainer className={className}>
      <S.Container>
        {/* Top bar */}
        <S.TopBar>
          <Logo />

          {/* Search bar - Desktop */}
          <S.SearchContainer>
            <SearchBar />
          </S.SearchContainer>

          {/* Actions */}
          <S.Actions>
            {/* Wishlist */}
            <IconButton
              icon={<Heart size={ICON_SIZE} />}
              count={productIds.length}
              badgeColor="danger"
              to="/wishlist"
              ariaLabel={ARIA_LABELS.wishlist}
            />

            {/* Cart */}
            <IconButton
              icon={<ShoppingCart size={ICON_SIZE} />}
              count={itemsCount}
              badgeColor="primary"
              onClick={openCart}
              ariaLabel={ARIA_LABELS.cart}
            />

            {/* User menu */}
            <UserMenu
              isAuthenticated={isAuthenticated}
              user={user}
              onAuthClick={handleAuthClick}
            />

            {/* Mobile menu button */}
            <IconButton
              icon={
                isMobileMenuOpen ? (
                  <X size={ICON_SIZE} />
                ) : (
                  <Menu size={ICON_SIZE} />
                )
              }
              onClick={toggleMobileMenu}
              ariaLabel={ARIA_LABELS.toggleMenu}
            />
          </S.Actions>
        </S.TopBar>

        {/* Search bar - Mobile */}
        <S.MobileSearchContainer>
          <SearchBar />
        </S.MobileSearchContainer>

        {/* Navigation - Desktop */}
        <Navigation items={NAV_ITEMS} />
      </S.Container>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        items={NAV_ITEMS}
        onItemClick={toggleMobileMenu}
        userMenuProps={{
          isAuthenticated,
          user,
          onAuthClick: handleAuthClick,
        }}
      />
    </S.HeaderContainer>
  );
};