import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function WorldMap({ data, darkMode }) {
  const [hovered, setHovered] = useState(null);
  
  if (!data || data.length === 0) return (
    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Aucune donnée</div>
  );

  const maxCount = Math.max(...data.map(d => d.count), 1);

  const getRadius = (count) => Math.max(5, Math.min(40, 5 + (count / maxCount) * 35));
  const getColor = (count, isHovered) => {
    const ratio = count / maxCount;
    if (isHovered) return '#f59e0b';
    if (ratio > 0.7) return '#3b82f6';
    if (ratio > 0.4) return '#8b5cf6';
    if (ratio > 0.2) return '#10b981';
    return '#64748b';
  };

  const tileUrl = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <MapContainer
      center={[20, 0]}
      zoom={1.5}
      style={{ width: '100%', height: '100%', background: 'transparent', borderRadius: '0.5rem' }}
      zoomControl={true}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer url={tileUrl} />
      {data.map((country) => (
        <CircleMarker
          key={country.code}
          center={country.coords}
          radius={getRadius(country.count)}
          fillColor={getColor(country.count, hovered === country.code)}
          color={getColor(country.count, hovered === country.code)}
          weight={1.5}
          opacity={0.9}
          fillOpacity={0.55}
          eventHandlers={{
            mouseover: () => setHovered(country.code),
            mouseout: () => setHovered(null),
          }}
        >
          <LeafletTooltip>
            <div className="text-xs">
              <strong>{country.name}</strong><br />
              {country.count} copublications
            </div>
          </LeafletTooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}