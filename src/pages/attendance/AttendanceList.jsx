import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  UserX, 
  Eye, 
  Edit3, 
  Building2, 
  Save, 
  X, 
  FileText,
  MapPin,
  Cpu
} from 'lucide-react';
import { useAttendanceList } from '../../hooks/useAttendance';
import { dummyMinistries } from '../../data/dummy/ministries';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';

export default function AttendanceList() {
  const [selectedDate, setSelectedDate] = useState('2026-08-02');
  const [search, setSearch] = useState('');
  const [selectedMinistryId, setSelectedMinistryId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data: initialAttendanceList, isLoading } = useAttendanceList({ date: selectedDate });
  const [attendanceData, setAttendanceData] = useState([]);

  // Sync state when hook resolves
  React.useEffect(() => {
    if (initialAttendanceList) {
      setAttendanceData(initialAttendanceList);
    }
  }, [initialAttendanceList]);

  // Modals state
  const [viewingLog, setViewingLog] = useState(null);
  const [editingLog, setEditingLog] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Filtered Attendance List
  const filteredList = useMemo(() => {
    return attendanceData.filter(item => {
      if (selectedMinistryId !== 'all' && item.ministryId !== Number(selectedMinistryId)) {
        return false;
      }
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      if (search.trim() !== '') {
        const q = search.toLowerCase();
        const nameMatch = item.employeeName.toLowerCase().includes(q);
        const codeMatch = item.employeeCode ? item.employeeCode.toLowerCase().includes(q) : false;
        const minMatch = item.ministryName ? item.ministryName.toLowerCase().includes(q) : false;
        if (!nameMatch && !codeMatch && !minMatch) return false;
      }
      return true;
    });
  }, [attendanceData, selectedMinistryId, selectedStatus, search]);

  const handleOpenEditModal = (log) => {
    setEditingLog(log);
    setEditForm({
      id: log.id,
      checkIn: log.checkIn || '09:00',
      checkOut: log.checkOut || '17:00',
      status: log.status || 'Present',
      remarks: log.remarks || 'Regular Biometric Punch'
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingLog) return;

    setAttendanceData(prev => prev.map(item => item.id === editingLog.id ? {
      ...item,
      checkIn: editForm.checkIn,
      checkOut: editForm.checkOut,
      status: editForm.status,
      remarks: editForm.remarks
    } : item));

    setEditingLog(null);
    alert(`Successfully updated attendance record for ${editingLog.employeeName}!`);
  };

  if (isLoading) return <div style={{ height: '350px' }} className="skeleton-shimmer"></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#4F46E5',
        backgroundImage: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 50%, #7C3AED 100%)',
        color: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.625rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={26} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Daily Biometric Attendance Management
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#E0E7FF', margin: 0, marginTop: '0.125rem' }}>
              Real-time biometric punch logs, check-in/out edits, and attendance status overrides
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '0.35rem 0.875rem', borderRadius: '0.5rem' }}>
          <Calendar size={18} color="#FFFFFF" />
          <input
            type="date"
            className="form-input"
            style={{ width: 'auto', border: 'none', backgroundColor: 'transparent', color: '#FFFFFF', fontWeight: 700 }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="card-base" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center', flex: 1 }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-muted)' }} />
            <input
              type="text"
              placeholder="Search officer or ministry..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
            />
          </div>

          {/* Ministry Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} style={{ color: 'var(--primary)' }} />
            <select
              value={selectedMinistryId}
              onChange={e => setSelectedMinistryId(e.target.value)}
              className="form-input"
              style={{ width: 'auto', minWidth: '200px', fontSize: '0.875rem', fontWeight: 600 }}
            >
              <option value="all">All Ministries</option>
              {dummyMinistries.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Attendance Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} style={{ color: 'var(--slate-muted)' }} />
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="form-input"
              style={{ width: 'auto', fontSize: '0.875rem' }}
            >
              <option value="all">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
              <option value="On Duty">Official Duty (OD)</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>
          {filteredList.length} Punch Logs Displayed
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card-base" style={{ padding: '1.5rem' }}>
        {filteredList.length === 0 ? (
          <EmptyState title="No Attendance Logs" description="No biometric punch log matches your search filters for this date." />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Govt Officer</th>
                  <th>Ministry / Office</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Work Hours</th>
                  <th>Status</th>
                  <th>Remarks / Device</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: 700, margin: 0 }}>{row.employeeName}</p>
                        <p style={{ fontSize: '0.725rem', color: '#4F46E5', fontWeight: 700, margin: 0 }}>{row.employeeCode}</p>
                      </div>
                    </td>
                    <td style={{ color: 'var(--slate-text)', fontWeight: 600 }}>{row.ministryName}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>{row.checkIn || '--:--'}</td>
                    <td style={{ fontWeight: 700, color: '#64748B' }}>{row.checkOut || '--:--'}</td>
                    <td style={{ fontWeight: 600 }}>{row.workHours || '8h 00m'}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>
                      {row.remarks || row.device || "Fingerprint Scanner"}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.375rem' }}>
                        <button onClick={() => setViewingLog(row)} title="View Log Details" className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>
                          <Eye size={16} color="#4F46E5" /> View
                        </button>
                        <button onClick={() => handleOpenEditModal(row)} title="Edit Attendance Punch" className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', color: '#059669' }}>
                          <Edit3 size={16} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW ATTENDANCE LOG MODAL */}
      {viewingLog && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Biometric Punch Log Details</h3>
              <button onClick={() => setViewingLog(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={24} color="#4F46E5" />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800 }}>{viewingLog.employeeName}</h4>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#4F46E5' }}>{viewingLog.employeeCode} • {viewingLog.ministryName}</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Check-In Punch: </span><strong style={{ color: '#059669' }}>{viewingLog.checkIn}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Check-Out Punch: </span><strong style={{ color: '#64748B' }}>{viewingLog.checkOut}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Work Hours: </span><strong>{viewingLog.workHours || '8h 00m'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Attendance Status: </span><StatusBadge status={viewingLog.status} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Biometric Terminal: </span><strong>{viewingLog.device || "Gate 1 - Fingerprint Terminal"}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Remarks / Notes: </span><strong>{viewingLog.remarks || "N/A"}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ATTENDANCE MODAL (FLOWCHART SPEC) */}
      {editingLog && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Edit Attendance Punch Log</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: 0 }}>{editingLog.employeeName} ({editingLog.employeeCode})</p>
              </div>
              <button onClick={() => setEditingLog(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Check-In Time</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editForm.checkIn}
                    onChange={e => setEditForm({ ...editForm, checkIn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Check-Out Time</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editForm.checkOut}
                    onChange={e => setEditForm({ ...editForm, checkOut: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Attendance Status</label>
                <select
                  className="form-select"
                  value={editForm.status}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                  <option value="Half Day">Half Day</option>
                  <option value="On Duty">Official Duty (OD)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Remarks / Adjustment Reason</label>
                <textarea
                  rows={2}
                  className="form-input"
                  placeholder="Enter reason for attendance edit (e.g., Approved Official Duty / Traffic Delay)..."
                  value={editForm.remarks}
                  onChange={e => setEditForm({ ...editForm, remarks: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingLog(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#059669' }}>
                  <Save size={16} /> Save Punch Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
