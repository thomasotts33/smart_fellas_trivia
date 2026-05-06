import { Router } from "express";
import { asyncHandler } from "../http/asyncHandler.js";
import { HttpError } from "../http/errors.js";
import { requireAuth } from "../middleware/auth.js";
import { requireTeamAccess } from "../middleware/teamAccess.js";
import {
  getAnalyticsSummary,
  getAnalyticsTrends,
  getCategoryAnalytics,
  getRoundAnalytics,
  getWagerAnalytics,
} from "../services/analytics.js";
import type { AuthenticatedRequest } from "../types/auth.js";

export const analyticsRouter = Router();

function getTeamId(req: AuthenticatedRequest) {
  const teamId = req.params.teamId;
  if (!teamId || Array.isArray(teamId)) {
    throw new HttpError(400, "Team id is required.");
  }
  return teamId;
}

analyticsRouter.get(
  "/teams/:teamId/analytics/summary",
  requireAuth,
  requireTeamAccess("member"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    res.json(await getAnalyticsSummary(getTeamId(req)));
  }),
);

analyticsRouter.get(
  "/teams/:teamId/analytics/trends",
  requireAuth,
  requireTeamAccess("member"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    res.json(await getAnalyticsTrends(getTeamId(req)));
  }),
);

analyticsRouter.get(
  "/teams/:teamId/analytics/categories",
  requireAuth,
  requireTeamAccess("member"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    res.json(await getCategoryAnalytics(getTeamId(req)));
  }),
);

analyticsRouter.get(
  "/teams/:teamId/analytics/wagers",
  requireAuth,
  requireTeamAccess("member"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    res.json(await getWagerAnalytics(getTeamId(req)));
  }),
);

analyticsRouter.get(
  "/teams/:teamId/analytics/rounds",
  requireAuth,
  requireTeamAccess("member"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    res.json(await getRoundAnalytics(getTeamId(req)));
  }),
);
