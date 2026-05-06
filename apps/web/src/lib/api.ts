import { clientConfig } from "./config";
import { ApiError } from "./errors";

type ApiFetchOptions = RequestInit & {
  token?: string;
  userName?: string | null;
  userImage?: string | null;
};

const developmentEmail = "thomas@smartfellas.local";
const privateBetaEmail = process.env.NEXT_PUBLIC_PRIVATE_BETA_EMAIL;

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = options.token ?? privateBetaEmail ?? (process.env.NODE_ENV === "development" ? developmentEmail : undefined);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.userName) {
    headers.set("x-user-name", options.userName);
  }

  if (options.userImage) {
    headers.set("x-user-image", options.userImage);
  }

  const response = await fetch(`${clientConfig.API_BASE_URL}${path}`, {
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
