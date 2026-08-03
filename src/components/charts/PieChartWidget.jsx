import React, { useState } from 'react';

export default function PieChartWidget({ title = "Status Breakdown" }) {
  const [selectedDeptIdx, setSelectedDeptIdx] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  const departmentsData = [
    {
      deptName: "Social Protection",
      slices: [
        { label: "Present", value: 92, color: "#10B981" },
        { label: "On Time", value: 5, color: "#3B82F6" },
        { label: "Late", value: 3, color: "#F59E0B" },
        { label: "Absent", value: 0, color: "#EF4444" }
      ]
    },
    {
      deptName: "Disability Affairs",
      slices: [
        { label: "Present", value: 80, color: "#10B981" },
        { label: "On Time", value: 10, color: "#3B82F6" },
        { label: "Late", value: 7, color: "#F59E0B" },
        { label: "Absent", value: 3, color: "#EF4444" }
      ]
    },
    {
      deptName: "Women Empowerment",
      slices: [
        { label: "Present", value: 88, color: "#10B981" },
        { label: "On Time", value: 6, color: "#3B82F6" },
        { label: "Late", value: 4, color: "#F59E0B" },
        { label: "Absent", value: 2, color: "#EF4444" }
      ]
    },
    {
      deptName: "Child Protection",
      slices: [
        { label: "Present", value: 90, color: "#10B981" },
        { label: "On Time", value: 7, color: "#3B82F6" },
        { label: "Late", value: 2, color: "#F59E0B" },
        { label: "Absent", value: 1, color: "#EF4444" }
      ]
    }
  ];

  const currentDept = departmentsData[selectedDeptIdx];
  const slices = currentDept.slices;

  return (
    <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      
      {/* Header with Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{title}</h4>
        </div>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3B82F6', backgroundColor: '#EFF6FF', padding: '0.2rem 0.5rem', borderRadius: '0.375rem' }}>
          Chart
        </span>
      </div>

      {/* Always Visible 4 Department Pills Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem' }}>
        {departmentsData.map((d, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDeptIdx(idx)}
            style={{
              padding: '0.35rem 0.25rem',
              borderRadius: '0.375rem',
              border: `1.5px solid ${selectedDeptIdx === idx ? '#4F46E5' : '#E2E8F0'}`,
              backgroundColor: selectedDeptIdx === idx ? '#EEF2FF' : '#F8FAFC',
              color: selectedDeptIdx === idx ? '#3730A3' : '#64748B',
              fontSize: '0.675rem',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center'
            }}
            title={d.deptName}
          >
            {d.deptName}
          </button>
        ))}
      </div>

      {/* Donut Graphic & Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        {/* Donut Graphic */}
        <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            {slices.reduce((acc, slice, idx) => {
              const strokeDasharray = `${slice.value} ${100 - slice.value}`;
              const strokeDashoffset = acc.offset;
              acc.elements.push(
                <circle
                  key={idx}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={activeIdx === idx ? "4.5" : "3.5"}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  onMouseEnter={() => setActiveIdx(idx)}
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
                />
              );
              acc.offset -= slice.value;
              return acc;
            }, { offset: 0, elements: [] }).elements}
          </svg>

          {/* Center Summary */}
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: slices[activeIdx].color, display: 'block' }}>
              {slices[activeIdx].value}%
            </span>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--slate-muted)' }}>
              {slices[activeIdx].label}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          {slices.map((slice, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setActiveIdx(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '0.25rem 0.4rem',
                borderRadius: '0.375rem',
                backgroundColor: activeIdx === idx ? '#F1F5F9' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: slice.color }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0F172A' }}>{slice.label}</span>
              </div>
              <strong style={{ fontSize: '0.75rem', color: slice.color }}>{slice.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
