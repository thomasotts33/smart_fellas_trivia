import { Prisma } from "../generated/prisma/index.js";
import { prisma } from "../db/prisma.js";
import { HttpError } from "../http/errors.js";
import { scoreFinalQuestion, scoreHalftime, scoreRegularQuestions, calculateTotals } from "./scoring.js";
import type { GameInput } from "../schemas/gameSchemas.js";

type TransactionClient = Prisma.TransactionClient;

function normalizeCategoryName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

async function upsertCategory(tx: TransactionClient, teamId: string, rawName: string) {
  const name = normalizeCategoryName(rawName);
  const existing = await tx.category.findFirst({
    where: { teamId, name: { equals: name, mode: "insensitive" } },
  });

  if (existing) {
    return existing;
  }

  return tx.category.create({
    data: { teamId, name },
  });
}

function mapGameSummary(game: {
  id: string;
  playedAt: Date;
  venueName: string | null;
  placement: number | null;
  totalTeams: number | null;
  prizeAmount: Prisma.Decimal | null;
  prizeLabel: string | null;
  totalEarned: number;
  totalPossible: number;
  percentCorrect: Prisma.Decimal;
}) {
  return {
    id: game.id,
    playedAt: game.playedAt.toISOString(),
    venueName: game.venueName,
    placement: game.placement,
    totalTeams: game.totalTeams,
    prizeAmount: game.prizeAmount ? Number(game.prizeAmount) : null,
    prizeLabel: game.prizeLabel,
    totalEarned: game.totalEarned,
    totalPossible: game.totalPossible,
    percentCorrect: Number(game.percentCorrect),
  };
}

async function ensureTeamGame(teamId: string, gameId: string) {
  const game = await prisma.game.findFirst({
    where: { id: gameId, teamId },
  });

  if (!game) {
    throw new HttpError(404, "Game not found.");
  }
}

async function buildGameWriteData(tx: TransactionClient, teamId: string, createdById: string, input: GameInput) {
  const regularInputs = input.rounds.flatMap((round) =>
    round.questions.map((question) => ({
      roundNumber: round.roundNumber,
      questionNo: question.questionNo,
      wagerValue: question.wagerValue,
      isCorrect: question.isCorrect,
      categoryName: question.categoryName,
      notes: question.notes ?? null,
    })),
  );

  const scoredQuestions = scoreRegularQuestions(regularInputs);
  const halftime = input.halftime ? scoreHalftime(input.halftime) : undefined;
  const finalQuestion = input.finalQuestion ? scoreFinalQuestion(input.finalQuestion) : undefined;
  const totals = calculateTotals({ questions: scoredQuestions, halftime, finalQuestion });

  const categoryByName = new Map<string, string>();
  for (const question of regularInputs) {
    const normalizedName = normalizeCategoryName(question.categoryName);
    if (!categoryByName.has(normalizedName.toLowerCase())) {
      const category = await upsertCategory(tx, teamId, normalizedName);
      categoryByName.set(normalizedName.toLowerCase(), category.id);
    }
  }

  return {
    totals,
    data: {
      teamId,
      createdById,
      playedAt: new Date(input.playedAt),
      venueName: input.venueName ?? null,
      placement: input.placement ?? null,
      totalTeams: input.totalTeams ?? null,
      prizeAmount: input.prizeAmount ?? null,
      prizeLabel: input.prizeLabel ?? null,
      notes: input.notes ?? null,
      totalEarned: totals.totalEarned,
      totalPossible: totals.totalPossible,
      percentCorrect: totals.percentCorrect,
      questions: {
        create: scoredQuestions.map((question) => {
          const source = regularInputs.find(
            (candidate) =>
              candidate.roundNumber === question.roundNumber && candidate.questionNo === question.questionNo,
          );
          if (!source) {
            throw new HttpError(400, "Question source data is missing.");
          }

          const categoryId = categoryByName.get(normalizeCategoryName(source.categoryName).toLowerCase());
          if (!categoryId) {
            throw new HttpError(400, "Question category could not be saved.");
          }

          return {
            categoryId,
            roundNumber: question.roundNumber,
            questionNo: question.questionNo,
            wagerValue: question.wagerValue,
            isCorrect: question.isCorrect,
            earnedPoints: question.earnedPoints,
            notes: source.notes,
          };
        }),
      },
      halftime: halftime
        ? {
            create: {
              categoryLabel: input.halftime?.categoryLabel ?? null,
              partsTotal: halftime.partsTotal,
              partsCorrect: halftime.partsCorrect,
              pointsPossible: halftime.pointsPossible,
              earnedPoints: halftime.earnedPoints,
              notes: input.halftime?.notes ?? null,
            },
          }
        : undefined,
      finalQuestion: finalQuestion
        ? {
            create: {
              categoryLabel: input.finalQuestion?.categoryLabel ?? null,
              wagerValue: finalQuestion.wagerValue,
              isCorrect: finalQuestion.isCorrect,
              earnedPoints: finalQuestion.earnedPoints,
              notes: input.finalQuestion?.notes ?? null,
            },
          }
        : undefined,
    },
  };
}

export async function createGame(teamId: string, createdById: string, input: GameInput) {
  return prisma.$transaction(async (tx) => {
    const { data, totals } = await buildGameWriteData(tx, teamId, createdById, input);
    const game = await tx.game.create({ data });
    return { id: game.id, totals };
  });
}

export async function updateGame(teamId: string, gameId: string, createdById: string, input: GameInput) {
  await ensureTeamGame(teamId, gameId);

  return prisma.$transaction(async (tx) => {
    await tx.question.deleteMany({ where: { gameId } });
    await tx.halftime.deleteMany({ where: { gameId } });
    await tx.finalQuestion.deleteMany({ where: { gameId } });

    const { data, totals } = await buildGameWriteData(tx, teamId, createdById, input);
    const game = await tx.game.update({
      where: { id: gameId },
      data: {
        playedAt: data.playedAt,
        venueName: data.venueName,
        placement: data.placement,
        totalTeams: data.totalTeams,
        prizeAmount: data.prizeAmount,
        prizeLabel: data.prizeLabel,
        notes: data.notes,
        totalEarned: data.totalEarned,
        totalPossible: data.totalPossible,
        percentCorrect: data.percentCorrect,
        questions: data.questions,
        halftime: data.halftime,
        finalQuestion: data.finalQuestion,
      },
    });

    return { id: game.id, totals };
  });
}

export async function listGames(teamId: string, options: { limit?: number; offset?: number } = {}) {
  const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
  const offset = Math.max(options.offset ?? 0, 0);
  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where: { teamId },
      orderBy: { playedAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.game.count({ where: { teamId } }),
  ]);

  return {
    games: games.map(mapGameSummary),
    total,
  };
}

export async function getGameDetail(teamId: string, gameId: string) {
  const game = await prisma.game.findFirst({
    where: { id: gameId, teamId },
    include: {
      questions: {
        include: { category: true },
        orderBy: [{ roundNumber: "asc" }, { questionNo: "asc" }],
      },
      halftime: true,
      finalQuestion: true,
    },
  });

  if (!game) {
    throw new HttpError(404, "Game not found.");
  }

  return {
    ...mapGameSummary(game),
    notes: game.notes,
    rounds: Array.from({ length: 6 }, (_, index) => index + 1).map((roundNumber) => ({
      roundNumber,
      questions: game.questions
        .filter((question) => question.roundNumber === roundNumber)
        .map((question) => ({
          id: question.id,
          questionNo: question.questionNo,
          categoryName: question.category.name,
          wagerValue: question.wagerValue,
          isCorrect: question.isCorrect,
          earnedPoints: question.earnedPoints,
          notes: question.notes,
        })),
    })),
    halftime: game.halftime,
    finalQuestion: game.finalQuestion,
  };
}

export async function deleteGame(teamId: string, gameId: string) {
  await ensureTeamGame(teamId, gameId);
  await prisma.game.delete({ where: { id: gameId } });
}
