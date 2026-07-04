import { api } from "./axios";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RegisterData {
  id: string;
  name: string;
  email: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse<LoginData>>("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse<RegisterData>>("/auth/register", {
      name,
      email,
      password,
    }),

  logout: () => api.get<AuthResponse<null>>("/auth/logout"),
};
