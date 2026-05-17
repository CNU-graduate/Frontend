import { apiClient } from "./client";

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

export type SessionPageResponse = {
  content: RecordSession[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export function startSession(
  studentId: number | string,
  request: { triggerType: TriggerType; mediaAssisted?: boolean },
) {
  return apiClient.post<RecordSession>(
    `/api/v1/students/${studentId}/sessions`,
    request,
  );
}

export function endSession(sessionId: number | string) {
  return apiClient.post<RecordSession>(`/api/v1/sessions/${sessionId}/end`);
}

export function abandonSession(
  sessionId: number | string,
  request?: { lastValidAt?: string },
) {
  return apiClient.post<RecordSession>(
    `/api/v1/sessions/${sessionId}/abandon`,
    request,
  );
}

export function getStudentSessions(
  studentId: number | string,
  params: { page?: number; size?: number } = {},
) {
  const searchParams = new URLSearchParams({
    page: String(params.page ?? 0),
    size: String(params.size ?? 20),
  });

  return apiClient.get<SessionPageResponse>(
    `/api/v1/students/${studentId}/sessions?${searchParams.toString()}`,
  );
}

export function getSession(sessionId: number | string) {
  return apiClient.get<RecordSession>(`/api/v1/sessions/${sessionId}`);
}
