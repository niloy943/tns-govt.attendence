import React, { useState } from 'react';

export default function LineChartWidget({ title = "Daily Punch" }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const data = [
    { time: "08:00 AM", punches: 5 },
    { time: "08:30 AM", punches: 18 },
    { time: "09:00 AM", punches: 42 },
    { time: "09:30 AM", punches: 12 },
    { time: "10:00 AM", punches: 6 },
    { time: "10:30 AM", punches: 3 }
  ];

  const maxVal = 50;
  const width = 500;
  const height = 180;
  const padding = 30;

  const points = data.map((d, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - (d.punches / maxVal) * (height - 2 * padding);
    return { x, y, ...d };
  });

  // Cubic Bezier curve path
  const pathD = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = a[i - 1];
    const cx1 = prev.x + (point.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (point.x - prev.x) / 2;
    const cy2 = point.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${point.x},${point.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{title}</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>Peak at 09:00 AM</p>
        </div>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4F46E5', backgroundColor: '#EEF2FF', padding: '0.2rem 0.5rem', borderRadius: '0.375rem' }}>
          Line
        </span>
      </div>

      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#lineGrad)" />

          {/* Line Stroke */}
          <path d={pathD} fill="none" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />

          {/* Data Points & Hover Tooltips */}
          {points.map((p, idx) => (
            <g key={idx} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)} style={{ cursor: 'pointer' }}>
              <circle cx={p.x} cy={p.y} r={hoveredIdx === idx ? 7 : 5} fill="#FFFFFF" stroke="#4F46E5" strokeWidth="3" />
              
              {/* X Axis Labels */}
              <text x={p.x} y={height - 8} fontSize="10" fontWeight="600" fill="#64748B" textAnchor="middle">{p.time}</text>

              {/* Tooltip */}
              {hoveredIdx === idx && (
                <g>
                  <rect x={p.x - 30} y={p.y - 32} width="60" height="22" rx="4" fill="#0F172A" />
                  <text x={p.x} y={p.y - 18} fontSize="10" fontWeight="800" fill="#FFFFFF" textAnchor="middle">
                    {p.punches} Punches
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
