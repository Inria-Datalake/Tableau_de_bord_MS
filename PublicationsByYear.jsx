import React, { useMemo } from 'react';

const COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#a855f7', '#eab308', '#22c55e', '#e11d48',
];

export default function WordCloud({ data }) {
  const words = useMemo(() => {
    if (!data || data.length === 0) return [];
    const top = data.slice(0, 60);
    const maxVal = top[0]?.value || 1;
    const minVal = top[top.length - 1]?.value || 1;

    return top.map((item, i) => {
      const ratio = (item.value - minVal) / (maxVal - minVal + 1);
      const fontSize = Math.round(12 + ratio * 28);
      return {
        ...item,
        fontSize,
        color: COLORS[i % COLORS.length],
        rotation: Math.random() > 0.85 ? -30 + Math.floor(Math.random() * 60) : 0,
        opacity: 0.7 + ratio * 0.3,
      };
    });
  }, [data]);

  if (!words.length) return (
    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Aucune donnée</div>
  );

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center content-center w-full h-full p-4">
      {words.map((word, i) => (
        <span
          key={i}
          title={`${word.text}: ${word.value} occurrences`}
          style={{
            fontSize: `${word.fontSize}px`,
            color: word.color,
            opacity: word.opacity,
            display: 'inline-block',
            transform: `rotate(${word.rotation}deg)`,
            cursor: 'default',
            transition: 'transform 0.2s, opacity 0.2s',
            lineHeight: 1.2,
            fontWeight: word.fontSize > 28 ? '700' : word.fontSize > 20 ? '600' : '500',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = `rotate(${word.rotation}deg) scale(1.1)`; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = String(word.opacity); e.currentTarget.style.transform = `rotate(${word.rotation}deg) scale(1)`; }}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}