import React, { useState } from 'react';
import { UserCheck, Search, Calendar, Shield, Clock } from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployees';
import { dummyAttendanceList } from '../../data/dummy/attendance';
import StatusBadge from '../../components/shared/StatusBadge';

export default function AttendanceIndividual() {
  const { data: employees } = useEmployees();
  const [selectedEmpId, setSelectedEmpId] = useState(1);

  const selectedEmp = (employees || []).find(e => e.id === Number(selectedEmpId)) || employees?.[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Individual Officer Attendance Record</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)' }}>
          Detailed monthly punch records and punctual performance inspection per officer.
        </p>
      </div>

      <div className="card-base" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Select Officer:</span>
        <select
          className="form-select"
          style={{ maxWidth: '20rem' }}
          value={selectedEmpId}
          onChange={(e) => setSelectedEmpId(e.target.value)}
        >
          {(employees || []).map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeCode}) - {emp.ministryName}</option>
          ))}
        </select>
      </div>

      {selectedEmp && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1.5rem' }}>
          {/* Profile Card */}
          <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <img
              src={selectedEmp.avatar}
              alt={selectedEmp.name}
              style={{ width: '80px', height: '80px', borderRadius: '9999px', objectFit: 'cover', marginBottom: '1rem', border: '3px solid var(--primary-light)' }}
            />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{selectedEmp.name}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{selectedEmp.designation}</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>{selectedEmp.ministryName}</p>
            <span className="badge badge-info" style={{ marginTop: '0.75rem' }}>{selectedEmp.grade}</span>

            <div style={{ width: '100%', borderTop: '1px solid var(--slate-border)', marginTop: '1.25rem', paddingTop: '1rem', textAlign: 'left', fontSize: '0.8125rem' }}>
              <p style={{ marginBottom: '0.375rem' }}><strong>Code:</strong> {selectedEmp.employeeCode}</p>
              <p style={{ marginBottom: '0.375rem' }}><strong>Joined:</strong> {selectedEmp.joiningDate}</p>
              <p><strong>Email:</strong> {selectedEmp.email}</p>
            </div>
          </div>

          {/* Individual History Table */}
          <div className="card-base" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>August 2026 Monthly Logs</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Worked</th>
                    <th>Overtime</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyAttendanceList.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{row.date}</td>
                      <td style={{ color: 'var(--emerald)' }}>{row.checkIn}</td>
                      <td>{row.checkOut}</td>
                      <td>{row.workHours}</td>
                      <td>{row.overtimeHours}</td>
                      <td><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
