import React from 'react';

import * as S from '../styles';
import type { ProductImageProps } from '../types';

export const ProductImage: React.FC<ProductImageProps> = ({ src, alt }) => {
  return (
    <S.ImageContainer>
      <S.ProductImage src={src} alt={alt} loading="lazy" />
    </S.ImageContainer>
  );
};