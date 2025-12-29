import React from 'react';

import { Badge } from '../../../../ui/Badge';
import * as S from '../styles';
import type { ProductBadgesProps } from '../types';

export const ProductBadges: React.FC<ProductBadgesProps> = ({
  discountPercentage,
  isOutOfStock,
}) => {
  if (isOutOfStock) {
    return (
      <S.BadgeContainer>
        <Badge variant="default">Out of Stock</Badge>
      </S.BadgeContainer>
    );
  }

  if (discountPercentage > 0) {
    return (
      <S.BadgeContainer>
        <Badge variant="danger">-{discountPercentage}%</Badge>
      </S.BadgeContainer>
    );
  }

  return null;
};