// Promo codes API

import api from "./axios";
import type { PromoCodeValidation } from "../types/promo";

export const promoApi = {
  /**
   * Проверить промокод
   * POST /api/promo-codes/validate/
   */
  validate: (code: string, cartTotal: string) =>
    api.post<PromoCodeValidation>("/promo-codes/validate/", {
      code,
      cart_total: cartTotal,
    }),
};
