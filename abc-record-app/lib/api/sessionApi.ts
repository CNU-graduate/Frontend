import { apiCall } from "./client";
import { PageResponse } from "./studentApi";

export type TriggerType = "SWIPE" | "MANUAL" | "NOISE";
export type SessionStatus =
  | "RECORDING"
  | "ENDED"
  | "COMPLETED"
  | "INCOMPLETE"
  | "ABANDONED";

export type RecordSession = {
  sessionId: number;
  studentId: number;
  studentName: string;
  status: SessionStatus;
  triggerType: TriggerType;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  mediaAssisted: boolean;
};

export async function startSession(
  studentId: number,
  data: {
    triggerType: TriggerType;
    mediaAssisted?: boolean;
  },
) {
  return apiCall<RecordSession>(`/api/v1/students/${studentId}/sessions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function endSession(sessionId: number) {
  return apiCall<RecordSession>(`/api/v1/sessions/${sessionId}/end`, {
    method: "POST",
  });
}

export async function abandonSession(
  sessionId: number,
  data?: {
    lastValidAt?: string;
  },
) {
  return apiCall<RecordSession>(`/api/v1/sessions/${sessionId}/abandon`, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function getStudentSessions(
  studentId: number,
  params?: {
    page?: number;
    size?: number;
  },
) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params?.page ?? 0));
  searchParams.set("size", String(params?.size ?? 20));

  return apiCall<PageResponse<RecordSession>>(
    `/api/v1/students/${studentId}/sessions?${searchParams.toString()}`,
  );
}

export async function getSession(sessionId: number) {
  return apiCall<RecordSession>(`/api/v1/sessions/${sessionId}`);
}
