import React, { useState } from 'react';
import { Calendar, Download, Printer } from 'lucide-react';
import { useAttendanceSheet } from '../../hooks/useAttendance';

export default function AttendanceSheet() {
  const [month, setMonth] = useState("08");
  const [year, setYear] = useState("2026");
  const { data: sheet, isLoading } = useAttendanceSheet(month, year);

  if (isLoading) return <div style={{ height: '300px' }} className="skeleton-shimmer"></div>;

  const daysInMonth = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Monthly Biometric Register Matrix</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)' }}>
            Grid view of daily presence status for payroll and ministry compliance auditing.
          </p>
        </div>

        <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => window.print()} className="btn btn-secondary">
            <Printer size={16} /> Print Register
          </button>
          <button className="btn btn-primary">
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      <div className="card-base" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Period:</span>
        <select className="form-select" style={{ width: 'auto' }} value={month} onChange={e => setMonth(e.target.value)}>
          <option value="08">August</option>
          <option value="07">July</option>
          <option value="06">June</option>
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={year} onChange={e => setYear(e.target.value)}>
          <option value="2026">2026</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table" style={{ fontSize: '0.75rem' }}>
          <thead>
            <tr>
              <th style={{ minWidth: '160px' }}>Officer Name</th>
              {daysInMonth.map(d => (
                <th key={d} style={{ textAlign: 'center', padding: '0.5rem 0.25rem' }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(sheet || []).map(row => (
              <tr key={row.employeeId}>
                <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {row.name}
                  <div style={{ fontSize: '0.675rem', color: 'var(--slate-muted)' }}>{row.code}</div>
                </td>
                {daysInMonth.map(d => {
                  const val = row.days[d] || '-';
                  let color = '#64748B';
                  if (val === 'P') color = 'var(--emerald)';
                  if (val === 'L') color = 'var(--amber)';
                  if (val === 'LV') color = 'var(--indigo)';
                  if (val === 'W') color = '#94A3B8';
                  return (
                    <td key={d} style={{ textAlign: 'center', padding: '0.5rem 0.25rem', fontWeight: 700, color }}>
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
