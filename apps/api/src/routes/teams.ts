import { Router } from "express";
import { ZodError } from "zod";
import { asyncHandler } from "../http/asyncHandler.js";
import { HttpError } from "../http/errors.js";
import { requireAuth } from "../middleware/auth.js";
import { requireTeamAccess } from "../middleware/teamAccess.js";
import { createTeamSchema, inviteMemberSchema } from "../schemas/teamSchemas.js";
import { addTeamMemberByEmail } from "../services/teamMembers.js";
import { createTeam, getTeamDetail } from "../services/teams.js";
import type { AuthenticatedRequest } from "../types/auth.js";

export const teamsRouter = Router();

function parseBody<T>(schema: { parse: (value: unknown) => T }, body: unknown) {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError(400, "Invalid request body.", error.flatten());
    }
    throw error;
  }
}

function getRequiredTeamId(req: AuthenticatedRequest) {
  const teamId = req.params.teamId;
  if (!teamId || Array.isArray(teamId)) {
    throw new HttpError(400, "Team id is required.");
  }
  return teamId;
}

teamsRouter.post(
  "/teams",
  requireAuth,
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError(401, "Authentication required.");
    }

    const body = parseBody(createTeamSchema, req.body);
    const team = await createTeam(body, userId);
    res.status(201).json(team);
  }),
);

teamsRouter.get(
  "/teams/:teamId",
  requireAuth,
  requireTeamAccess("member"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    res.json(await getTeamDetail(getRequiredTeamId(req)));
  }),
);

teamsRouter.post(
  "/teams/:teamId/members/invite",
  requireAuth,
  requireTeamAccess("admin"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const body = parseBody(inviteMemberSchema, req.body);
    const result = await addTeamMemberByEmail({
      teamId: getRequiredTeamId(req),
      email: body.email,
      role: body.role,
    });
    res.status(201).json(result);
  }),
);
