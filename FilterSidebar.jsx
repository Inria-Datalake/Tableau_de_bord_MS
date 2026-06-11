import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = [
  'hsl(217, 91%, 60%)', 'hsl(262, 83%, 68%)', 'hsl(142, 71%, 55%)',
  'hsl(38, 92%, 60%)', 'hsl(0, 84%, 65%)', 'hsl(187, 85%, 55%)',
  'hsl(311, 75%, 65%)', 'hsl(24, 90%, 63%)', 'hsl(160, 70%, 55%)',
  'hsl(45, 90%, 60%)',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
        <p className="text-xs font-bold text-foreground">{label}</p>
        <p className="text-xs text-blue-400 mt-1">{payload[0]?.value} copublications</p>
      </div>
    );
  }
  return null;
};

export default function VerticalBarChart({ data, dataKey = 'count', nameKey = 'name', color }) {
  if (!data || data.length === 0) return (
    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Aucune donnée</div>
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
        <XAxis
          dataKey={nameKey}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={35}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.4)' }} />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((entry, index) => (
            <Cell key={index} fill={color || COLORS[index % COLORS.length]} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}