import React from 'react';
import { Calendar } from 'lucide-react';

export default function AttendanceRuleCard() {
  const rules = [
    { status: "Present", effect: "Full Salary", action: "100% Paid" },
    { status: "Approved Leave", effect: "Full Salary", action: "Paid Leave" },
    { status: "Official Duty (OD)", effect: "Full Salary", action: "Executive Duty" },
    { status: "Government Holiday", effect: "Full Salary", action: "Gazetted Holiday" },
    { status: "Absent", effect: "Deduct Salary", action: "Pro-rata Day Deduction" },
    { status: "Half Day", effect: "50%", action: "50% Pay Deduction" },
    { status: "Late", effect: "Warning", action: "Deduct after 3 Lates" }
  ];

  return (
    <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} style={{ color: 'var(--primary)' }} /> Attendance-to-Salary Deduction Matrix
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>
          Rule matrix linking attendance status to payroll deductions
        </p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Attendance Status</th>
              <th>Salary Calculation Effect</th>
              <th>Policy Action</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((row, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 700, color: '#0F172A' }}>{row.status}</td>
                <td style={{ fontWeight: 700, color: row.effect.includes('Deduct') || row.effect.includes('50%') ? '#DC2626' : row.effect.includes('Warning') ? '#D97706' : '#059669' }}>
                  {row.effect}
                </td>
                <td style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
