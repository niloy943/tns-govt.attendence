import React from 'react';
import { BarChart3, FileSpreadsheet, Download, Printer, Filter } from 'lucide-react';

export default function Reports() {
  const reportTemplates = [
    { title: "Ministry Attendance Compliance Audit", desc: "Detailed biometric logs grouped by divisional directorate.", format: "PDF / Excel" },
    { title: "Rotational & Medical Leave Summary", desc: "Category-wise breakdown of approved leaves and medical certificates.", format: "PDF / Excel" },
    { title: "Government Personnel Headcount Summary", desc: "Ministry staff distribution and monthly roster allocations.", format: "PDF" },
    { title: "Monthly Overtime Duty Clearance", desc: "Summary of authorized extra hours for payroll processing.", format: "Excel" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Government Reports & Compliance Center</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)' }}>
          Generate standardized report documents for government audit and secretarial submission.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {reportTemplates.map((t, idx) => (
          <div key={idx} className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '0.75rem' }}>
                <FileSpreadsheet size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem' }}>{t.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)', marginBottom: '1rem' }}>{t.desc}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--slate-border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Format: {t.format}</span>
              <button className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                <Download size={14} /> Export
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
