import React from 'react';

import { Button } from '../../Button';
import {
    DEFAULT_CANCEL_TEXT,
    DEFAULT_CONFIRM_TEXT,
    DEFAULT_IS_LOADING,
    DEFAULT_VARIANT,
} from '../constants';
import { Modal } from '../Modal';
import type { ConfirmModalProps } from '../types';

/**
 * Модалка подтверждения действия
 * 
 * @example
 * ```tsx
 * <ConfirmModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onConfirm={handleDelete}
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item?"
 *   variant="danger"
 * />
 * ```
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = DEFAULT_CONFIRM_TEXT,
  cancelText = DEFAULT_CANCEL_TEXT,
  variant = DEFAULT_VARIANT,
  isLoading = DEFAULT_IS_LOADING,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      {/* Пустой children - описание показывается в заголовке */}
      <></>
    </Modal>
  );
};