// Consultation API

import api from "./axios";

export interface ConsultationRequestPayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
}

export interface ConsultationRequestResponse {
  id: number;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultationCreateResponse {
  detail: string;
  data: ConsultationRequestResponse;
}

export const consultationApi = {
  /**
   * Создать заявку на консультацию
   * POST /api/catalog/consultation-requests/
   */
  create: (data: ConsultationRequestPayload) =>
    api.post<ConsultationCreateResponse>("/catalog/consultation-requests/", data),
};
