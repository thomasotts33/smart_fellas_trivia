import { WagerChart } from "@/components/charts/WagerChart";

export type WagerAnalyticsItem = {
  wagerValue: number;
  attempts: number;
  correct: number;
  percentCorrect: number;
  netPoints: number;
};

export function WagerPerformance({ wagers }: { wagers: WagerAnalyticsItem[] }) {
  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", padding: "16px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", fontSize: "20px", margin: "0 0 12px" }}>
        Wager performance
      </h2>
      {wagers.length === 0 ? <p style={{ color: "var(--sf-muted)", margin: 0 }}>No wagers yet.</p> : null}
      {wagers.length > 0 ? <WagerChart data={wagers} /> : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
        {wagers.map((wager) => (
          <div key={wager.wagerValue} style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", minWidth: "112px", padding: "10px" }}>
            <strong style={{ color: "var(--sf-primary)" }}>{wager.wagerValue}</strong>
            <p style={{ margin: "4px 0" }}>
              {wager.correct}/{wager.attempts} · {wager.percentCorrect}%
            </p>
            <p style={{ color: wager.netPoints >= 0 ? "var(--sf-success)" : "var(--sf-error)", fontWeight: 700, margin: 0 }}>
              {wager.netPoints} pts
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
