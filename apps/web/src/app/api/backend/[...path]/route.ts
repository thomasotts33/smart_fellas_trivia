import { NextResponse, type NextRequest } from "next/server";
import { clientConfig } from "@/lib/config";
import { signInternalAuthHeaders } from "@/lib/internalAuth";
import { getSessionIdentity } from "@/lib/session";

const hopByHopHeaders = new Set(["connection", "content-length", "host"]);

async function proxyRequest(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const identity = await getSessionIdentity();

  if (!identity) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { path } = await context.params;
  const targetUrl = new URL(`/api/${path.join("/")}${request.nextUrl.search}`, clientConfig.API_BASE_URL);
  const headers = new Headers(request.headers);

  for (const header of hopByHopHeaders) {
    headers.delete(header);
  }

  headers.delete("authorization");
  const authHeaders = signInternalAuthHeaders(identity);
  for (const [key, value] of Object.entries(authHeaders)) {
    headers.set(key, value);
  }

  const response = await fetch(targetUrl, {
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
    headers,
    method: request.method,
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new NextResponse(response.body, {
    headers: responseHeaders,
    status: response.status,
    statusText: response.statusText,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
