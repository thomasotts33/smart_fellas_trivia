"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type CategoryMetric = {
  name: string;
  percentCorrect: number;
};

export function CategoryBarChart({ data }: { data: CategoryMetric[] }) {
  return (
    <div style={{ height: "180px" }}>
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data} margin={{ bottom: 4, left: -20, right: 8, top: 8 }}>
          <CartesianGrid stroke="#D8CBBB" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="percentCorrect" fill="#8F2731" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
