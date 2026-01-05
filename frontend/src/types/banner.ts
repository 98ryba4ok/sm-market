/**
 * Типы для баннеров главной страницы
 */

export interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string | null;
  button_text: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
