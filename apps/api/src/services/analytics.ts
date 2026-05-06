import { prisma } from "../db/prisma.js";

function toNumber(value: unknown) {
  return Number(value ?? 0);
}

export async function getAnalyticsSummary(teamId: string) {
  const games = await prisma.game.findMany({
    where: { teamId },
    orderBy: { playedAt: "asc" },
  });

  const questions = await prisma.question.findMany({
    where: { game: { teamId } },
    include: { category: true },
  });

  const byCategory = new Map<string, { correct: number; total: number }>();
  for (const question of questions) {
    const current = byCategory.get(question.category.name) ?? { correct: 0, total: 0 };
    current.total += 1;
    current.correct += question.isCorrect ? 1 : 0;
    byCategory.set(question.category.name, current);
  }

  const rankedCategories = [...byCategory.entries()]
    .map(([name, stats]) => ({
      name,
      percentCorrect: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      total: stats.total,
    }))
    .sort((a, b) => b.percentCorrect - a.percentCorrect || b.total - a.total);

  return {
    gamesLogged: games.length,
    totalPoints: games.reduce((sum, game) => sum + game.totalEarned, 0),
    averagePercentCorrect:
      games.length > 0
        ? Number(
            (games.reduce((sum, game) => sum + Number(game.percentCorrect), 0) / games.length).toFixed(2),
          )
        : 0,
    prizesWon: games.filter((game) => game.prizeAmount || game.prizeLabel).length,
    latestGame: games.at(-1)
      ? {
          id: games.at(-1)?.id,
          playedAt: games.at(-1)?.playedAt.toISOString(),
          totalEarned: games.at(-1)?.totalEarned,
          percentCorrect: Number(games.at(-1)?.percentCorrect),
        }
      : null,
    bestCategory: rankedCategories[0]?.name,
    weakestCategory: rankedCategories.at(-1)?.name,
  };
}

export async function getAnalyticsTrends(teamId: string) {
  const games = await prisma.game.findMany({
    where: { teamId },
    orderBy: { playedAt: "asc" },
  });

  return {
    percentCorrectOverTime: games.map((game) => ({
      date: game.playedAt.toISOString(),
      value: Number(game.percentCorrect),
    })),
    pointsOverTime: games.map((game) => ({
      date: game.playedAt.toISOString(),
      value: game.totalEarned,
    })),
    placementOverTime: games
      .filter((game) => game.placement !== null)
      .map((game) => ({
        date: game.playedAt.toISOString(),
        value: game.placement,
      })),
  };
}

export async function getCategoryAnalytics(teamId: string) {
  const questions = await prisma.question.findMany({
    where: { game: { teamId } },
    include: { category: true },
  });

  const byCategory = new Map<
    string,
    { correct: number; total: number; pointsEarned: number; pointsPossible: number }
  >();

  for (const question of questions) {
    const stats = byCategory.get(question.category.name) ?? {
      correct: 0,
      total: 0,
      pointsEarned: 0,
      pointsPossible: 0,
    };
    stats.correct += question.isCorrect ? 1 : 0;
    stats.total += 1;
    stats.pointsEarned += question.earnedPoints;
    stats.pointsPossible += question.wagerValue;
    byCategory.set(question.category.name, stats);
  }

  return {
    categories: [...byCategory.entries()]
      .map(([name, stats]) => ({
        name,
        ...stats,
        percentCorrect: stats.total > 0 ? Number(((stats.correct / stats.total) * 100).toFixed(2)) : 0,
      }))
      .sort((a, b) => b.percentCorrect - a.percentCorrect || a.name.localeCompare(b.name)),
  };
}

export async function getWagerAnalytics(teamId: string) {
  const questions = await prisma.question.findMany({
    where: { game: { teamId } },
  });
  const finals = await prisma.finalQuestion.findMany({
    where: { game: { teamId } },
  });

  const byWager = new Map<number, { attempts: number; correct: number; netPoints: number }>();

  for (const question of questions) {
    const stats = byWager.get(question.wagerValue) ?? { attempts: 0, correct: 0, netPoints: 0 };
    stats.attempts += 1;
    stats.correct += question.isCorrect ? 1 : 0;
    stats.netPoints += question.earnedPoints;
    byWager.set(question.wagerValue, stats);
  }

  for (const finalQuestion of finals) {
    const stats = byWager.get(finalQuestion.wagerValue) ?? { attempts: 0, correct: 0, netPoints: 0 };
    stats.attempts += 1;
    stats.correct += finalQuestion.isCorrect ? 1 : 0;
    stats.netPoints += finalQuestion.earnedPoints;
    byWager.set(finalQuestion.wagerValue, stats);
  }

  return {
    wagers: [...byWager.entries()]
      .map(([wagerValue, stats]) => ({
        wagerValue,
        ...stats,
        percentCorrect:
          stats.attempts > 0 ? Number(((stats.correct / stats.attempts) * 100).toFixed(2)) : 0,
      }))
      .sort((a, b) => a.wagerValue - b.wagerValue),
  };
}

export async function getRoundAnalytics(teamId: string) {
  const questions = await prisma.question.findMany({
    where: { game: { teamId } },
  });
  const halftimes = await prisma.halftime.findMany({ where: { game: { teamId } } });
  const finals = await prisma.finalQuestion.findMany({ where: { game: { teamId } } });

  const rounds = Array.from({ length: 6 }, (_, index) => {
    const roundNumber = index + 1;
    const roundQuestions = questions.filter((question) => question.roundNumber === roundNumber);
    return {
      label: `Round ${roundNumber}`,
      pointsEarned: roundQuestions.reduce((sum, question) => sum + question.earnedPoints, 0),
      pointsPossible: roundQuestions.reduce((sum, question) => sum + question.wagerValue, 0),
      attempts: roundQuestions.length,
      correct: roundQuestions.filter((question) => question.isCorrect).length,
    };
  });

  rounds.push({
    label: "Halftime",
    pointsEarned: halftimes.reduce((sum, halftime) => sum + halftime.earnedPoints, 0),
    pointsPossible: halftimes.reduce((sum, halftime) => sum + halftime.pointsPossible, 0),
    attempts: halftimes.length,
    correct: 0,
  });
  rounds.push({
    label: "Final",
    pointsEarned: finals.reduce((sum, finalQuestion) => sum + finalQuestion.earnedPoints, 0),
    pointsPossible: finals.reduce((sum, finalQuestion) => sum + finalQuestion.wagerValue, 0),
    attempts: finals.length,
    correct: finals.filter((finalQuestion) => finalQuestion.isCorrect).length,
  });

  return { rounds: rounds.map((round) => ({ ...round, percentOfPossible: toNumber(((round.pointsEarned / Math.max(round.pointsPossible, 1)) * 100).toFixed(2)) })) };
}
