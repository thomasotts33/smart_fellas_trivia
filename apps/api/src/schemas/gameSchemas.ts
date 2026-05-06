import { z } from "zod";

const nullableNumber = z.union([z.number(), z.null()]).optional();
const nullableString = z.union([z.string(), z.null()]).optional();

const regularQuestionSchema = z.object({
  questionNo: z.coerce.number().int().min(1).max(3),
  categoryName: z.string().trim().min(1, "Category is required.").max(80),
  wagerValue: z.coerce.number().int(),
  isCorrect: z.boolean(),
  notes: nullableString,
});

const roundSchema = z.object({
  roundNumber: z.coerce.number().int().min(1).max(6),
  questions: z.array(regularQuestionSchema).length(3),
});

const halftimeSchema = z.object({
  categoryLabel: nullableString,
  partsTotal: z.coerce.number().int().positive().default(4),
  partsCorrect: z.coerce.number().int().min(0),
  pointsPossible: z.coerce.number().int().positive().default(12),
  notes: nullableString,
});

const finalQuestionSchema = z.object({
  categoryLabel: nullableString,
  wagerValue: z.coerce.number().int().min(0).max(20),
  isCorrect: z.boolean(),
  notes: nullableString,
});

export const gameInputSchema = z.object({
  playedAt: z.string().datetime(),
  venueName: nullableString,
  placement: nullableNumber,
  totalTeams: nullableNumber,
  prizeAmount: nullableNumber,
  prizeLabel: nullableString,
  notes: nullableString,
  rounds: z.array(roundSchema).length(6),
  halftime: halftimeSchema.optional(),
  finalQuestion: finalQuestionSchema.optional(),
});

export type GameInput = z.infer<typeof gameInputSchema>;
