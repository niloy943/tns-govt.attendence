import React, { useState } from 'react';
import { Edit3, Check, X, ArrowRight, ShieldCheck, Clock, FileText } from 'lucide-react';

export default function AttendanceCorrections() {
  const [corrections, setCorrections] = useState([
    {
      id: 1,
      employee_id: 2,
      officer_name: "Nusrat Jahan",
      date: "2026-08-03",
      old_check_in: "09:22 AM",
      new_check_in: "08:58 AM",
      old_check_out: "05:00 PM",
      new_check_out: "05:00 PM",
      reason: "Biometric scanner finger misread error at Gate 01",
      status: "Pending",
      approved_by: null
    },
    {
      id: 2,
      employee_id: 4,
      officer_name: "Farhana Yasmin",
      date: "2026-08-02",
      old_check_in: "11:15 AM",
      new_check_in: "09:00 AM",
      old_check_out: "05:00 PM",
      new_check_out: "05:00 PM",
      reason: "Official Duty at Secretariat Cabinet Meeting",
      status: "Approved",
      approved_by: "Super Admin (Tariqul Islam)"
    }
  ]);

  const handleAction = (id, newStatus) => {
    setCorrections(prev => prev.map(item => item.id === id ? {
      ...item,
      status: newStatus,
      approved_by: newStatus === 'Approved' ? 'Super Admin (Tariqul Islam)' : 'Rejected'
    } : item));
    alert(`Correction Request #${id} ${newStatus.toUpperCase()}!`);
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
            <Edit3 size={26} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Attendance Corrections & Manual Requests
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '0.125rem 0 0 0' }}>
              Schema: <code style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#38BDF8', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>attendance_corrections</code>
            </p>
          </div>
        </div>
      </div>

      {/* WORKFLOW TRACKING BANNER */}
      <div className="card-base" style={{ padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--slate-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Correction Request Workflow
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', fontWeight: 700 }}>
          <span style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.35rem 0.75rem', borderRadius: '0.375rem' }}>Correction Request</span>
          <ArrowRight size={16} color="#94A3B8" />
          <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.35rem 0.75rem', borderRadius: '0.375rem' }}>Review</span>
          <ArrowRight size={16} color="#94A3B8" />
          <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.35rem 0.75rem', borderRadius: '0.375rem' }}>Approve / Reject</span>
          <ArrowRight size={16} color="#94A3B8" />
          <span style={{ backgroundColor: '#059669', color: '#FFFFFF', padding: '0.35rem 0.75rem', borderRadius: '0.375rem' }}>Attendance Updated</span>
        </div>
      </div>

      {/* Corrections Table (Audit Trail) */}
      <div className="card-base" style={{ padding: '1.5rem' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Officer</th>
                <th>Date</th>
                <th>Old Check In ➔ New Check In</th>
                <th>Old Check Out ➔ New Check Out</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Approved By</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {corrections.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>{item.officer_name}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{item.date}</td>
                  <td>
                    <span style={{ color: '#DC2626', textDecoration: 'line-through', marginRight: '0.375rem' }}>{item.old_check_in}</span>
                    <ArrowRight size={12} color="#94A3B8" style={{ display: 'inline', margin: '0 0.25rem' }} />
                    <span style={{ color: '#059669', fontWeight: 800 }}>{item.new_check_in}</span>
                  </td>
                  <td>
                    <span style={{ color: '#DC2626', textDecoration: 'line-through', marginRight: '0.375rem' }}>{item.old_check_out}</span>
                    <ArrowRight size={12} color="#94A3B8" style={{ display: 'inline', margin: '0 0.25rem' }} />
                    <span style={{ color: '#059669', fontWeight: 800 }}>{item.new_check_out}</span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>{item.reason}</td>
                  <td>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: item.status === 'Approved' ? '#047857' : item.status === 'Rejected' ? '#991B1B' : '#92400E',
                      backgroundColor: item.status === 'Approved' ? '#ECFDF5' : item.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '0.375rem'
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.approved_by || '--'}</td>
                  <td style={{ textAlign: 'right' }}>
                    {item.status === 'Pending' ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.375rem' }}>
                        <button onClick={() => handleAction(item.id, 'Approved')} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#059669' }}>
                          <Check size={14} /> Approve
                        </button>
                        <button onClick={() => handleAction(item.id, 'Rejected')} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#DC2626' }}>
                          <X size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
