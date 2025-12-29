import { create } from 'zustand';

interface UIState {
  // Modals
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  
  // Filters sidebar
  isFiltersSidebarOpen: boolean;
  
  // Loading states
  isGlobalLoading: boolean;
  
  // Actions
  openAuthModal: (mode: 'login' | 'register') => void;
  closeAuthModal: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openMobileMenu: () => void;
  toggleFiltersSidebar: () => void;
  closeFiltersSidebar: () => void;
  openFiltersSidebar: () => void;
  setGlobalLoading: (loading: boolean) => void;
}

/**
 * UI store using Zustand
 * Manages global UI state (modals, drawers, loading states)
 */
export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isAuthModalOpen: false,
  authModalMode: 'login',
  isMobileMenuOpen: false,
  isFiltersSidebarOpen: false,
  isGlobalLoading: false,

  // Auth modal actions
  openAuthModal: (mode) => {
    set({ 
      isAuthModalOpen: true, 
      authModalMode: mode 
    });
  },

  closeAuthModal: () => {
    set({ isAuthModalOpen: false });
  },

  // Mobile menu actions
  toggleMobileMenu: () => {
    set((state) => ({ 
      isMobileMenuOpen: !state.isMobileMenuOpen 
    }));
  },

  closeMobileMenu: () => {
    set({ isMobileMenuOpen: false });
  },

  openMobileMenu: () => {
    set({ isMobileMenuOpen: true });
  },

  // Filters sidebar actions
  toggleFiltersSidebar: () => {
    set((state) => ({ 
      isFiltersSidebarOpen: !state.isFiltersSidebarOpen 
    }));
  },

  closeFiltersSidebar: () => {
    set({ isFiltersSidebarOpen: false });
  },

  openFiltersSidebar: () => {
    set({ isFiltersSidebarOpen: true });
  },

  // Global loading
  setGlobalLoading: (loading) => {
    set({ isGlobalLoading: loading });
  },
}));