import { HttpError } from "../http/errors.js";

export type RegularQuestionInput = {
  roundNumber: number;
  questionNo: number;
  wagerValue: number;
  isCorrect: boolean;
};

export type ScoredQuestion = RegularQuestionInput & {
  earnedPoints: number;
};

export type HalftimeInput = {
  partsTotal: number;
  partsCorrect: number;
  pointsPossible: number;
};

export type FinalQuestionInput = {
  wagerValue: number;
  isCorrect: boolean;
};

export type GameTotals = {
  totalEarned: number;
  totalPossible: number;
  percentCorrect: number;
};

const requiredWagersByRoundGroup = {
  early: [2, 4, 6],
  late: [5, 7, 9],
};

function requiredWagersForRound(roundNumber: number) {
  if (roundNumber >= 1 && roundNumber <= 3) {
    return requiredWagersByRoundGroup.early;
  }

  if (roundNumber >= 4 && roundNumber <= 6) {
    return requiredWagersByRoundGroup.late;
  }

  throw new HttpError(400, `Round ${roundNumber} is outside the supported 1-6 range.`);
}

function assertSameWagers(actual: number[], expected: number[], roundNumber: number) {
  const sortedActual = [...actual].sort((a, b) => a - b);
  const sortedExpected = [...expected].sort((a, b) => a - b);

  const matches =
    sortedActual.length === sortedExpected.length &&
    sortedActual.every((value, index) => value === sortedExpected[index]);

  if (!matches) {
    throw new HttpError(
      400,
      `Round ${roundNumber} must use wagers ${expected.join(", ")} exactly once.`,
      { roundNumber, expected, actual },
    );
  }
}

export function scoreRegularRound(roundNumber: number, questions: Omit<RegularQuestionInput, "roundNumber">[]) {
  const requiredWagers = requiredWagersForRound(roundNumber);

  if (questions.length !== 3) {
    throw new HttpError(400, `Round ${roundNumber} must include exactly 3 questions.`);
  }

  assertSameWagers(
    questions.map((question) => question.wagerValue),
    requiredWagers,
    roundNumber,
  );

  return questions.map((question) => ({
    ...question,
    roundNumber,
    earnedPoints: question.isCorrect ? question.wagerValue : 0,
  }));
}

export function scoreRegularQuestions(questions: RegularQuestionInput[]) {
  return Array.from({ length: 6 }, (_, index) => index + 1).flatMap((roundNumber) => {
    const roundQuestions = questions
      .filter((question) => question.roundNumber === roundNumber)
      .sort((a, b) => a.questionNo - b.questionNo)
      .map(({ questionNo, wagerValue, isCorrect }) => ({ questionNo, wagerValue, isCorrect }));

    return scoreRegularRound(roundNumber, roundQuestions);
  });
}

export function scoreHalftime(input: HalftimeInput) {
  if (input.partsTotal <= 0) {
    throw new HttpError(400, "Halftime parts total must be greater than zero.");
  }

  if (input.partsCorrect < 0 || input.partsCorrect > input.partsTotal) {
    throw new HttpError(400, "Halftime parts correct must be between zero and parts total.");
  }

  const earnedPoints = Math.round((input.partsCorrect / input.partsTotal) * input.pointsPossible);

  return {
    ...input,
    earnedPoints,
  };
}

export function scoreFinalQuestion(input: FinalQuestionInput) {
  if (input.wagerValue < 0 || input.wagerValue > 20) {
    throw new HttpError(400, "Final wager must be between 0 and 20.");
  }

  return {
    ...input,
    earnedPoints: input.isCorrect ? input.wagerValue : -input.wagerValue,
  };
}

export function calculateTotals(input: {
  questions: ScoredQuestion[];
  halftime?: { earnedPoints: number; pointsPossible: number };
  finalQuestion?: { earnedPoints: number; wagerValue: number };
}): GameTotals {
  const regularEarned = input.questions.reduce((sum, question) => sum + question.earnedPoints, 0);
  const regularPossible = input.questions.reduce((sum, question) => sum + question.wagerValue, 0);
  const halftimeEarned = input.halftime?.earnedPoints ?? 0;
  const halftimePossible = input.halftime?.pointsPossible ?? 0;
  const finalEarned = input.finalQuestion?.earnedPoints ?? 0;
  const finalPossible = input.finalQuestion?.wagerValue ?? 0;

  const totalEarned = regularEarned + halftimeEarned + finalEarned;
  const totalPossible = regularPossible + halftimePossible + finalPossible;
  const percentCorrect = totalPossible > 0 ? Number(((totalEarned / totalPossible) * 100).toFixed(2)) : 0;

  return {
    totalEarned,
    totalPossible,
    percentCorrect,
  };
}
