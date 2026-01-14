export interface Room {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  order: number;
  is_active: boolean;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface RoomDetail extends Room {
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    description: string;
    room_ids: number[];
    image: string | null;
    order: number;
    is_active: boolean;
    products_count: number;
  }>;
}