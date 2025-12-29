import React from 'react';

import { Rating } from '../../../../ui/Rating';
import * as S from '../styles';
import type { ProductInfoProps } from '../types';

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <S.ContentContainer>
      {/* Category */}
      {product.category && (
        <S.CategoryText>{product.category.name}</S.CategoryText>
      )}

      {/* Product Name */}
      <S.ProductName>{product.name}</S.ProductName>

      {/* Rating */}
      {product.average_rating && product.reviews_count ? (
        <S.RatingContainer>
          <Rating value={product.average_rating} readonly size="sm" />
          <S.ReviewCount>({product.reviews_count})</S.ReviewCount>
        </S.RatingContainer>
      ) : null}
    </S.ContentContainer>
  );
};