import React from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function NotificationRuleCard() {
  const triggers = [
    { title: "Payroll Generated", status: "Active", desc: "Triggers instant notification & status badge when payroll is calculated" },
    { title: "Payroll Locked", status: "Active", desc: "Triggers lock notification & freezes payroll edits for approval" },
    { title: "Budget Warning", status: "Active", desc: "Triggers amber (>90%) or critical (>100%) budget alert banners" },
    { title: "Salary Updated", status: "Active", desc: "Triggers notification toast when officer salary parameters are updated" }
  ];

  return (
    <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={20} style={{ color: '#10B981' }} /> Notification & Alert Flowchart Triggers
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>
          Real-time event notification rules and toast triggers
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {triggers.map((item, idx) => (
          <div key={idx} style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <CheckCircle2 size={20} style={{ color: '#059669', flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>{item.title}</strong>
                <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#047857', backgroundColor: '#ECFDF5', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>✔ {item.status}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.25rem 0 0 0' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
