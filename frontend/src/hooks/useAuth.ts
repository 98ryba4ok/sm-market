import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import * as authApi from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import type { LoginCredentials, RegisterData } from '../types/user';
import { queryKeys } from '../utils/queryKeys';

/**
 * Custom hook for authentication operations
 * Manages login, register, logout, and user profile
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, login: setLogin, logout: setLogout, setUser } = useAuthStore();
  const { clearCart } = useCartStore();
  const { clearWishlist } = useWishlistStore();

  // Fetch user profile
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: authApi.getUserProfile,
    enabled: isAuthenticated && !!authApi.getAccessToken(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: async (data) => {
      // Fetch user profile after successful login
      try {
        const userProfile = await authApi.getUserProfile();
        setLogin(userProfile);
        toast.success('Вы успешно вошли в систему');
        navigate('/');
      } catch (error) {
        toast.error('Ошибка при загрузке профиля');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Ошибка входа';
      toast.error(message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: async () => {
      // Fetch user profile after successful registration
      try {
        const userProfile = await authApi.getUserProfile();
        setLogin(userProfile);
        toast.success('Регистрация прошла успешно');
        navigate('/');
      } catch (error) {
        toast.error('Ошибка при загрузке профиля');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Ошибка регистрации';
      toast.error(message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setLogout();
      clearCart();
      clearWishlist();
      queryClient.clear();
      toast.success('Вы вышли из системы');
      navigate('/');
    },
    onError: () => {
      // Logout locally even if API call fails
      setLogout();
      clearCart();
      clearWishlist();
      queryClient.clear();
      navigate('/');
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateUserProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      toast.success('Профиль обновлен');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Ошибка обновления профиля';
      toast.error(message);
    },
  });

  return {
    // State
    user: profile || user,
    isAuthenticated,
    isLoading: isLoadingProfile || loginMutation.isPending || registerMutation.isPending,
    
    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    
    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
};