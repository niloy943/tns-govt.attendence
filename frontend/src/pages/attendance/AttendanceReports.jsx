import React from 'react';
import { BarChart3, FileSpreadsheet, Download, FileText } from 'lucide-react';
import LineChartWidget from '../../components/charts/LineChartWidget';
import PieChartWidget from '../../components/charts/PieChartWidget';

export default function AttendanceReports() {
  const reports = [
    { title: "Daily Attendance Report", desc: "Detailed daily punch logs, check-in/out times, and terminal sources." },
    { title: "Monthly Summary Report", desc: "Aggregated monthly present, late, absent, and leave counts for payroll." },
    { title: "Late Arrivals Compliance Report", desc: "Audit report of late arrivals exceeding the 15-minute grace period." },
    { title: "Unexcused Absence Audit Report", desc: "Report of unauthorized absent days and pro-rata salary deduction flags." },
    { title: "Departmental Attendance Compliance Report", desc: "Department wing performance and punctuality percentages." },
    { title: "Individual Officer Attendance History Report", desc: "Individual officer attendance history log for performance appraisals." }
  ];

  const handleExport = (title, format) => {
    alert(`Generating & Downloading ${title} in ${format.toUpperCase()} format...`);
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
            <BarChart3 size={26} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Attendance Reports
            </h1>
          </div>
        </div>
      </div>

      {/* Visual Chart Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <LineChartWidget title="Daily Punch" />
        <PieChartWidget title="Status Breakdown" />
      </div>

      {/* Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {reports.map((rep, idx) => (
          <div key={idx} className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <FileSpreadsheet size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{rep.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)', margin: '0.5rem 0 1rem 0' }}>{rep.desc}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem', paddingTop: '0.75rem', borderTop: '1px solid var(--slate-border)' }}>
              <button onClick={() => handleExport(rep.title, 'pdf')} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1 }}>PDF</button>
              <button onClick={() => handleExport(rep.title, 'excel')} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1 }}>Excel</button>
              <button onClick={() => handleExport(rep.title, 'csv')} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1 }}>CSV</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
