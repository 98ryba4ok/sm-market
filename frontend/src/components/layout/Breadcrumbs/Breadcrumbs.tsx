import { ChevronRight, Home } from 'lucide-react';
import React from 'react';

import { BREADCRUMB_ARIA_LABEL, CURRENT_PAGE_ARIA, HOME_ARIA_LABEL, ICON_SIZE } from './constants';
import * as S from './styles';
import type { BreadcrumbsProps } from './types';

/**
 * Компонент хлебных крошек для навигации
 * 
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { label: 'Products', href: '/products' },
 *     { label: 'Electronics', href: '/products?category=electronics' },
 *     { label: 'Laptop' }
 *   ]}
 * />
 * ```
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <S.BreadcrumbNav aria-label={BREADCRUMB_ARIA_LABEL} className={className}>
      {/* Home Link */}
      <S.HomeLink to="/" aria-label={HOME_ARIA_LABEL}>
        <Home size={ICON_SIZE} />
      </S.HomeLink>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {/* Separator */}
            <S.Separator aria-hidden="true">
              <ChevronRight size={ICON_SIZE} />
            </S.Separator>

            {/* Breadcrumb Item */}
            {isLast || !item.href ? (
              <S.CurrentPage aria-current={CURRENT_PAGE_ARIA}>
                {item.label}
              </S.CurrentPage>
            ) : (
              <S.BreadcrumbLink to={item.href}>
                {item.label}
              </S.BreadcrumbLink>
            )}
          </React.Fragment>
        );
      })}
    </S.BreadcrumbNav>
  );
};