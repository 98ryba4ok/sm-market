export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps {
  /**
   * Текущее значение рейтинга
   */
  value: number;
  
  /**
   * Максимальное значение рейтинга
   * @default 5
   */
  max?: number;
  
  /**
   * Размер звезд
   * @default 'md'
   */
  size?: RatingSize;
  
  /**
   * Показывать числовое значение рядом со звездами
   * @default false
   */
  showValue?: boolean;
  
  /**
   * Режим только для чтения (без возможности изменения)
   * @default true
   */
  readonly?: boolean;
  
  /**
   * Callback при изменении рейтинга
   */
  onChange?: (value: number) => void;
  
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

export interface RatingCompactProps {
  /**
   * Значение рейтинга для отображения
   */
  value: number;
  
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}