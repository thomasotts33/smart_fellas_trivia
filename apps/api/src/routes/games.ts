import { Router } from "express";
import { ZodError } from "zod";
import { asyncHandler } from "../http/asyncHandler.js";
import { HttpError } from "../http/errors.js";
import { requireAuth } from "../middleware/auth.js";
import { requireTeamAccess } from "../middleware/teamAccess.js";
import { gameInputSchema } from "../schemas/gameSchemas.js";
import { createGame, deleteGame, getGameDetail, listGames, updateGame } from "../services/games.js";
import type { AuthenticatedRequest } from "../types/auth.js";

export const gamesRouter = Router();

function parseGame(body: unknown) {
  try {
    return gameInputSchema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError(400, "Invalid game data.", error.flatten());
    }
    throw error;
  }
}

function getRequiredParam(req: AuthenticatedRequest, name: string) {
  const value = req.params[name];
  if (!value || Array.isArray(value)) {
    throw new HttpError(400, `${name} is required.`);
  }
  return value;
}

function getUserId(req: AuthenticatedRequest) {
  const userId = req.user?.id;
  if (!userId) {
    throw new HttpError(401, "Authentication required.");
  }
  return userId;
}

gamesRouter.post(
  "/teams/:teamId/games",
  requireAuth,
  requireTeamAccess("admin"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await createGame(getRequiredParam(req, "teamId"), getUserId(req), parseGame(req.body));
    res.status(201).json(result);
  }),
);

gamesRouter.get(
  "/teams/:teamId/games",
  requireAuth,
  requireTeamAccess("member"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const limit = Number(req.query.limit ?? 20);
    const offset = Number(req.query.offset ?? 0);
    res.json(await listGames(getRequiredParam(req, "teamId"), { limit, offset }));
  }),
);

gamesRouter.get(
  "/teams/:teamId/games/:gameId",
  requireAuth,
  requireTeamAccess("member"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    res.json(await getGameDetail(getRequiredParam(req, "teamId"), getRequiredParam(req, "gameId")));
  }),
);

gamesRouter.put(
  "/teams/:teamId/games/:gameId",
  requireAuth,
  requireTeamAccess("admin"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await updateGame(
      getRequiredParam(req, "teamId"),
      getRequiredParam(req, "gameId"),
      getUserId(req),
      parseGame(req.body),
    );
    res.json(result);
  }),
);

gamesRouter.delete(
  "/teams/:teamId/games/:gameId",
  requireAuth,
  requireTeamAccess("admin"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    await deleteGame(getRequiredParam(req, "teamId"), getRequiredParam(req, "gameId"));
    res.status(204).send();
  }),
);
