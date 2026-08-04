import React, { useState } from 'react';

export default function StackedBarChartWidget({ title = "Shift Breakdown" }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const shifts = [
    { name: "Morning (09:00-17:00)", present: 42, rate: 85, color: "#10B981" },
    { name: "Evening (14:00-22:00)", present: 8, rate: 90, color: "#3B82F6" },
    { name: "Night (22:00-06:00)", present: 4, rate: 95, color: "#8B5CF6" }
  ];

  return (
    <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{title}</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>Shift Attendance Bars</p>
        </div>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.2rem 0.5rem', borderRadius: '0.375rem' }}>
          Bar
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {shifts.map((shift, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ fontWeight: 700, color: '#0F172A' }}>{shift.name}</span>
              <span style={{ fontWeight: 800, color: shift.color }}>{shift.present} Officers ({shift.rate}%)</span>
            </div>

            {/* Gradient Solid Bar */}
            <div style={{ height: '10px', width: '100%', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${shift.rate}%`, 
                  backgroundColor: shift.color, 
                  height: '100%', 
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease'
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
