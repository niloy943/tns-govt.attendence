import React, { useState } from 'react';
import { Calendar, Send, CheckCircle2 } from 'lucide-react';
import PieChartWidget from '../../components/charts/PieChartWidget';
import AreaChartWidget from '../../components/charts/AreaChartWidget';

export default function MonthlySummary() {
  const [month, setMonth] = useState('2026-08');
  const [summaryData, setSummaryData] = useState([
    { id: 1, employee: "Tariqul Islam", working_days: 26, present: 24, late: 0, absent: 0, half_day: 0, approved_leave: 2, official_duty: 0, lwp: 0, working_hours: "192 hrs" },
    { id: 2, employee: "Nusrat Jahan", working_days: 26, present: 22, late: 3, absent: 1, half_day: 0, approved_leave: 0, official_duty: 0, lwp: 0, working_hours: "176 hrs" },
    { id: 3, employee: "Abul Kalam", working_days: 26, present: 25, late: 0, absent: 0, half_day: 0, approved_leave: 1, official_duty: 0, lwp: 0, working_hours: "200 hrs" },
    { id: 4, employee: "Farhana Yasmin", working_days: 26, present: 21, late: 1, absent: 0, half_day: 2, approved_leave: 2, official_duty: 0, lwp: 0, working_hours: "168 hrs" }
  ]);

  const [pushed, setPushed] = useState(false);

  const handleGenerate = () => {
    alert(`Monthly Attendance Summary generated for ${month}!`);
  };

  const handlePushToPayroll = () => {
    setPushed(true);
    alert(`Monthly Summary for ${month} pushed to Payroll Module! Payroll engine will consume this summary.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '0.625rem', borderRadius: '0.75rem' }}>
            <Calendar size={26} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Monthly Summary
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
          <input
            type="month"
            className="form-input"
            style={{ width: 'auto', fontWeight: 700, backgroundColor: '#FFFFFF' }}
            value={month}
            onChange={e => setMonth(e.target.value)}
          />
          <button onClick={handleGenerate} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
            Generate Summary
          </button>
          <button onClick={handlePushToPayroll} className="btn btn-primary" style={{ backgroundColor: '#059669', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Send size={16} /> Push to Payroll
          </button>
        </div>
      </div>

      {/* Visual Chart Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <PieChartWidget title="Status Breakdown" />
        <AreaChartWidget title="Punctuality Trend" />
      </div>

      {pushed && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1.5px solid #A7F3D0', padding: '0.875rem 1.25rem', borderRadius: '0.75rem', color: '#047857', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>
          <CheckCircle2 size={20} color="#059669" />
          <span>Monthly summary for {month} successfully consumed by Payroll Engine. Attendance never calculates salary directly.</span>
        </div>
      )}

      {/* Monthly Summary Table */}
      <div className="card-base" style={{ padding: '1.5rem' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Working Days</th>
                <th>Present</th>
                <th>Late</th>
                <th>Absent</th>
                <th>Half Day</th>
                <th>Approved Leave</th>
                <th>Official Duty</th>
                <th>Leave Without Pay</th>
                <th>Working Hours</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map(row => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>{row.employee}</td>
                  <td style={{ fontWeight: 700 }}>{row.working_days}</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>{row.present}</td>
                  <td style={{ fontWeight: 700, color: '#D97706' }}>{row.late}</td>
                  <td style={{ fontWeight: 700, color: '#DC2626' }}>{row.absent}</td>
                  <td style={{ fontWeight: 700, color: '#4F46E5' }}>{row.half_day}</td>
                  <td style={{ fontWeight: 600 }}>{row.approved_leave}</td>
                  <td style={{ fontWeight: 600 }}>{row.official_duty}</td>
                  <td style={{ fontWeight: 600, color: '#DC2626' }}>{row.lwp}</td>
                  <td style={{ fontWeight: 800 }}>{row.working_hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
