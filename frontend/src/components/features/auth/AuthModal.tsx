import React from 'react';

import { useUIStore } from '../../../store/uiStore';
import { Modal } from '../../ui/Modal';

import { LoginForm } from './LoginForm/LoginForm';
import { RegisterForm } from './RegisterForm/RegisterForm';

type AuthMode = 'login' | 'register';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal } = useUIStore();
  const [mode, setMode] = React.useState<AuthMode>('login');

  // Reset mode when modal closes
  React.useEffect(() => {
    if (!isAuthModalOpen) {
      setMode('login');
    }
  }, [isAuthModalOpen]);

  const handleSuccess = () => {
    closeAuthModal();
  };

  const handleSwitchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={mode === 'login' ? 'Sign In' : 'Create Account'}
      size="sm"
    >
      {mode === 'login' ? (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToRegister={handleSwitchMode}
        />
      ) : (
        <RegisterForm
          onSuccess={handleSuccess}
          onSwitchToLogin={handleSwitchMode}
        />
      )}
    </Modal>
  );
};