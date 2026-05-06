export type RoundAnalyticsItem = {
  label: string;
  pointsEarned: number;
  pointsPossible: number;
  attempts: number;
  correct: number;
  percentOfPossible: number;
};

export function RoundPerformance({ rounds }: { rounds: RoundAnalyticsItem[] }) {
  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", padding: "16px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", fontSize: "20px", margin: "0 0 12px" }}>
        Round performance
      </h2>
      <div style={{ display: "grid", gap: "8px" }}>
        {rounds.map((round) => (
          <div key={round.label} style={{ display: "grid", gap: "8px", gridTemplateColumns: "minmax(0, 1fr) auto" }}>
            <strong>{round.label}</strong>
            <span>
              {round.pointsEarned}/{round.pointsPossible}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
