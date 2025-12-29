import React from 'react';

import {
    DEFAULT_CLOSE_ON_OVERLAY_CLICK,
    DEFAULT_SHOW_CLOSE_BUTTON,
    DEFAULT_SIZE,
} from './constants';
import { useBodyScrollLock, useEscapeKey } from './hooks';
import { ModalHeader } from './parts';
import * as S from './styles';
import type { ModalProps } from './types';

/**
 * Универсальный компонент модального окна
 * 
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Modal Title"
 *   description="Modal description"
 *   size="md"
 *   footer={
 *     <>
 *       <Button variant="ghost" onClick={handleClose}>Cancel</Button>
 *       <Button variant="primary" onClick={handleSubmit}>Submit</Button>
 *     </>
 *   }
 * >
 *   <p>Modal content goes here</p>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = DEFAULT_SIZE,
  showCloseButton = DEFAULT_SHOW_CLOSE_BUTTON,
  closeOnOverlayClick = DEFAULT_CLOSE_ON_OVERLAY_CLICK,
  footer,
}) => {
  // Блокируем скролл body при открытии модалки
  useBodyScrollLock(isOpen);
  
  // Закрываем модалку по Escape
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <S.Overlay
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <S.ModalContainer
        $size={size}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader
          title={title}
          description={description}
          showCloseButton={showCloseButton}
          onClose={onClose}
        />

        <S.Content>{children}</S.Content>

        {footer && <S.Footer>{footer}</S.Footer>}
      </S.ModalContainer>
    </S.Overlay>
  );
};