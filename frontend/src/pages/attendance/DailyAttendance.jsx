import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  Eye, 
  Edit3, 
  Zap, 
  X, 
  Clock, 
  Cpu, 
  CheckCircle, 
  AlertTriangle, 
  Save, 
  ShieldCheck 
} from 'lucide-react';
import { useAttendanceList } from '../../hooks/useAttendance';
import { useAuth } from '../../context/AuthContext';
import { dummyMinistries } from '../../data/dummy/ministries';
import StatusBadge from '../../components/shared/StatusBadge';

import LineChartWidget from '../../components/charts/LineChartWidget';
import BarChartWidget from '../../components/charts/BarChartWidget';

export default function DailyAttendance() {
  const { currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isMinistryAdmin = currentUser?.role === 'ministry_admin';
  const canOverride = isSuperAdmin || isMinistryAdmin;

  // Filters State
  const [selectedDate, setSelectedDate] = useState('2026-08-03');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMinistryId, setSelectedMinistryId] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data: initialList, isLoading } = useAttendanceList({ date: selectedDate });
  const [logs, setLogs] = useState([]);

  React.useEffect(() => {
    if (initialList) setLogs(Array.isArray(initialList) ? initialList : (initialList.data || []));
  }, [initialList]);

  // Drawer State
  const [drawerLog, setDrawerLog] = useState(null);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' | 'edit' | 'override'
  const [drawerForm, setDrawerForm] = useState({});

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(item => {
      if (selectedMinistryId !== 'all' && item.ministryId !== Number(selectedMinistryId)) return false;
      if (selectedDepartment !== 'all' && item.department !== selectedDepartment) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const nameMatch = item.employeeName?.toLowerCase().includes(q);
        const codeMatch = item.employeeCode?.toLowerCase().includes(q);
        if (!nameMatch && !codeMatch) return false;
      }
      return true;
    });
  }, [logs, selectedMinistryId, selectedDepartment, selectedStatus, searchQuery]);

  const handleOpenDrawer = (log, mode) => {
    setDrawerLog(log);
    setDrawerMode(mode);
    setDrawerForm({
      checkIn: log.checkIn || '09:00',
      checkOut: log.checkOut || '17:00',
      status: log.status || 'Present',
      remarks: log.remarks || 'Regular Biometric Punch',
      overrideReason: ''
    });
  };

  const handleSaveDrawer = (e) => {
    e.preventDefault();
    if (!drawerLog) return;

    setLogs(prev => prev.map(item => item.id === drawerLog.id ? {
      ...item,
      checkIn: drawerForm.checkIn,
      checkOut: drawerForm.checkOut,
      status: drawerForm.status,
      remarks: drawerForm.remarks,
      isOverridden: drawerMode === 'override'
    } : item));

    alert(`Successfully ${drawerMode === 'override' ? 'overridden' : 'updated'} attendance for ${drawerLog.employeeName}!`);
    setDrawerLog(null);
  };

  if (isLoading) return <div style={{ height: '400px' }} className="skeleton-shimmer"></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Title Header */}
      <div style={{
        backgroundColor: '#0F172A',
        backgroundImage: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
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
            <Clock size={26} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Daily Attendance
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.35rem 0.875rem', borderRadius: '0.5rem' }}>
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

      {/* Visual Chart Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <LineChartWidget title="Daily Punch" />
        <BarChartWidget title="Department Comparison" />
      </div>

      {/* Control Bar Filters (Search, Ministry, Department, Date, Status) */}
      <div className="card-base" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center', flex: 1 }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-muted)' }} />
            <input
              type="text"
              placeholder="Search employee or code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
              style={{ width: 'auto', minWidth: '180px', fontSize: '0.875rem', fontWeight: 600 }}
            >
              <option value="all">All Ministries</option>
              {dummyMinistries.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
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
              <option value="On Duty">Official Duty</option>
            </select>
          </div>
        </div>
      </div>

      {/* Daily Attendance Table */}
      <div className="card-base" style={{ padding: '1.5rem' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee Code</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Attendance Source</th>
                <th>Device</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>{log.employeeName}</td>
                  <td style={{ fontWeight: 700, color: '#4F46E5' }}>{log.employeeCode || 'EMP-10' + log.id}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{log.department || 'Safety Net Wing'}</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>{log.checkIn || '09:00 AM'}</td>
                  <td style={{ fontWeight: 700, color: '#2563EB' }}>{log.checkOut || '05:00 PM'}</td>
                  <td style={{ fontWeight: 700 }}>{log.workingHours || '8.00 hrs'}</td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>{log.attendanceSource || 'Fingerprint'}</span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{log.deviceName || 'Gate-01 Terminal'}</td>
                  <td>
                    <StatusBadge status={log.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.375rem' }}>
                      <button onClick={() => handleOpenDrawer(log, 'view')} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} title="View Details">
                        <Eye size={14} /> View
                      </button>
                      <button onClick={() => handleOpenDrawer(log, 'edit')} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#4F46E5' }} title="Edit Log">
                        <Edit3 size={14} /> Edit
                      </button>
                      {canOverride && (
                        <button onClick={() => handleOpenDrawer(log, 'override')} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#D97706' }} title="Override Attendance">
                          <Zap size={14} /> Override
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ATTENDANCE DETAILS DRAWER (Slides in from Right) */}
      {drawerLog && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'flex-end', zIndex: 9999
        }}>
          <div className="animate-slide-left" style={{
            width: '100%', maxWidth: '480px', backgroundColor: '#FFFFFF', height: '100%',
            display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.2)'
          }}>
            {/* Drawer Header */}
            <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#0F172A', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, textTransform: 'capitalize' }}>
                  {drawerMode} Attendance Details
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.125rem 0 0 0' }}>Log ID: #{drawerLog.id}</p>
              </div>
              <button onClick={() => setDrawerLog(null)} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Drawer Content */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Employee Info Card */}
              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '0.9375rem', color: '#0F172A' }}>{drawerLog.employeeName}</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-muted)' }}>Code: {drawerLog.employeeCode || 'EMP-10' + drawerLog.id}</p>
                <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: 'var(--slate-muted)' }}>Department: {drawerLog.department || 'Safety Net Wing'}</p>
              </div>

              {/* Attendance Source & Terminal Device */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem' }}>
                <div style={{ backgroundColor: '#EEF2FF', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#4F46E5', fontWeight: 700 }}>Attendance Source</span>
                  <p style={{ margin: '0.25rem 0 0 0', fontWeight: 800, color: '#3730A3' }}>{drawerLog.attendanceSource || 'Fingerprint'}</p>
                </div>
                <div style={{ backgroundColor: '#EEF2FF', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#4F46E5', fontWeight: 700 }}>Device Terminal</span>
                  <p style={{ margin: '0.25rem 0 0 0', fontWeight: 800, color: '#3730A3' }}>{drawerLog.deviceName || 'Gate-01 Terminal'}</p>
                </div>
              </div>

              {/* Form Fields for Edit / Override */}
              <form onSubmit={handleSaveDrawer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Check In</label>
                    <input
                      type="text"
                      className="form-input"
                      disabled={drawerMode === 'view'}
                      value={drawerForm.checkIn}
                      onChange={e => setDrawerForm({ ...drawerForm, checkIn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Check Out</label>
                    <input
                      type="text"
                      className="form-input"
                      disabled={drawerMode === 'view'}
                      value={drawerForm.checkOut}
                      onChange={e => setDrawerForm({ ...drawerForm, checkOut: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Status</label>
                  <select
                    className="form-select"
                    disabled={drawerMode === 'view'}
                    value={drawerForm.status}
                    onChange={e => setDrawerForm({ ...drawerForm, status: e.target.value })}
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                    <option value="Half Day">Half Day</option>
                    <option value="On Duty">Official Duty</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Remarks</label>
                  <textarea
                    rows={2}
                    className="form-input"
                    disabled={drawerMode === 'view'}
                    value={drawerForm.remarks}
                    onChange={e => setDrawerForm({ ...drawerForm, remarks: e.target.value })}
                  />
                </div>

                {drawerMode === 'override' && (
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, color: '#D97706' }}>Admin Override Justification Reason</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Specify reason for manual admin override..."
                      className="form-input"
                      value={drawerForm.overrideReason}
                      onChange={e => setDrawerForm({ ...drawerForm, overrideReason: e.target.value })}
                    />
                  </div>
                )}

                {drawerMode !== 'view' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                    <button type="button" onClick={() => setDrawerLog(null)} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: drawerMode === 'override' ? '#D97706' : '#059669', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                )}
              </form>

              {/* Attendance History */}
              <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '0.8125rem', color: 'var(--slate-muted)', textTransform: 'uppercase' }}>Recent Attendance History</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>2026-08-02:</span><strong style={{ color: '#059669' }}>Present (08:55 AM)</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>2026-08-01:</span><strong style={{ color: '#059669' }}>Present (08:58 AM)</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>2026-07-31:</span><strong style={{ color: '#D97706' }}>Late (09:20 AM)</strong></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
