import { clientConfig } from "./config";
import { ApiError } from "./errors";

type ApiFetchOptions = RequestInit & {
  token?: string;
  userName?: string | null;
  userImage?: string | null;
};

const developmentEmail = "thomas@smartfellas.local";

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const isBrowser = typeof window !== "undefined";
  const token =
    options.token ??
    (!isBrowser && process.env.NODE_ENV === "development" && process.env.SMARTFELLAS_DEV_AUTH_BYPASS === "true" ? developmentEmail : undefined);

  if (token) {
    if (isBrowser) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      const { signInternalAuthHeaders } = await import("./internalAuth");
      const authHeaders = signInternalAuthHeaders({
        email: token,
        name: options.userName ?? null,
        image: options.userImage ?? null,
      });

      for (const [key, value] of Object.entries(authHeaders)) {
        headers.set(key, value);
      }
    }
  }

  if (options.userName) {
    headers.set("x-user-name", options.userName);
  }

  if (options.userImage) {
    headers.set("x-user-image", options.userImage);
  }

  const requestUrl = isBrowser ? `/api/backend${path.replace(/^\/api/, "")}` : `${clientConfig.API_BASE_URL}${path}`;

  const response = await fetch(requestUrl, {
    ...options,
    cache: options.cache ?? "no-store",
    headers,
  });

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(payload?.error ?? "API request failed.", response.status, payload?.details);
  }

  return payload as T;
}

export async function getHealth() {
  return apiFetch<{ status: "ok" }>("/api/health");
}
