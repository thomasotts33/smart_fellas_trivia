export function getRequiredWagers(roundNumber: number) {
  return roundNumber <= 3 ? [2, 4, 6] : [5, 7, 9];
}

export function validateRoundWagers(roundNumber: number, wagers: number[]) {
  const expected = getRequiredWagers(roundNumber);
  const sortedActual = [...wagers].sort((a, b) => a - b);
  const sortedExpected = [...expected].sort((a, b) => a - b);
  const valid =
    sortedActual.length === sortedExpected.length &&
    sortedActual.every((value, index) => value === sortedExpected[index]);

  return valid ? null : `Round ${roundNumber} needs ${expected.join(", ")} exactly once.`;
}
