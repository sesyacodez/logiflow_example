// SVG-based map visualization for delivery points — no heavy map library needed
'use client';

import { useMemo } from 'react';
import { PRIORITY, PRIORITY_COLOR } from '@/lib/priority/constants';
import { cn } from '@/lib/utils';
import type { DeliveryPoint } from '@/lib/api/types';

// Map bounds for Ukraine region (Kyiv area)
const MAP_BOUNDS = {
  minLat: 50.35, maxLat: 50.58,
  minLng: 30.40, maxLng: 30.65,
};

function latLngToXY(lat: number, lng: number, width: number, height: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * width;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * height;
  return { x, y };
}

interface MapPoint {
  point: DeliveryPoint;
  x: number;
  y: number;
}

interface DeliveryMapProps {
  points: DeliveryPoint[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export function DeliveryMap({ points, selectedId, onSelect }: DeliveryMapProps) {
  const W = 600;
  const H = 400;

  const mapped: MapPoint[] = useMemo(
    () =>
      points.map((p) => ({
        point: p,
        ...latLngToXY(p.coordinates.lat, p.coordinates.lng, W, H),
      })),
    [points]
  );

  function dotColor(priority: 1 | 2 | 3) {
    if (priority === PRIORITY.CRITICAL) return '#EF4444';
    if (priority === PRIORITY.ELEVATED) return '#F59E0B';
    return '#10B981';
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/40">
      {/* Grid background */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        style={{ aspectRatio: `${W}/${H}` }}
        aria-label="Logistics delivery points map"
        role="img"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="1" />
          </pattern>
          <radialGradient id="mapBg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#mapBg)" />
        <rect width={W} height={H} fill="url(#grid)" />

        {/* Route lines between critical points and warehouse */}
        {mapped.filter(m => m.point.priority >= PRIORITY.ELEVATED).map(({ point, x, y }) => (
          <line
            key={`line-${point.id}`}
            x1={W / 2} y1={H / 2}
            x2={x} y2={y}
            stroke={point.priority === PRIORITY.CRITICAL ? '#EF4444' : '#F59E0B'}
            strokeWidth="1"
            strokeOpacity="0.2"
            strokeDasharray="6 4"
          />
        ))}

        {/* Warehouse central point */}
        <circle cx={W / 2} cy={H / 2} r="8" fill="#6366F1" fillOpacity="0.2" stroke="#6366F1" strokeWidth="2" />
        <circle cx={W / 2} cy={H / 2} r="4" fill="#6366F1" />
        <text x={W / 2} y={H / 2 - 16} textAnchor="middle" fill="#94A3B8" fontSize="10">Warehouse Central</text>

        {/* Delivery point markers */}
        {mapped.map(({ point, x, y }) => {
          const color = dotColor(point.priority);
          const isSelected = selectedId === point.id;
          const isCritical = point.priority === PRIORITY.CRITICAL;

          return (
            <g
              key={point.id}
              transform={`translate(${x},${y})`}
              onClick={() => onSelect?.(point.id)}
              className="cursor-pointer"
              role="button"
              aria-label={`${point.name} — priority ${point.priority}`}
            >
              {/* Ping animation for critical */}
              {isCritical && (
                <circle r="16" fill={color} fillOpacity="0.15">
                  <animate attributeName="r" values="12;24;12" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Selection ring */}
              {isSelected && (
                <circle r="18" fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 2" />
              )}

              {/* Main dot */}
              <circle
                r={isSelected ? 10 : 8}
                fill={color}
                fillOpacity="0.9"
                stroke={color}
                strokeWidth="2"
                style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
              />

              {/* Label */}
              <text
                y="-14"
                textAnchor="middle"
                fill="#F1F5F9"
                fontSize="9"
                fontWeight="600"
                style={{ userSelect: 'none' }}
              >
                {point.name.split(' — ')[0]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 px-3 py-2 text-xs">
        {[
          { color: '#EF4444', label: 'Critical' },
          { color: '#F59E0B', label: 'Elevated' },
          { color: '#10B981', label: 'Normal' },
          { color: '#6366F1', label: 'Warehouse' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
