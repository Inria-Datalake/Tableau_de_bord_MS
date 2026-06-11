import React, { useEffect, useRef, useMemo } from 'react';

const CENTRE_COLORS = {
  'Inria Paris': '#3b82f6',
  'Inria Saclay': '#8b5cf6',
  'Inria Univ. Grenoble': '#10b981',
  'Inria Univ. Cote Azur': '#f59e0b',
  'Inria Univ. Rennes': '#ef4444',
  'Inria Lille': '#06b6d4',
  'Inria Univ. Bordeaux': '#ec4899',
  'Inria Univ. Lorraine': '#84cc16',
};

function getColor(name) {
  if (CENTRE_COLORS[name]) return CENTRE_COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

export default function NetworkGraph({ data }) {
  const svgRef = useRef(null);

  const { nodes, edges, centres, orgs } = useMemo(() => {
    if (!data || data.length === 0) return { nodes: [], edges: [], centres: [], orgs: [] };

    const centreSet = new Set();
    const orgSet = new Set();
    data.forEach(d => {
      centreSet.add(d.source);
      orgSet.add(d.target);
    });

    const centreArr = [...centreSet];
    const orgArr = [...orgSet].slice(0, 20);

    const centreNodes = centreArr.map((name, i) => {
      const angle = (i / centreArr.length) * 2 * Math.PI - Math.PI / 2;
      return {
        id: name, name, type: 'centre',
        x: 280 + 130 * Math.cos(angle),
        y: 210 + 130 * Math.sin(angle),
        r: 14, color: getColor(name),
      };
    });

    const orgNodes = orgArr.map((name, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;
      return {
        id: name, name, type: 'org',
        x: 60 + col * 150,
        y: 430 + row * 55,
        r: 8, color: '#94a3b8',
      };
    });

    const nodeMap = {};
    [...centreNodes, ...orgNodes].forEach(n => nodeMap[n.id] = n);

    const edgesFiltered = data
      .filter(d => nodeMap[d.source] && nodeMap[d.target])
      .slice(0, 40);

    const maxVal = Math.max(...edgesFiltered.map(e => e.value), 1);

    return {
      nodes: [...centreNodes, ...orgNodes],
      edges: edgesFiltered.map(e => ({
        ...e,
        opacity: 0.15 + (e.value / maxVal) * 0.55,
        strokeWidth: 0.5 + (e.value / maxVal) * 3,
        x1: nodeMap[e.source].x, y1: nodeMap[e.source].y,
        x2: nodeMap[e.target].x, y2: nodeMap[e.target].y,
      })),
      centres: centreNodes,
      orgs: orgNodes,
    };
  }, [data]);

  if (!data || data.length === 0) return (
    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Aucune donnée</div>
  );

  return (
    <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 560 530" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke={getColor(e.source)}
          strokeWidth={e.strokeWidth}
          opacity={e.opacity}
        />
      ))}

      {/* Centre nodes */}
      {centres.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r + 4} fill={n.color} opacity={0.15} />
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} filter="url(#glow)" />
          <text
            x={n.x} y={n.y - n.r - 5}
            textAnchor="middle"
            fill="hsl(var(--foreground))"
            fontSize="9"
            fontWeight="600"
          >
            {n.name.replace('Inria ', '').replace('Univ. ', '')}
          </text>
        </g>
      ))}

      {/* Org nodes */}
      {orgs.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={0.7} />
          <text
            x={n.x + n.r + 4} y={n.y + 4}
            fill="hsl(var(--muted-foreground))"
            fontSize="8"
          >
            {n.name.length > 22 ? n.name.slice(0, 20) + '…' : n.name}
          </text>
        </g>
      ))}

      {/* Legend */}
      <text x="10" y="16" fill="hsl(var(--muted-foreground))" fontSize="9" opacity="0.7">● Centres Inria</text>
      <text x="10" y="28" fill="hsl(var(--muted-foreground))" fontSize="9" opacity="0.7">○ Organismes partenaires</text>
    </svg>
  );
}