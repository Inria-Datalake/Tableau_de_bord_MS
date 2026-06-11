import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
    green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/20 text-orange-400',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`relative overflow-hidden rounded-lg border bg-gradient-to-br p-3 ${c} bg-card`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground truncate">{title}</p>
          <p className="text-xl font-bold text-foreground leading-tight">{value}</p>
          {subtitle && <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>}
          {trend && <p className="text-[10px] font-medium text-emerald-400">↑ {trend}</p>}
        </div>
        {Icon && (
          <div className={`rounded-md bg-gradient-to-br p-2 ${c} flex-shrink-0`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}