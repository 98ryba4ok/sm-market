import type { ModalSize } from './types';

export const DEFAULT_SIZE: ModalSize = 'md';
export const DEFAULT_SHOW_CLOSE_BUTTON = true;
export const DEFAULT_CLOSE_ON_OVERLAY_CLICK = true;
export const DEFAULT_IS_LOADING = false;
export const DEFAULT_CONFIRM_TEXT = 'Confirm';
export const DEFAULT_CANCEL_TEXT = 'Cancel';
export const DEFAULT_VARIANT = 'primary' as const;

export const MODAL_SIZES: Record<ModalSize, string> = {
  sm: '28rem', // max-w-md
  md: '32rem', // max-w-lg
  lg: '42rem', // max-w-2xl
  xl: '56rem', // max-w-4xl
};

export const MODAL_ARIA_LABELS = {
  closeButton: 'Close modal',
} as const;

export const ESCAPE_KEY = 'Escape';
export const MAX_CONTENT_HEIGHT = 'calc(100vh - 200px)';