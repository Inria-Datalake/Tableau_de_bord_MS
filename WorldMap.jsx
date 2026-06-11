import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = [
  'hsl(217, 91%, 60%)', 'hsl(262, 83%, 68%)', 'hsl(142, 71%, 55%)',
  'hsl(38, 92%, 60%)', 'hsl(0, 84%, 65%)', 'hsl(187, 85%, 55%)',
  'hsl(311, 75%, 65%)', 'hsl(24, 90%, 63%)', 'hsl(160, 70%, 55%)',
  'hsl(45, 90%, 60%)', 'hsl(200, 80%, 60%)', 'hsl(280, 70%, 65%)',
  'hsl(90, 70%, 55%)', 'hsl(330, 80%, 65%)', 'hsl(60, 80%, 55%)',
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl max-w-xs">
        <p className="text-xs font-bold text-foreground break-words">{payload[0]?.payload?.fullName || payload[0]?.payload?.name}</p>
        <p className="text-xs text-blue-400 mt-1">{payload[0]?.value} copublications</p>
      </div>
    );
  }
  return null;
};

export default function HorizontalBarChart({ data, color }) {
  if (!data || data.length === 0) return (
    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Aucune donnée</div>
  );

  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 30, left: 5, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.7} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.3)' }} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {sorted.map((entry, index) => (
            <Cell key={index} fill={color || COLORS[index % COLORS.length]} fillOpacity={1} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}