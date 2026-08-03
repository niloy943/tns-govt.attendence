Safety
Disability
Child
Planningact';

export default function BarChartWidget({ title = "Department-wise Attendance Comparison" }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const data = [
    { label: "Social Protection", present: 96, color: "#10B981" },
    { label: "Disability Affairs", present: 91, color: "#3B82F6" },
    { label: "Women Empowerment", present: 94, color: "#EC4899" },
    { label: "Child Protection", present: 88, color: "#6366F1" },
    { label: "Budget & Finance", present: 98, color: "#8B5CF6" }
  ];

  return (
    <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{title}</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>Percentage of Officers Present Today</p>
        </div>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '0.375rem' }}>
          BAR CHART
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', paddingTop: '1rem', borderBottom: '2px solid #E2E8F0' }}>
        {data.map((item, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              flex: 1,
              height: '100%',
              justifyContent: 'flex-end',
              cursor: 'pointer'
            }}
          >
            {/* Tooltip Value */}
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: item.color, opacity: hoveredIdx === idx ? 1 : 0.8 }}>
              {item.present}%
            </span>

            {/* Bar */}
            <div style={{
              width: '32px',
              height: `${item.present * 1.3}px`,
              backgroundColor: item.color,
              borderRadius: '0.375rem 0.375rem 0 0',
              transition: 'all 0.2s ease',
              transform: hoveredIdx === idx ? 'scaleY(1.05)' : 'scaleY(1)',
              boxShadow: hoveredIdx === idx ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
            }} />

            {/* Label */}
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate-muted)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '64px' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
