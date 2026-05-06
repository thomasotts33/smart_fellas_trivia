"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type DataPoint = {
  date: string;
  value: number;
};

export function TrendLineChart({ data, label }: { data: DataPoint[]; label: string }) {
  const chartData = data.map((point) => ({
    ...point,
    dateLabel: new Date(point.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  }));

  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", minHeight: "260px", padding: "16px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", fontSize: "20px", margin: "0 0 12px" }}>{label}</h2>
      <div style={{ height: "190px" }}>
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={chartData} margin={{ bottom: 4, left: -18, right: 12, top: 8 }}>
            <CartesianGrid stroke="#D8CBBB" strokeDasharray="3 3" />
            <XAxis dataKey="dateLabel" />
            <YAxis />
            <Tooltip />
            <Line dataKey="value" dot stroke="#8F2731" strokeWidth={3} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p style={{ color: "var(--sf-muted)", fontSize: "13px", margin: "10px 0 0" }}>
        {chartData.length > 0
          ? `${label} from ${chartData[0]?.dateLabel} to ${chartData.at(-1)?.dateLabel}.`
          : `No ${label.toLowerCase()} data yet.`}
      </p>
    </section>
  );
}
