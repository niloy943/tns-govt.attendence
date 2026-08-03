import React, { useState } from 'react';
import { ShieldCheck, Lock, Unlock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StackedBarChartWidget from '../../components/charts/StackedBarChartWidget';

export default function AttendanceApproval() {
  const { currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Workflow State: 'draft' | 'review' | 'approved' | 'locked'
  const [approvalStatus, setApprovalStatus] = useState('review');
  const [selectedMonth, setSelectedMonth] = useState('2026-08');

  const handleStatusChange = (newStatus) => {
    if (approvalStatus === 'locked' && !isSuperAdmin && newStatus !== 'locked') {
      alert("Permission Denied: Locked attendance can only be unlocked by Super Admin!");
      return;
    }
    setApprovalStatus(newStatus);
    alert(`Attendance Status for ${selectedMonth} changed to: ${newStatus.toUpperCase()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Title Header */}
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
            <ShieldCheck size={26} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Attendance Approval
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="month"
            className="form-input"
            style={{ width: 'auto', fontWeight: 700, backgroundColor: '#FFFFFF' }}
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {/* Visual Chart Widget */}
      <StackedBarChartWidget title="Shift Breakdown" />

      {/* Rules & Governance Alert Banner */}
      <div style={{ backgroundColor: '#EEF2FF', border: '1.5px solid #C7D2FE', borderRadius: '0.75rem', padding: '1rem 1.25rem', color: '#3730A3', fontSize: '0.875rem', fontWeight: 600 }}>
        <strong>🔒 Attendance Approval Rules:</strong>
        <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0, fontWeight: 500, fontSize: '0.8125rem' }}>
          <li>Only <strong>APPROVED</strong> attendance will be available for Payroll Module consumption.</li>
          <li><strong>LOCKED</strong> attendance cannot be edited by any ministry staff.</li>
          <li>Unlock permission is exclusively restricted to <strong>Super Admin</strong>.</li>
        </ul>
      </div>

      {/* WORKFLOW STATUS STEPPER (Draft ➔ Review ➔ Approved ➔ Locked) */}
      <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, margin: 0 }}>Workflow Approval Stepper</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { id: 'draft', label: '1. Draft', desc: 'Raw Biometric Logs' },
            { id: 'review', label: '2. Review', desc: 'Supervisor Audit' },
            { id: 'approved', label: '3. Approved', desc: 'Ready for Payroll' },
            { id: 'locked', label: '4. Locked', desc: 'Audit Sealed' }
          ].map(step => {
            const isActive = approvalStatus === step.id;
            return (
              <div
                key={step.id}
                onClick={() => handleStatusChange(step.id)}
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: `2px solid ${isActive ? '#4F46E5' : '#E2E8F0'}`,
                  backgroundColor: isActive ? '#EEF2FF' : '#F8FAFC',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.9375rem', color: isActive ? '#3730A3' : '#0F172A' }}>{step.label}</strong>
                  {isActive && <CheckCircle2 size={18} color="#4F46E5" />}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.25rem 0 0 0' }}>{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-border)' }}>
          <button onClick={() => handleStatusChange('review')} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
            <FileText size={16} /> Set to Review
          </button>
          <button onClick={() => handleStatusChange('approved')} className="btn btn-primary" style={{ backgroundColor: '#059669', fontSize: '0.8125rem' }}>
            <CheckCircle2 size={16} /> Approve Attendance
          </button>
          {approvalStatus === 'locked' ? (
            <button onClick={() => handleStatusChange('approved')} className="btn btn-secondary" style={{ color: '#D97706', fontSize: '0.8125rem' }} disabled={!isSuperAdmin}>
              <Unlock size={16} /> Unlock Month (Super Admin Only)
            </button>
          ) : (
            <button onClick={() => handleStatusChange('locked')} className="btn btn-secondary" style={{ color: '#DC2626', fontSize: '0.8125rem' }}>
              <Lock size={16} /> Lock Attendance Month
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
