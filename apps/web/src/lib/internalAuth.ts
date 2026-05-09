import { createHmac } from "node:crypto";
import type { SessionIdentity } from "./session";

const signatureVersion = "v1";

function getInternalSecret() {
  return process.env.API_INTERNAL_SECRET ?? process.env.NEXTAUTH_SECRET;
}

function signaturePayload(input: { timestamp: string; email: string; name?: string | null; image?: string | null }) {
  return [signatureVersion, input.timestamp, input.email, input.name ?? "", input.image ?? ""].join(".");
}

export function signInternalAuthHeaders(identity: SessionIdentity) {
  const secret = getInternalSecret();
  if (!secret) {
    throw new Error("API_INTERNAL_SECRET or NEXTAUTH_SECRET is required for API authentication.");
  }

  const timestamp = Date.now().toString();
  const payload = signaturePayload({ ...identity, timestamp });
  const signature = createHmac("sha256", secret).update(payload).digest("hex");

  return {
    "x-smartfellas-auth-version": signatureVersion,
    "x-smartfellas-auth-timestamp": timestamp,
    "x-smartfellas-auth-email": identity.email,
    "x-smartfellas-auth-name": identity.name ?? "",
    "x-smartfellas-auth-image": identity.image ?? "",
    "x-smartfellas-auth-signature": signature,
  };
}
