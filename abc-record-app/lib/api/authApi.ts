import { apiCall, storeTokens } from "./client";

export type Teacher = {
  teacherId: number;
  email: string;
  name: string;
  schoolName?: string;
  role: "TEACHER" | "ADMIN";
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  teacher: Teacher;
};

export async function login(data: { email: string; password: string }) {
  const response = await apiCall<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  storeTokens(response);
  return response;
}

export async function signup(data: {
  email: string;
  password: string;
  name: string;
  schoolName?: string;
}) {
  const response = await apiCall<AuthResponse>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
  storeTokens(response);
  return response;
}

export async function getMe() {
  return apiCall<Teacher>("/api/v1/auth/me");
}
