import type { ReactNode } from 'react';

import type { ButtonVariant } from '../Button/types';

/**
 * Размеры модального окна
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Пропсы для Modal компонента
 */
export interface ModalProps {
  /** Открыто ли модальное окно */
  isOpen: boolean;
  
  /** Callback при закрытии */
  onClose: () => void;
  
  /** Заголовок модального окна */
  title?: string;
  
  /** Описание под заголовком */
  description?: string;
  
  /** Содержимое модального окна */
  children: ReactNode;
  
  /** Футер модального окна */
  footer?: ReactNode;
  
  /** Размер модального окна */
  size?: ModalSize;
  
  /** Закрывать ли при клике на overlay */
  closeOnOverlayClick?: boolean;
  
  /** Показывать ли кнопку закрытия */
  showCloseButton?: boolean;
  
  /** Дополнительный CSS класс */
  className?: string;
}

/**
 * Пропсы для ConfirmModal
 */
export interface ConfirmModalProps {
  /** Открыто ли модальное окно */
  isOpen: boolean;
  
  /** Callback при закрытии */
  onClose: () => void;
  
  /** Callback при подтверждении */
  onConfirm: () => void | Promise<void>;
  
  /** Заголовок */
  title: string;
  
  /** Описание/сообщение */
  description?: string;
  
  /** Текст кнопки подтверждения */
  confirmText?: string;
  
  /** Текст кнопки отмены */
  cancelText?: string;
  
  /** Вариант кнопки подтверждения (использует ButtonVariant) */
  variant?: ButtonVariant;
  
  /** Состояние загрузки */
  isLoading?: boolean;
}

/**
 * Пропсы для ModalHeader
 */
export interface ModalHeaderProps {
  /** Заголовок */
  title?: string;
  
  /** Описание */
  description?: string;
  
  /** Показывать ли кнопку закрытия */
  showCloseButton?: boolean;
  
  /** Callback при закрытии */
  onClose?: () => void;
}