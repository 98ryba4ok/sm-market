import React from 'react';

import { Button } from '../../../ui/Button';
import * as S from '../styles';
import type { NavigationProps, UserMenuProps } from '../types';

interface MobileMenuProps extends NavigationProps {
  isOpen: boolean;
  userMenuProps: UserMenuProps;
}

/**
 * Мобильное меню
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  items,
  onItemClick,
  userMenuProps,
}) => {
  if (!isOpen) return null;

  const { isAuthenticated, user, onAuthClick } = userMenuProps;

  return (
    <S.MobileMenu>
      <S.MobileNav>
        {items.map((item) => (
          <S.MobileNavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
          >
            {item.label}
          </S.MobileNavLink>
        ))}

        <S.MobileUserSection>
          {isAuthenticated && user ? (
            <S.MobileNavLink to="/orders" onClick={onItemClick}>
              My Orders
            </S.MobileNavLink>
          ) : (
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                onAuthClick();
                onItemClick?.();
              }}
            >
              Sign In
            </Button>
          )}
        </S.MobileUserSection>
      </S.MobileNav>
    </S.MobileMenu>
  );
};