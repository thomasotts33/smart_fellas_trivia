export function buildGamePayload(overrides: Record<string, unknown> = {}) {
  const rounds = Array.from({ length: 6 }, (_, index) => {
    const roundNumber = index + 1;
    const wagers = roundNumber <= 3 ? [2, 4, 6] : [5, 7, 9];

    return {
      roundNumber,
      questions: wagers.map((wagerValue, wagerIndex) => ({
        questionNo: wagerIndex + 1,
        categoryName: ["History", "Music", "Movies"][wagerIndex] ?? "General",
        wagerValue,
        isCorrect: (roundNumber + wagerIndex) % 2 === 0,
      })),
    };
  });

  return {
    playedAt: "2026-05-06T02:00:00.000Z",
    venueName: "Local Bar",
    placement: 2,
    totalTeams: 12,
    prizeAmount: 25,
    prizeLabel: "Gift card",
    notes: "A real-ish sheet",
    rounds,
    halftime: {
      categoryLabel: "Movies",
      partsTotal: 4,
      partsCorrect: 2,
      pointsPossible: 12,
    },
    finalQuestion: {
      categoryLabel: "Literature",
      wagerValue: 5,
      isCorrect: false,
    },
    ...overrides,
  };
}
