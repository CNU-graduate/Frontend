const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

export type ApiErrorBody = {
  code?: string;
  message?: string;
};

export class ApiError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error: ApiErrorBody | null;
  timestamp?: string;
};

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("accessToken");
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("refreshToken");
}

function storeTokens(tokens: { accessToken: string; refreshToken: string }) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("accessToken", tokens.accessToken);
  window.localStorage.setItem("refreshToken", tokens.refreshToken);
}

function clearTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("refreshToken");
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | null;

  if (!response.ok || !body?.success) {
    const message =
      body?.error?.message || `API request failed (${response.status})`;
    throw new ApiError(message, response.status, body?.error?.code);
  }

  return body.data;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const accessToken = getAccessToken();
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      "\uBC31\uC5D4\uB4DC \uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. http://localhost:8080 \uC11C\uBC84\uAC00 \uC2E4\uD589 \uC911\uC778\uC9C0 \uD655\uC778\uD574\uC8FC\uC138\uC694.",
      0,
      "NETWORK_ERROR",
    );
  }

  try {
    return await parseResponse<T>(response);
  } catch (error) {
    if (
      retry &&
      error instanceof ApiError &&
      error.status === 401 &&
      path !== "/api/v1/auth/refresh"
    ) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw error;

      try {
        const refreshed = await request<{
          accessToken: string;
          refreshToken: string;
        }>(
          "/api/v1/auth/refresh",
          {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
          },
          false,
        );
        storeTokens(refreshed);
        return request<T>(path, options, false);
      } catch (refreshError) {
        clearTokens();
        throw refreshError;
      }
    }

    throw error;
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};

export { clearTokens, storeTokens };
