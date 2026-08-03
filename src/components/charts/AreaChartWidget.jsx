import React, { useState } from 'react';

export default function AreaChartWidget({ title = "Punctuality" }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const data = [
    { day: "Day 1", rate: 88, onTime: 82 },
    { day: "Day 5", rate: 92, onTime: 86 },
    { day: "Day 10", rate: 90, onTime: 84 },
    { day: "Day 15", rate: 95, onTime: 91 },
    { day: "Day 20", rate: 93, onTime: 89 },
    { day: "Day 25", rate: 97, onTime: 94 },
    { day: "Day 30", rate: 98, onTime: 96 }
  ];

  const maxVal = 100;
  const width = 500;
  const height = 160;
  const padding = 25;

  const points = data.map((d, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
    const yRate = height - padding - (d.rate / maxVal) * (height - 2 * padding);
    const yOnTime = height - padding - (d.onTime / maxVal) * (height - 2 * padding);
    return { x, yRate, yOnTime, ...d };
  });

  const pathRateD = points.reduce((acc, point, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${point.x},${point.yRate}`, "");
  const pathOnTimeD = points.reduce((acc, point, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${point.x},${point.yOnTime}`, "");

  const areaRateD = `${pathRateD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;
  const areaOnTimeD = `${pathOnTimeD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{title}</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>Punctuality Trend</p>
        </div>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#7E22CE', backgroundColor: '#F3E8FF', padding: '0.2rem 0.5rem', borderRadius: '0.375rem' }}>
          Area
        </span>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="areaGradRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="areaGradOnTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fills */}
          <path d={areaRateD} fill="url(#areaGradRate)" />
          <path d={areaOnTimeD} fill="url(#areaGradOnTime)" />

          {/* Lines */}
          <path d={pathRateD} fill="none" stroke="#10B981" strokeWidth="2.5" />
          <path d={pathOnTimeD} fill="none" stroke="#3B82F6" strokeWidth="2.5" />

          {/* Hover Dots & X Labels */}
          {points.map((p, idx) => (
            <g key={idx} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)} style={{ cursor: 'pointer' }}>
              <circle cx={p.x} cy={p.yRate} r={hoveredIdx === idx ? 6 : 4} fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
              <text x={p.x} y={height - 5} fontSize="9" fontWeight="600" fill="#64748B" textAnchor="middle">{p.day}</text>

              {hoveredIdx === idx && (
                <g>
                  <rect x={p.x - 35} y={p.yRate - 30} width="70" height="22" rx="4" fill="#0F172A" />
                  <text x={p.x} y={p.yRate - 16} fontSize="9" fontWeight="800" fill="#FFFFFF" textAnchor="middle">
                    {p.rate}% / {p.onTime}%
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
