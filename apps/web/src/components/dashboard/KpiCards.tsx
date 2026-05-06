export type Summary = {
  gamesLogged: number;
  totalPoints: number;
  averagePercentCorrect: number;
  prizesWon: number;
  bestCategory?: string;
  weakestCategory?: string;
};

export function KpiCards({ summary }: { summary: Summary }) {
  const cards = [
    { label: "Games", value: summary.gamesLogged },
    { label: "Points", value: summary.totalPoints },
    { label: "Avg correct", value: `${summary.averagePercentCorrect}%` },
    { label: "Prize nights", value: summary.prizesWon },
  ];

  return (
    <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
      {cards.map((card) => (
        <div key={card.label} style={{ background: "var(--sf-surface-raised)", border: "1px solid var(--sf-border)", borderRadius: "8px", padding: "16px" }}>
          <p style={{ color: "var(--sf-muted)", fontWeight: 700, margin: "0 0 6px" }}>{card.label}</p>
          <strong style={{ fontFamily: "Oswald, Inter, sans-serif", fontSize: "28px" }}>{card.value}</strong>
        </div>
      ))}
    </div>
  );
}
