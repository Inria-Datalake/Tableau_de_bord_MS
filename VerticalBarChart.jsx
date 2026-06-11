import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function getColor(count, max) {
  const ratio = count / max;
  if (ratio > 0.7) return '#1d4ed8';
  if (ratio > 0.4) return '#3b82f6';
  if (ratio > 0.2) return '#60a5fa';
  if (ratio > 0.08) return '#34d399';
  return '#a78bfa';
}

function CountryRanking({ data, onHover, hovered }) {
  const top = data.slice(0, 10);
  const max = data[0]?.count || 1;
  return (
    <div
      className="absolute top-3 left-3 z-[1000] rounded-xl border border-border shadow-xl p-3 w-52 text-xs overflow-y-auto"
      style={{ background: 'hsl(var(--card) / 0.95)', maxHeight: 'calc(100% - 1.5rem)' }}
    >
      <p className="font-bold text-foreground mb-2">🏆 Top 10 Pays</p>
      {top.map((c, i) => (
        <div
          key={c.code}
          className={`flex items-center gap-2 py-1 px-1 rounded cursor-pointer transition-colors ${hovered === c.code ? 'bg-primary/20' : 'hover:bg-muted/60'}`}
          onMouseEnter={() => onHover(c.code)}
          onMouseLeave={() => onHover(null)}
        >
          <span className="w-4 text-center font-bold text-muted-foreground shrink-0">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium text-foreground">{c.name}</p>
            <div className="mt-0.5 h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(c.count / max) * 100}%` }} />
            </div>
          </div>
          <span className="text-primary font-bold tabular-nums shrink-0">{c.count.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function MapLegend({ max }) {
  const steps = [
    { label: `≥ ${Math.round(max * 0.7).toLocaleString()}`, color: '#1d4ed8' },
    { label: `≥ ${Math.round(max * 0.4).toLocaleString()}`, color: '#3b82f6' },
    { label: `≥ ${Math.round(max * 0.2).toLocaleString()}`, color: '#60a5fa' },
    { label: `≥ ${Math.round(max * 0.08).toLocaleString()}`, color: '#34d399' },
    { label: 'Autres', color: '#a78bfa' },
  ];
  return (
    <div
      className="absolute bottom-3 right-3 z-[1000] rounded-xl border border-border shadow-xl px-3 py-2.5 text-xs"
      style={{ background: 'hsl(var(--card) / 0.95)' }}
    >
      <p className="font-bold text-foreground mb-1.5">Copublications</p>
      {steps.map(s => (
        <div key={s.label} className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
          <span className="text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function ChoroplethMap({ data, darkMode }) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Aucune donnée</div>;
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  const tileUrl = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={[20, 10]}
        zoom={2}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        attributionControl={false}
        minZoom={1}
        maxZoom={8}
      >
        <TileLayer url={tileUrl} />
        {data.map((country, idx) => {
          const isHovered = hovered === country.code;
          const isSelected = selected?.code === country.code;
          const radius = Math.max(6, Math.min(40, 6 + (country.count / maxCount) * 34));
          const color = getColor(country.count, maxCount);
          const pct = ((country.count / totalCount) * 100).toFixed(1);
          const rank = idx + 1;
          return (
            <CircleMarker
              key={country.code}
              center={country.coords}
              radius={isHovered || isSelected ? radius + 4 : radius}
              fillColor={color}
              color={isSelected ? '#f59e0b' : isHovered ? '#ffffff' : color}
              weight={isSelected ? 3 : isHovered ? 2 : 1}
              opacity={1}
              fillOpacity={isHovered || isSelected ? 0.9 : 0.65}
              eventHandlers={{
                mouseover: () => setHovered(country.code),
                mouseout: () => setHovered(null),
                click: () => setSelected(selected?.code === country.code ? null : country),
              }}
            >
              <LeafletTooltip direction="top" offset={[0, -(radius + 4)]} permanent={false}>
                <div style={{ fontFamily: 'Inter, sans-serif', padding: '6px 8px', minWidth: '160px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '13px', color: '#f1f5f9' }}>{country.name}</strong>
                    <span style={{ fontSize: '10px', background: '#1e3a5f', color: '#60a5fa', borderRadius: '999px', padding: '1px 6px', marginLeft: '6px' }}>#{rank}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#60a5fa' }}>{country.count.toLocaleString()}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>copublications</span>
                  </div>
                  <div style={{ background: '#1e293b', borderRadius: '4px', height: '5px', marginBottom: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(country.count / maxCount) * 100}%`, height: '100%', background: color, borderRadius: '4px' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    <span style={{ color: '#34d399', fontWeight: '600' }}>{pct}%</span> du total mondial
                  </div>
                </div>
              </LeafletTooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <CountryRanking data={data} onHover={setHovered} hovered={hovered} />
      <MapLegend max={maxCount} />

      {selected && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] rounded-xl border border-primary/50 bg-card/97 shadow-2xl px-5 py-3 text-sm flex items-center gap-4">
          <div>
            <p className="font-bold text-foreground text-base">{selected.name}</p>
            <p className="text-muted-foreground text-xs mt-0.5">Code : {selected.code}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">{selected.count.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">copublications</p>
          </div>
          <button onClick={() => setSelected(null)} className="ml-2 p-1 rounded hover:bg-muted text-muted-foreground">✕</button>
        </div>
      )}
    </div>
  );
}