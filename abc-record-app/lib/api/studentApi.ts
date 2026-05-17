import { apiCall } from "./client";

export type StudentSummary = {
  studentId: number;
  name: string;
  grade?: number;
  birthDate: string;
  iepSummary?: string;
};

export type StudentDetail = {
  studentId: number;
  name: string;
  grade?: number;
  birthDate: string;
  iepSummary?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type StudentResponse = StudentSummary | StudentDetail;

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export async function getStudents(params?: {
  search?: string;
  page?: number;
  size?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.search) searchParams.set("search", params.search);
  searchParams.set("page", String(params?.page ?? 0));
  searchParams.set("size", String(params?.size ?? 20));

  return apiCall<PageResponse<StudentSummary>>(
    `/api/v1/students?${searchParams.toString()}`,
  );
}

export async function getStudent(studentId: number) {
  return apiCall<StudentDetail>(`/api/v1/students/${studentId}`);
}

export async function createStudent(data: {
  name: string;
  grade?: number;
  birthDate: string;
  iepSummary?: string;
  metadata?: Record<string, unknown>;
}) {
  return apiCall<StudentDetail>("/api/v1/students", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStudent(
  studentId: number,
  data: {
    grade?: number;
    iepSummary?: string;
    metadata?: Record<string, unknown>;
  },
) {
  return apiCall<StudentDetail>(`/api/v1/students/${studentId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteStudent(studentId: number) {
  return apiCall<null>(`/api/v1/students/${studentId}`, {
    method: "DELETE",
  });
}
