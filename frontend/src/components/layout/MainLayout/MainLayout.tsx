import React from 'react';

import { CartDrawer } from '../../features/cart';
import { Footer } from '../Footer';
import { Header } from '../Header';

import * as S from './styles';
import type { MainLayoutProps } from './types';

/**
 * Основной layout приложения с Header, Footer и CartDrawer
 * 
 * @example
 * ```tsx
 * <MainLayout>
 *   <YourPageContent />
 * </MainLayout>
 * ```
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  return (
    <S.LayoutContainer>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <S.Main className={className}>{children}</S.Main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />
    </S.LayoutContainer>
  );
};