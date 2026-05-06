"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type CategoryMetric = {
  name: string;
  percentCorrect: number;
};

function shortLabel(label: string) {
  return label.length > 12 ? `${label.slice(0, 11)}...` : label;
}

export function CategoryBarChart({ data }: { data: CategoryMetric[] }) {
  const best = data[0];

  return (
    <div
      aria-label={best ? `Category accuracy chart. Best visible category is ${best.name} at ${best.percentCorrect} percent.` : "Category accuracy chart with no data."}
      className="sf-chart-frame"
      role="img"
    >
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data} margin={{ bottom: 4, left: -20, right: 8, top: 8 }}>
          <CartesianGrid stroke="#D8CBBB" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} tickFormatter={shortLabel} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="percentCorrect" fill="#8F2731" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
