import React, { useState } from 'react';
import { Clock, Plus, CheckCircle2, XCircle, FileText } from 'lucide-react';
import StatusBadge from '../../components/shared/StatusBadge';

export default function Overtime() {
  const [otList, setOtList] = useState([
    { id: 1, officer: "Farhana Yasmin", ministry: "Department of Social Services - Dhaka", date: "2026-08-01", hours: "2h 30m", task: "Budget compilation for parliamentary session", status: "approved" },
    { id: 2, officer: "Anisur Rahman", ministry: "Ministry of Social Welfare", date: "2026-08-01", hours: "1h 45m", task: "Emergency relief distribution report preparation", status: "pending" },
    { id: 3, officer: "Tanvir Ahmed", ministry: "Ministry of Women and Children Affairs", date: "2026-07-30", hours: "3h 00m", task: "Special project audit file closing", status: "approved" }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Ministry Overtime Duty Log</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)' }}>
            Track extra working hours and official duty authorization.
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Officer Name</th>
              <th>Ministry / Branch</th>
              <th>Duty Date</th>
              <th>OT Duration</th>
              <th>Assigned Official Task</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {otList.map((row) => (
              <tr key={row.id}>
                <td style={{ fontWeight: 600 }}>{row.officer}</td>
                <td>{row.ministry}</td>
                <td>{row.date}</td>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{row.hours}</td>
                <td style={{ fontSize: '0.8125rem' }}>{row.task}</td>
                <td><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
