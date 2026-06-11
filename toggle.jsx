import React from 'react';

export default function ChartCard({ title, subtitle, children, className = '', action }) {
  return (
    <div className={`rounded-xl border border-border bg-card flex flex-col overflow-hidden ${className}`}>
      <div className="flex items-start justify-between px-5 pt-4 pb-2 border-b border-border/50 flex-shrink-0">
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="flex-1 min-h-0 p-4">
        {children}
      </div>
    </div>
  );
}