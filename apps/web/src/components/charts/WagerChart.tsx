"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type WagerMetric = {
  wagerValue: number;
  netPoints: number;
};

export function WagerChart({ data }: { data: WagerMetric[] }) {
  return (
    <div style={{ height: "180px" }}>
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data} margin={{ bottom: 4, left: -20, right: 8, top: 8 }}>
          <CartesianGrid stroke="#D8CBBB" strokeDasharray="3 3" />
          <XAxis dataKey="wagerValue" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="netPoints" fill="#D8A23A" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
