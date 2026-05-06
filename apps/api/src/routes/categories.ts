import { Router } from "express";
import { ZodError } from "zod";
import { asyncHandler } from "../http/asyncHandler.js";
import { HttpError } from "../http/errors.js";
import { requireAuth } from "../middleware/auth.js";
import { requireTeamAccess } from "../middleware/teamAccess.js";
import { upsertCategorySchema } from "../schemas/categorySchemas.js";
import { listCategories, upsertCategory } from "../services/categories.js";
import type { AuthenticatedRequest } from "../types/auth.js";

export const categoriesRouter = Router();

function getRequiredTeamId(req: AuthenticatedRequest) {
  const teamId = req.params.teamId;
  if (!teamId || Array.isArray(teamId)) {
    throw new HttpError(400, "Team id is required.");
  }
  return teamId;
}

categoriesRouter.get(
  "/teams/:teamId/categories",
  requireAuth,
  requireTeamAccess("member"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    res.json(await listCategories(getRequiredTeamId(req)));
  }),
);

categoriesRouter.post(
  "/teams/:teamId/categories",
  requireAuth,
  requireTeamAccess("admin"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    try {
      const body = upsertCategorySchema.parse(req.body);
      const category = await upsertCategory(getRequiredTeamId(req), body.name);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpError(400, "Invalid request body.", error.flatten());
      }
      throw error;
    }
  }),
);
