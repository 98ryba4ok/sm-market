import React from 'react';

import { formatPrice } from '../../../../../utils/format';
import * as S from '../styles';
import type { ProductPriceProps } from '../types';

export const ProductPrice: React.FC<ProductPriceProps> = ({
  price,
  discountPrice,
}) => {
  return (
    <S.PriceContainer>
      {discountPrice ? (
        <>
          <S.CurrentPrice $hasDiscount>
            {formatPrice(discountPrice)}
          </S.CurrentPrice>
          <S.OriginalPrice>{formatPrice(price)}</S.OriginalPrice>
        </>
      ) : (
        <S.CurrentPrice>{formatPrice(price)}</S.CurrentPrice>
      )}
    </S.PriceContainer>
  );
};