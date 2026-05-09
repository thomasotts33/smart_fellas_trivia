import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextFunction, Response } from "express";
import { config } from "../config.js";
import { HttpError } from "../http/errors.js";
import { syncUser } from "../services/users.js";
import type { AuthenticatedRequest } from "../types/auth.js";

const signatureVersion = "v1";
const maxSkewMs = 5 * 60 * 1000;

function getInternalSecret() {
  return config.API_INTERNAL_SECRET ?? config.NEXTAUTH_SECRET;
}

function getHeaderValue(req: AuthenticatedRequest, name: string) {
  const value = req.header(name);
  return value && value.trim() ? value.trim() : null;
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function signaturePayload(input: { timestamp: string; email: string; name?: string | null; image?: string | null }) {
  return [signatureVersion, input.timestamp, input.email, input.name ?? "", input.image ?? ""].join(".");
}

function readSignedIdentity(req: AuthenticatedRequest) {
  const version = getHeaderValue(req, "x-smartfellas-auth-version");
  const timestamp = getHeaderValue(req, "x-smartfellas-auth-timestamp");
  const email = getHeaderValue(req, "x-smartfellas-auth-email");
  const signature = getHeaderValue(req, "x-smartfellas-auth-signature");
  const name = getHeaderValue(req, "x-smartfellas-auth-name");
  const image = getHeaderValue(req, "x-smartfellas-auth-image");

  if (!version && !timestamp && !email && !signature) {
    return null;
  }

  if (version !== signatureVersion || !timestamp || !email || !signature) {
    throw new HttpError(401, "Invalid authentication signature.");
  }

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber) || Math.abs(Date.now() - timestampNumber) > maxSkewMs) {
    throw new HttpError(401, "Authentication signature expired.");
  }

  const expected = createHmac("sha256", getInternalSecret())
    .update(signaturePayload({ email, image, name, timestamp }))
    .digest("hex");

  if (!safeCompare(signature, expected)) {
    throw new HttpError(401, "Invalid authentication signature.");
  }

  return { email, image, name };
}

export async function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  try {
    const identity = readSignedIdentity(req);

    if (!identity) {
      next(new HttpError(401, "Authentication required."));
      return;
    }

    req.user = await syncUser({
      email: identity.email,
      name: identity.name,
      image: identity.image,
    });
    next();
  } catch (error) {
    next(error);
  }
}
