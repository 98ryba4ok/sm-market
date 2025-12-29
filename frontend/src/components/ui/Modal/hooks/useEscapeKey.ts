import { useEffect } from 'react';

import { ESCAPE_KEY } from '../constants';

/**
 * Хук для обработки нажатия клавиши Escape
 */
export const useEscapeKey = (isActive: boolean, onEscape: () => void) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === ESCAPE_KEY && isActive) {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isActive, onEscape]);
};