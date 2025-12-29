import { X } from 'lucide-react';
import React from 'react';

import { MODAL_ARIA_LABELS } from '../constants';
import * as S from '../styles';

interface ModalHeaderProps {
  title?: string;
  description?: string;
  showCloseButton: boolean;
  onClose: () => void;
}

/**
 * Заголовок модалки с кнопкой закрытия
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  description,
  showCloseButton,
  onClose,
}) => {
  if (!title && !showCloseButton) {
    return null;
  }

  return (
    <S.Header>
      <S.HeaderContent>
        {title && (
          <S.Title id="modal-title">{title}</S.Title>
        )}
        {description && (
          <S.Description id="modal-description">{description}</S.Description>
        )}
      </S.HeaderContent>
      {showCloseButton && (
        <S.CloseButton
          onClick={onClose}
          aria-label={MODAL_ARIA_LABELS.closeButton}
        >
          <X size={20} />
        </S.CloseButton>
      )}
    </S.Header>
  );
};