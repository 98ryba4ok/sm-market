import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { itemsCount, openCart } = useCartStore();
  const { productIds } = useWishlistStore();
  const { isMobileMenuOpen, toggleMobileMenu, openAuthModal } = useUIStore();

  const handleAuthClick = () => {
    openAuthModal('login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SM</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              SM Market
            </span>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Heart className="w-6 h-6 text-gray-700" />
              {productIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {productIds.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* User menu */}
            {isAuthenticated && user ? (
              <Link
                to="/orders"
                className="hidden sm:flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-6 h-6 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  {user.first_name || user.email}
                </span>
              </Link>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAuthClick}
                className="hidden sm:flex"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar - Mobile */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6 py-3 border-t border-gray-100">
          <Link
            to="/products"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            All Products
          </Link>
          <Link
            to="/products?category=electronics"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Electronics
          </Link>
          <Link
            to="/products?category=clothing"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Clothing
          </Link>
          <Link
            to="/products?category=home"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Home & Garden
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              to="/products"
              className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMobileMenu}
            >
              All Products
            </Link>
            <Link
              to="/products?category=electronics"
              className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMobileMenu}
            >
              Electronics
            </Link>
            <Link
              to="/products?category=clothing"
              className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMobileMenu}
            >
              Clothing
            </Link>
            <Link
              to="/products?category=home"
              className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMobileMenu}
            >
              Home & Garden
            </Link>
            
            {isAuthenticated && user ? (
              <Link
                to="/orders"
                className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2 border-t border-gray-200 mt-2 pt-4"
                onClick={toggleMobileMenu}
              >
                My Orders
              </Link>
            ) : (
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  handleAuthClick();
                  toggleMobileMenu();
                }}
                className="mt-2"
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};