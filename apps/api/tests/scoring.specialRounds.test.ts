import { describe, expect, it } from "vitest";
import { calculateTotals, scoreFinalQuestion, scoreHalftime } from "../src/services/scoring.js";

describe("special round scoring", () => {
  it("scores halftime partial credit", () => {
    expect(scoreHalftime({ partsCorrect: 2, partsTotal: 4, pointsPossible: 12 })).toMatchObject({
      earnedPoints: 6,
    });

    expect(scoreHalftime({ partsCorrect: 3, partsTotal: 5, pointsPossible: 10 })).toMatchObject({
      earnedPoints: 6,
    });
  });

  it("rejects invalid halftime parts", () => {
    expect(() => scoreHalftime({ partsCorrect: 5, partsTotal: 4, pointsPossible: 12 })).toThrow(
      "Halftime parts correct must be between zero and parts total.",
    );
  });

  it("adds correct final wagers and subtracts wrong final wagers", () => {
    expect(scoreFinalQuestion({ wagerValue: 8, isCorrect: true })).toMatchObject({
      earnedPoints: 8,
    });
    expect(scoreFinalQuestion({ wagerValue: 8, isCorrect: false })).toMatchObject({
      earnedPoints: -8,
    });
  });

  it("rejects final wagers outside 0-20", () => {
    expect(() => scoreFinalQuestion({ wagerValue: 21, isCorrect: true })).toThrow(
      "Final wager must be between 0 and 20.",
    );
  });

  it("calculates game totals with regular, halftime, and final points", () => {
    expect(
      calculateTotals({
        questions: [
          { roundNumber: 1, questionNo: 1, wagerValue: 2, isCorrect: true, earnedPoints: 2 },
          { roundNumber: 1, questionNo: 2, wagerValue: 4, isCorrect: false, earnedPoints: 0 },
        ],
        halftime: { earnedPoints: 6, pointsPossible: 12 },
        finalQuestion: { earnedPoints: -5, wagerValue: 5 },
      }),
    ).toEqual({
      totalEarned: 3,
      totalPossible: 23,
      percentCorrect: 13.04,
    });
  });
});
