import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = [
  'hsl(217, 91%, 60%)', 'hsl(262, 83%, 68%)', 'hsl(142, 71%, 55%)',
  'hsl(38, 92%, 60%)', 'hsl(0, 84%, 65%)', 'hsl(187, 85%, 55%)',
  'hsl(311, 75%, 65%)', 'hsl(24, 90%, 63%)',
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const total = payload[0]?.payload?.total || 1;
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
        <p className="text-xs font-bold text-foreground">{payload[0]?.name}</p>
        <p className="text-xs mt-1" style={{ color: payload[0]?.fill || payload[0]?.color }}>
          {payload[0]?.value} ({Math.round(payload[0]?.value / total * 100)}%)
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DonutChart({ data, innerRadius = 50, showLegend = true }) {
  if (!data || data.length === 0) return (
    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Aucune donnée</div>
  );

  const total = data.reduce((s, d) => s + d.value, 0);
  const dataWithTotal = data.map(d => ({ ...d, total }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={dataWithTotal}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius="75%"
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {dataWithTotal.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.fill || COLORS[index % COLORS.length]}
              stroke="hsl(var(--card))"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>{value}</span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}