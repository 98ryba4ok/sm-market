import React from 'react';

import { Button } from '../Button';

import { ICON_SIZE } from './constants';
import * as S from './styles';
import type { EmptyStateProps } from './types';

/**
 * Компонент для отображения пустых состояний
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon={ShoppingCart}
 *   title="Your cart is empty"
 *   description="Add some items to get started"
 *   action={{
 *     label: "Start Shopping",
 *     onClick: () => navigate('/products')
 *   }}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <S.EmptyStateContainer className={className}>
      {Icon && (
        <S.IconContainer>
          <Icon size={ICON_SIZE} />
        </S.IconContainer>
      )}
      
      <S.Title>{title}</S.Title>
      
      {description && (
        <S.Description>{description}</S.Description>
      )}
      
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </S.EmptyStateContainer>
  );
};