import React, { useState } from 'react';
import { Calendar, Search, Filter, Clock, CheckCircle, AlertTriangle, UserX } from 'lucide-react';
import { useAttendanceList } from '../../hooks/useAttendance';
import StatusBadge from '../../components/shared/StatusBadge';

export default function AttendanceList() {
  const [selectedDate, setSelectedDate] = useState('2026-08-02');
  const [search, setSearch] = useState('');
  const { data: attendanceList, isLoading } = useAttendanceList({ date: selectedDate });

  if (isLoading) return <div style={{ height: '300px' }} className="skeleton-shimmer"></div>;

  const filtered = (attendanceList || []).filter(item => 
    item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    item.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
    item.ministryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Daily Attendance Log</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)' }}>
            Real-time biometric punch logs across all Ministry branches.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calendar size={18} style={{ color: 'var(--slate-muted)' }} />
          <input
            type="date"
            className="form-input"
            style={{ width: 'auto' }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="card-base" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '20rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search officer or ministry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Govt Officer</th>
              <th>Ministry / Office</th>
              <th>Punch In</th>
              <th>Punch Out</th>
              <th>Work Hours</th>
              <th>Overtime</th>
              <th>Status</th>
              <th>Biometric Device</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>
                  <div>
                    <p style={{ fontWeight: 600 }}>{row.employeeName}</p>
                    <p style={{ fontSize: '0.725rem', color: 'var(--slate-muted)' }}>{row.employeeCode}</p>
                  </div>
                </td>
                <td>{row.ministryName}</td>
                <td style={{ fontWeight: 600, color: 'var(--emerald)' }}>{row.checkIn}</td>
                <td style={{ fontWeight: 600, color: 'var(--slate-muted)' }}>{row.checkOut}</td>
                <td>{row.workHours}</td>
                <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{row.overtimeHours}</td>
                <td><StatusBadge status={row.status} /></td>
                <td style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>{row.device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
