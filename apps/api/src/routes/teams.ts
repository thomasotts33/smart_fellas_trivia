import { Router } from "express";
import { ZodError } from "zod";
import { asyncHandler } from "../http/asyncHandler.js";
import { HttpError } from "../http/errors.js";
import { requireAuth } from "../middleware/auth.js";
import { requireTeamAccess } from "../middleware/teamAccess.js";
import { createTeamSchema, inviteMemberSchema, updateMemberRoleSchema, updateTeamSchema } from "../schemas/teamSchemas.js";
import { addTeamMemberByEmail, removeTeamMember, updateTeamMemberRole } from "../services/teamMembers.js";
import { createTeam, getTeamDetail, updateTeam } from "../services/teams.js";
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

function getRequiredMemberId(req: AuthenticatedRequest) {
  const memberId = req.params.memberId;
  if (!memberId || Array.isArray(memberId)) {
    throw new HttpError(400, "Team member id is required.");
  }
  return memberId;
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

teamsRouter.patch(
  "/teams/:teamId",
  requireAuth,
  requireTeamAccess("owner"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const body = parseBody(updateTeamSchema, req.body);
    res.json(await updateTeam({ teamId: getRequiredTeamId(req), ...body }));
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

teamsRouter.patch(
  "/teams/:teamId/members/:memberId",
  requireAuth,
  requireTeamAccess("owner"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const body = parseBody(updateMemberRoleSchema, req.body);
    res.json(
      await updateTeamMemberRole({
        teamId: getRequiredTeamId(req),
        memberId: getRequiredMemberId(req),
        role: body.role,
      }),
    );
  }),
);

teamsRouter.delete(
  "/teams/:teamId/members/:memberId",
  requireAuth,
  requireTeamAccess("owner"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    await removeTeamMember({
      teamId: getRequiredTeamId(req),
      memberId: getRequiredMemberId(req),
    });
    res.status(204).send();
  }),
);
