import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { tokens } from '../../../../theme/tokens';

import { PRODUCT_CARD_CONSTANTS } from './constants';

export const StyledProductCard = styled(Link)`
  display: block;
  background: ${tokens.colors.background.primary};
  border: 1px solid ${tokens.colors.border.default};
  border-radius: ${tokens.borderRadius.lg};
  transition: all ${tokens.transitions.base};

  &:hover {
    border-color: ${tokens.colors.border.hover};
    box-shadow: ${tokens.shadows.lg};
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: ${PRODUCT_CARD_CONSTANTS.IMAGE_ASPECT_RATIO};
  overflow: hidden;
  border-radius: ${tokens.borderRadius.lg} ${tokens.borderRadius.lg} 0 0;
  background: ${tokens.colors.background.secondary};
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${PRODUCT_CARD_CONSTANTS.TRANSITION_DURATION} ease-in-out;

  ${StyledProductCard}:hover & {
    transform: scale(1.05);
  }
`;

export const BadgeContainer = styled.div`
  position: absolute;
  top: ${tokens.spacing[2]};
  left: ${tokens.spacing[2]};
`;

export const WishlistButtonContainer = styled.div`
  position: absolute;
  top: ${tokens.spacing[2]};
  right: ${tokens.spacing[2]};
`;

export const WishlistButtonStyled = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing[2]};
  background: ${tokens.colors.background.primary};
  border: none;
  border-radius: ${tokens.borderRadius.full};
  box-shadow: ${tokens.shadows.md};
  color: ${({ $isActive }) => ($isActive ? tokens.colors.status.error : tokens.colors.text.tertiary)};
  cursor: pointer;
  transition: all ${tokens.transitions.base};

  &:hover {
    box-shadow: ${tokens.shadows.lg};
    color: ${tokens.colors.status.error};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ContentContainer = styled.div`
  padding: ${tokens.spacing[4]};
`;

export const CategoryText = styled.p`
  font-size: ${tokens.typography.fontSize.xs};
  color: ${tokens.colors.text.tertiary};
  margin-bottom: ${tokens.spacing[1]};
`;

export const ProductName = styled.h3`
  font-size: ${tokens.typography.fontSize.base};
  font-weight: ${tokens.typography.fontWeight.medium};
  color: ${tokens.colors.text.primary};
  margin-bottom: ${tokens.spacing[2]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color ${tokens.transitions.fast};

  ${StyledProductCard}:hover & {
    color: ${tokens.colors.primary[600]};
  }
`;

export const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[2]};
  margin-bottom: ${tokens.spacing[2]};
`;

export const ReviewCount = styled.span`
  font-size: ${tokens.typography.fontSize.xs};
  color: ${tokens.colors.text.tertiary};
`;

export const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${tokens.spacing[2]};
  margin-bottom: ${tokens.spacing[3]};
`;

export const CurrentPrice = styled.span<{ $hasDiscount?: boolean }>`
  font-size: ${tokens.typography.fontSize.lg};
  font-weight: ${tokens.typography.fontWeight.bold};
  color: ${({ $hasDiscount }) =>
    $hasDiscount ? tokens.colors.primary[600] : tokens.colors.text.primary};
`;

export const OriginalPrice = styled.span`
  font-size: ${tokens.typography.fontSize.sm};
  color: ${tokens.colors.text.tertiary};
  text-decoration: line-through;
`;