import { describe, expect, it } from "vitest";
import { scoreRegularRound, scoreRegularQuestions } from "../src/services/scoring.js";

describe("regular round scoring", () => {
  it("scores valid early and late rounds", () => {
    expect(
      scoreRegularRound(1, [
        { questionNo: 1, wagerValue: 2, isCorrect: true },
        { questionNo: 2, wagerValue: 4, isCorrect: false },
        { questionNo: 3, wagerValue: 6, isCorrect: true },
      ]),
    ).toMatchObject([
      { earnedPoints: 2 },
      { earnedPoints: 0 },
      { earnedPoints: 6 },
    ]);

    expect(
      scoreRegularRound(4, [
        { questionNo: 1, wagerValue: 5, isCorrect: true },
        { questionNo: 2, wagerValue: 7, isCorrect: true },
        { questionNo: 3, wagerValue: 9, isCorrect: false },
      ]),
    ).toMatchObject([
      { earnedPoints: 5 },
      { earnedPoints: 7 },
      { earnedPoints: 0 },
    ]);
  });

  it("rejects duplicate wager values", () => {
    expect(() =>
      scoreRegularRound(2, [
        { questionNo: 1, wagerValue: 2, isCorrect: true },
        { questionNo: 2, wagerValue: 2, isCorrect: false },
        { questionNo: 3, wagerValue: 6, isCorrect: true },
      ]),
    ).toThrow("Round 2 must use wagers 2, 4, 6 exactly once.");
  });

  it("rejects missing questions", () => {
    expect(() =>
      scoreRegularRound(3, [
        { questionNo: 1, wagerValue: 2, isCorrect: true },
        { questionNo: 2, wagerValue: 4, isCorrect: false },
      ]),
    ).toThrow("Round 3 must include exactly 3 questions.");
  });

  it("rejects wrong wager values for the round group", () => {
    expect(() =>
      scoreRegularRound(5, [
        { questionNo: 1, wagerValue: 2, isCorrect: true },
        { questionNo: 2, wagerValue: 7, isCorrect: false },
        { questionNo: 3, wagerValue: 9, isCorrect: true },
      ]),
    ).toThrow("Round 5 must use wagers 5, 7, 9 exactly once.");
  });

  it("requires all six regular rounds", () => {
    expect(() =>
      scoreRegularQuestions([
        { roundNumber: 1, questionNo: 1, wagerValue: 2, isCorrect: true },
        { roundNumber: 1, questionNo: 2, wagerValue: 4, isCorrect: true },
        { roundNumber: 1, questionNo: 3, wagerValue: 6, isCorrect: true },
      ]),
    ).toThrow("Round 2 must include exactly 3 questions.");
  });
});
