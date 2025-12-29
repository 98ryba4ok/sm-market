import { forwardRef } from 'react';

import { CARD_DEFAULTS } from './constants';
import { StyledCard } from './styles';
import type { CardProps } from './types';

/**
 * Компонент карточки с поддержкой различных вариантов и отступов
 * 
 * @example
 * ```tsx
 * // Базовое использование
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content here</CardContent>
 *   <CardFooter>Footer content</CardFooter>
 * </Card>
 * 
 * // С рамкой
 * <Card variant="bordered">Content</Card>
 * 
 * // С тенью
 * <Card variant="elevated">Content</Card>
 * 
 * // С эффектом при наведении
 * <Card hoverable>Content</Card>
 * 
 * // Без отступов
 * <Card padding="none">Content</Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = CARD_DEFAULTS.variant,
      padding = CARD_DEFAULTS.padding,
      hoverable = CARD_DEFAULTS.hoverable,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledCard
        ref={ref}
        $variant={variant}
        $padding={padding}
        $hoverable={hoverable}
        {...props}
      >
        {children}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';