import type { NextFunction, Response } from "express";
import { HttpError } from "../http/errors.js";
import { syncUser } from "../services/users.js";
import type { AuthenticatedRequest } from "../types/auth.js";

function readBearerToken(header: string | undefined) {
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim();
}

export async function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const bearerEmail = readBearerToken(req.header("authorization"));
  const headerEmail = req.header("x-user-email");
  const email = bearerEmail || headerEmail;

  if (!email) {
    next(new HttpError(401, "Authentication required."));
    return;
  }

  try {
    req.user = await syncUser({
      email,
      name: req.header("x-user-name") ?? null,
      image: req.header("x-user-image") ?? null,
    });
    next();
  } catch (error) {
    next(error);
  }
}
