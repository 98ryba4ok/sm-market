import type { NavLinkItem } from './types';

export const DEFAULT_SEARCH_PLACEHOLDER = 'Search products...';
export const DEFAULT_SHOW_LOGO_TEXT = true;
export const DEFAULT_BADGE_COLOR = 'primary' as const;

export const HEADER_HEIGHT = '64px';
export const LOGO_SIZE = '32px';
export const ICON_SIZE = 24;
export const BADGE_SIZE = '20px';

export const NAV_ITEMS: NavLinkItem[] = [
  { label: 'All Products', to: '/products' },
  { label: 'Electronics', to: '/products?category=electronics' },
  { label: 'Clothing', to: '/products?category=clothing' },
  { label: 'Home & Garden', to: '/products?category=home' },
];

export const ARIA_LABELS = {
  toggleMenu: 'Toggle menu',
  search: 'Search',
  wishlist: 'Wishlist',
  cart: 'Shopping cart',
  user: 'User menu',
} as const;