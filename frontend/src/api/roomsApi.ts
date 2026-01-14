import type { Room, RoomDetail } from '../types/room';

import axios from './axios';

export interface RoomsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Room[];
}

export interface RoomCategoriesResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  order: number;
  is_active: boolean;
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
    created_at: string;
    updated_at: string;
  }>;
}

/**
 * Get list of all rooms
 */
export const getRooms = async (): Promise<RoomsResponse> => {
  const response = await axios.get<RoomsResponse>('/catalog/rooms/');
  return response.data;
};

/**
 * Get room details by slug
 */
export const getRoomBySlug = async (slug: string): Promise<RoomDetail> => {
  const response = await axios.get<RoomDetail>(`/catalog/rooms/${slug}/`);
  return response.data;
};

/**
 * Get room with its categories
 */
export const getRoomCategories = async (slug: string): Promise<RoomCategoriesResponse> => {
  const response = await axios.get<RoomCategoriesResponse>(`/catalog/rooms/${slug}/categories/`);
  return response.data;
};