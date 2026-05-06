import type { DataPoint } from "@/components/charts/TrendLineChart";
import { formatGameDate } from "@/lib/dates";

export function PlacementHistory({ data }: { data: DataPoint[] }) {
  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", padding: "16px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", fontSize: "20px", margin: "0 0 12px" }}>
        Placement history
      </h2>
      {data.length === 0 ? <p style={{ color: "var(--sf-muted)", margin: 0 }}>No placements yet.</p> : null}
      {data.slice(-5).map((point) => (
        <p key={point.date} style={{ margin: "0 0 6px" }}>
          {formatGameDate(point.date)}: <strong>{point.value}</strong>
        </p>
      ))}
    </section>
  );
}
