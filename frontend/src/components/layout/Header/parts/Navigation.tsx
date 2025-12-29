import React from 'react';

import * as S from '../styles';
import type { NavigationProps } from '../types';

/**
 * Навигационное меню
 */
export const Navigation: React.FC<NavigationProps> = ({ items, onItemClick }) => {
  return (
    <S.Nav>
      {items.map((item) => (
        <S.NavLink
          key={item.to}
          to={item.to}
          onClick={onItemClick}
        >
          {item.label}
        </S.NavLink>
      ))}
    </S.Nav>
  );
};