"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type WagerMetric = {
  wagerValue: number;
  netPoints: number;
};

export function WagerChart({ data }: { data: WagerMetric[] }) {
  const best = data.reduce<WagerMetric | null>((winner, wager) => (!winner || wager.netPoints > winner.netPoints ? wager : winner), null);

  return (
    <div
      aria-label={best ? `Wager net points chart. Best wager shown is ${best.wagerValue} with ${best.netPoints} net points.` : "Wager net points chart with no data."}
      className="sf-chart-frame"
      role="img"
    >
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
