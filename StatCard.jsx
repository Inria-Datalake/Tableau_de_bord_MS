import React from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip
} from 'recharts';

export default function RadarChartDomaines({ data }) {
  if (!data || data.length === 0) return (
    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Aucune donnée</div>
  );

  const shaped = data.map(d => ({
    subject: d.name.length > 25 ? d.name.slice(0, 22) + '...' : d.name,
    fullName: d.fullName || d.name,
    A: d.count,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl max-w-xs">
          <p className="text-xs font-bold text-foreground break-words">{payload[0]?.payload?.fullName}</p>
          <p className="text-xs text-blue-400 mt-1">{payload[0]?.value} copublications</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={shaped} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
        />
        <Radar
          name="Copublications"
          dataKey="A"
          stroke="hsl(217, 91%, 60%)"
          fill="hsl(217, 91%, 60%)"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}