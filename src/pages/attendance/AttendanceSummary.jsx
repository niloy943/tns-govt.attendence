import React from 'react';
import { BarChart2, Users, CheckCircle, AlertCircle, Clock, Percent } from 'lucide-react';
import { useAttendanceSummary } from '../../hooks/useAttendance';

export default function AttendanceSummary() {
  const { data: summary, isLoading } = useAttendanceSummary();

  if (isLoading) return <div style={{ height: '300px' }} className="skeleton-shimmer"></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Monthly Attendance Summary & Analytics</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)' }}>
          High-level ministry performance metrics and biometric compliance tracking.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>TOTAL STAFF</span>
            <Users size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{summary?.totalEmployees}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--emerald)', marginTop: '0.25rem' }}>Active Officers</p>
        </div>

        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>PRESENT TODAY</span>
            <CheckCircle size={20} style={{ color: 'var(--emerald)' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--emerald)' }}>{summary?.presentToday}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', marginTop: '0.25rem' }}>Punctual & verified</p>
        </div>

        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>LATE ARRIVALS</span>
            <Clock size={20} style={{ color: 'var(--amber)' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--amber)' }}>{summary?.lateToday}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--amber)', marginTop: '0.25rem' }}>Flagged for review</p>
        </div>

        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>ATTENDANCE RATE</span>
            <Percent size={20} style={{ color: 'var(--indigo)' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--indigo)' }}>{summary?.overallAttendancePercentage}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--emerald)', marginTop: '0.25rem' }}>Target: &gt; 90.0%</p>
        </div>
      </div>
    </div>
  );
}
