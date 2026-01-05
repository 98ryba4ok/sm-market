
export interface User {
  id: number;
  email: string;
  phone: string;
}


export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  phone: string;
  password: string;
}


export interface TokenResponse {
  access: string;
  refresh: string;
}
