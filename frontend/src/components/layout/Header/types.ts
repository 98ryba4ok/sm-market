export interface HeaderProps {
  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

export interface LogoProps {
  /**
   * Показывать текст логотипа
   * @default true
   */
  showText?: boolean;
}

export interface SearchBarProps {
  /**
   * Placeholder для поиска
   * @default 'Search products...'
   */
  placeholder?: string;
  
  /**
   * Callback при изменении значения
   */
  onChange?: (value: string) => void;
  
  /**
   * Callback при отправке формы
   */
  onSubmit?: (value: string) => void;
}

export interface NavLinkItem {
  label: string;
  to: string;
}

export interface NavigationProps {
  /**
   * Элементы навигации
   */
  items: NavLinkItem[];
  
  /**
   * Callback при клике на элемент (для мобильного меню)
   */
  onItemClick?: () => void;
}

export interface UserMenuProps {
  /**
   * Авторизован ли пользователь
   */
  isAuthenticated: boolean;
  
  /**
   * Данные пользователя
   */
  user?: {
    first_name?: string;
    email: string;
  } | null;
  
  /**
   * Callback при клике на кнопку входа
   */
  onAuthClick: () => void;
}

export interface IconButtonProps {
  /**
   * Иконка
   */
  icon: React.ReactNode;
  
  /**
   * Количество элементов (badge)
   */
  count?: number;
  
  /**
   * Цвет badge
   * @default 'primary'
   */
  badgeColor?: 'primary' | 'danger';
  
  /**
   * Callback при клике
   */
  onClick?: () => void;
  
  /**
   * Ссылка (если это Link, а не button)
   */
  to?: string;
  
  /**
   * Aria label
   */
  ariaLabel?: string;
}