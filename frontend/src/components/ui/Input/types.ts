import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Метка поля ввода
   */
  label?: string;
  
  /**
   * Сообщение об ошибке
   */
  error?: string;
  
  /**
   * Вспомогательный текст
   */
  helperText?: string;
  
  /**
   * Иконка слева от поля ввода
   */
  leftIcon?: ReactNode;
  
  /**
   * Иконка справа от поля ввода
   */
  rightIcon?: ReactNode;
  
  /**
   * Растянуть поле на всю ширину
   * @default false
   */
  fullWidth?: boolean;
}