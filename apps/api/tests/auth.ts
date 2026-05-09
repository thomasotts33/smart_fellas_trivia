import { createHmac } from "node:crypto";

export function auth(email: string) {
  const timestamp = Date.now().toString();
  const name = email.split("@")[0];
  const image = "";
  const payload = ["v1", timestamp, email, name, image].join(".");
  const signature = createHmac("sha256", process.env.API_INTERNAL_SECRET ?? process.env.NEXTAUTH_SECRET ?? "test-secret")
    .update(payload)
    .digest("hex");

  return {
    "x-smartfellas-auth-email": email,
    "x-smartfellas-auth-image": image,
    "x-smartfellas-auth-name": name,
    "x-smartfellas-auth-signature": signature,
    "x-smartfellas-auth-timestamp": timestamp,
    "x-smartfellas-auth-version": "v1",
  };
}
