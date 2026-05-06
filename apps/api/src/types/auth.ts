import type { Request } from "express";

export type TeamRole = "owner" | "admin" | "member";

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
};

export type TeamAccess = {
  teamId: string;
  role: TeamRole;
};

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
  teamAccess?: TeamAccess;
};
