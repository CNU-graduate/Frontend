import { apiClient, storeTokens } from "./client";

export type Teacher = {
  teacherId: number;
  email: string;
  name: string;
  schoolName?: string | null;
  role: string;
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  teacher: Teacher;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = LoginRequest & {
  name: string;
  schoolName?: string;
};

export async function login(request: LoginRequest) {
  const result = await apiClient.post<AuthResponse>(
    "/api/v1/auth/login",
    request,
  );
  storeTokens(result);
  return result;
}

export async function signup(request: SignupRequest) {
  const result = await apiClient.post<AuthResponse>(
    "/api/v1/auth/signup",
    request,
  );
  storeTokens(result);
  return result;
}

export function getMe() {
  return apiClient.get<Teacher>("/api/v1/auth/me");
}
