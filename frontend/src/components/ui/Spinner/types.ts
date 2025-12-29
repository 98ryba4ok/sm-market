export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps {
  /**
   * Размер спиннера
   * @default 'md'
   */
  size?: SpinnerSize;
  
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

export interface LoadingOverlayProps {
  /**
   * Сообщение для отображения под спиннером
   */
  message?: string;
}

export interface LoadingInlineProps {
  /**
   * Сообщение для отображения рядом со спиннером
   * @default 'Loading...'
   */
  message?: string;
}