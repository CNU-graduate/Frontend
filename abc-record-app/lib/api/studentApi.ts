import { apiClient } from "./client";

export type StudentResponse = {
  studentId: number;
  name: string;
  grade?: number | null;
  birthDate: string;
  iepSummary?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
};

export type StudentPageResponse = {
  content: StudentResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type CreateStudentRequest = {
  name: string;
  grade?: number;
  birthDate: string;
  iepSummary?: string;
  metadata?: Record<string, unknown>;
};

export type UpdateStudentRequest = {
  grade?: number | null;
  iepSummary?: string | null;
  metadata?: Record<string, unknown> | null;
};

export function getStudents(params: {
  search?: string;
  page?: number;
  size?: number;
} = {}) {
  const searchParams = new URLSearchParams({
    page: String(params.page ?? 0),
    size: String(params.size ?? 20),
  });

  if (params.search) {
    searchParams.set("search", params.search);
  }

  return apiClient.get<StudentPageResponse>(
    `/api/v1/students?${searchParams.toString()}`,
  );
}

export function getStudent(studentId: number | string) {
  return apiClient.get<StudentResponse>(`/api/v1/students/${studentId}`);
}

export function createStudent(request: CreateStudentRequest) {
  return apiClient.post<StudentResponse>("/api/v1/students", request);
}

export function updateStudent(
  studentId: number | string,
  request: UpdateStudentRequest,
) {
  return apiClient.patch<StudentResponse>(
    `/api/v1/students/${studentId}`,
    request,
  );
}

export function deleteStudent(studentId: number | string) {
  return apiClient.delete<null>(`/api/v1/students/${studentId}`);
}
