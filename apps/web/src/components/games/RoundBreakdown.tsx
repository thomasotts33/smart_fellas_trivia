export type GameRound = {
  roundNumber: number;
  questions: {
    id: string;
    questionNo: number;
    categoryName: string;
    wagerValue: number;
    isCorrect: boolean;
    earnedPoints: number;
  }[];
};

export function RoundBreakdown({ rounds }: { rounds: GameRound[] }) {
  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {rounds.map((round) => (
        <section key={round.roundNumber} style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", overflow: "hidden" }}>
          <h2 style={{ background: "var(--sf-primary)", color: "var(--sf-on-primary)", fontFamily: "Oswald, Inter, sans-serif", fontSize: "18px", margin: 0, padding: "8px 10px" }}>
            Round {round.roundNumber}
          </h2>
          {round.questions.map((question) => (
            <div key={question.id} style={{ alignItems: "center", borderTop: "1px solid var(--sf-border)", display: "grid", gap: "8px", gridTemplateColumns: "48px 1fr 72px 96px", padding: "10px" }}>
              <strong>Q{question.questionNo}</strong>
              <span>{question.categoryName}</span>
              <span>{question.wagerValue}</span>
              <span style={{ color: question.isCorrect ? "var(--sf-success, #2F7D4F)" : "var(--sf-error, #B23B3B)", fontWeight: 700 }}>
                {question.earnedPoints} pts
              </span>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
