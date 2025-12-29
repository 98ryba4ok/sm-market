import { User } from 'lucide-react';
import React from 'react';

import { Button } from '../../../ui/Button';
import { ICON_SIZE } from '../constants';
import * as S from '../styles';
import type { UserMenuProps } from '../types';

/**
 * Меню пользователя
 */
export const UserMenu: React.FC<UserMenuProps> = ({
  isAuthenticated,
  user,
  onAuthClick,
}) => {
  if (isAuthenticated && user) {
    return (
      <S.UserLink to="/orders">
        <User size={ICON_SIZE} />
        <S.UserName>{user.first_name || user.email}</S.UserName>
      </S.UserLink>
    );
  }

  return (
    <div style={{ display: 'none' }} className="sm:block">
      <Button variant="primary" size="sm" onClick={onAuthClick}>
        Sign In
      </Button>
    </div>
  );
};