import type { NextFunction, Response } from "express";
import { prisma } from "../db/prisma.js";
import { HttpError } from "../http/errors.js";
import type { AuthenticatedRequest, TeamRole } from "../types/auth.js";

const roleRank: Record<TeamRole, number> = {
  member: 1,
  admin: 2,
  owner: 3,
};

export function requireTeamAccess(minRole: TeamRole = "member") {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const teamId = req.params.teamId;

    if (!req.user) {
      next(new HttpError(401, "Authentication required."));
      return;
    }

    if (!teamId || Array.isArray(teamId)) {
      next(new HttpError(400, "Team id is required."));
      return;
    }

    try {
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: req.user.id,
          },
        },
      });

      if (!membership) {
        next(new HttpError(403, "You do not have access to this team."));
        return;
      }

      const role = membership.role as TeamRole;
      if (roleRank[role] < roleRank[minRole]) {
        next(new HttpError(403, "Your role cannot perform this action."));
        return;
      }

      req.teamAccess = { teamId, role };
      next();
    } catch (error) {
      next(error);
    }
  };
}
