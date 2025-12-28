import type {
  LoginPayload,
  RegisterPayload,
  TokenResponse,
  User,
} from "../types/user";

import api from "./axios";


export const userApi = {
  login: (data: LoginPayload) =>
    api.post<TokenResponse>("/auth/login/", data),

  register: (data: RegisterPayload) =>
    api.post("/auth/register/", data),

  me: () =>
    api.get<User>("/auth/me/"),
};
