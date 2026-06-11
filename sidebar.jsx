import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
        <p className="text-xs font-bold text-foreground">{label}</p>
        <p className="text-xs text-blue-400">{payload[0]?.value} copublications</p>
      </div>
    );
  }
  return null;
};

export default function PublicationsByYear({ data }) {
  if (!data || data.length === 0) return (
    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Aucune donnée</div>
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(217, 91%, 55%)" stopOpacity={0.6} />
            <stop offset="95%" stopColor="hsl(217, 91%, 55%)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.8} />
        <XAxis
          dataKey="year"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          name="Publications"
          stroke="hsl(217, 91%, 55%)"
          strokeWidth={3}
          fill="url(#colorCount)"
          dot={{ fill: 'hsl(217, 91%, 55%)', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: 'hsl(217, 91%, 60%)', strokeWidth: 2, stroke: 'white' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}