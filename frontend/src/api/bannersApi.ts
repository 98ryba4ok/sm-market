import axios from "./axios";
import type { Banner } from "../types";

/**
 * API для работы с баннерами главной страницы
 */

export const bannersApi = {
  /**
   * Получить список активных баннеров
   */
  list: () => axios.get<Banner[]>("/catalog/banners/"),

  /**
   * Получить конкретный баннер по ID
   */
  retrieve: (id: number) => axios.get<Banner>(`/catalog/banners/${id}/`),
};
