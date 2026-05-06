import { Router } from "express";
import { asyncHandler } from "../http/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { getUserWithTeams } from "../services/users.js";
import type { AuthenticatedRequest } from "../types/auth.js";

export const meRouter = Router();

meRouter.get(
  "/me",
  requireAuth,
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const user = await getUserWithTeams(userId);

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      teams: user.memberships.map((membership) => ({
        id: membership.team.id,
        name: membership.team.name,
        slug: membership.team.slug,
        role: membership.role,
      })),
    });
  }),
);
