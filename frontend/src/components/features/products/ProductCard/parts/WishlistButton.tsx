import { Heart } from 'lucide-react';
import React from 'react';

import * as S from '../styles';
import type { WishlistButtonProps } from '../types';

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  isInWishlist,
  onToggle,
}) => {
  return (
    <S.WishlistButtonContainer>
      <S.WishlistButtonStyled
        onClick={onToggle}
        $isActive={isInWishlist}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
      </S.WishlistButtonStyled>
    </S.WishlistButtonContainer>
  );
};