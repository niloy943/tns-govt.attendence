import React, { useState } from 'react';
import { 
  ShieldAlert, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  UserX, 
  CheckCircle2, 
  Filter, 
  Search,
  Edit3,
  X,
  Save
} from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployees';
import StatusBadge from '../../components/shared/StatusBadge';

export default function EmployeeStatusManager() {
  const { data: employees = [] } = useEmployees();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [newStatus, setNewStatus] = useState('Active');
  const [statusReason, setStatusReason] = useState('');

  const filteredEmployees = employees.filter(e => {
    if (selectedStatusFilter !== 'all' && e.status !== selectedStatusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.name.toLowerCase().includes(q) && !e.employeeCode.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!editingOfficer) return;
    editingOfficer.status = newStatus;
    editingOfficer.serviceStatus = newStatus;
    setEditingOfficer(null);
    alert(`Status updated to ${newStatus} for ${editingOfficer.name}!`);
  };

  const statuses = [
    { label: 'Active', count: employees.filter(e => e.status === 'Active' || e.status === 'active').length, color: '#059669', bg: '#ECFDF5' },
    { label: 'Probation', count: employees.filter(e => e.status === 'Probation').length, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'On Leave', count: employees.filter(e => e.status === 'On Leave').length, color: '#D97706', bg: '#FEF3C7' },
    { label: 'Suspended', count: employees.filter(e => e.status === 'Suspended').length, color: '#DC2626', bg: '#FEE2E2' },
    { label: 'Retired', count: employees.filter(e => e.status === 'Retired').length, color: '#4B5563', bg: '#F3F4F6' },
    { label: 'Resigned', count: employees.filter(e => e.status === 'Resigned').length, color: '#991B1B', bg: '#FEE2E2' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #1E293B'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ backgroundColor: 'rgba(5, 150, 105, 0.2)', padding: '0.625rem', borderRadius: '0.75rem' }}>
            <ShieldAlert size={24} color="#34D399" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              Employee Status & Service Life Cycle Management
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '0.15rem 0 0 0' }}>
              Track Active, Probation, On Leave, Suspended, Retired, and Resigned officer statuses
            </p>
          </div>
        </div>
      </div>

      {/* Status Summary Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.875rem' }}>
        {statuses.map(st => (
          <div 
            key={st.label}
            onClick={() => setSelectedStatusFilter(st.label === selectedStatusFilter ? 'all' : st.label)}
            className="card-base"
            style={{
              padding: '0.875rem',
              cursor: 'pointer',
              backgroundColor: selectedStatusFilter === st.label ? st.bg : '#FFFFFF',
              borderColor: selectedStatusFilter === st.label ? st.color : 'var(--slate-border)'
            }}
          >
            <p style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--slate-muted)', margin: 0, textTransform: 'uppercase' }}>{st.label}</p>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: st.color, margin: '0.1rem 0 0 0' }}>{st.count}</h3>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-muted)' }} />
            <input
              type="text"
              placeholder="Search officer name or code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.8125rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: 'var(--slate-muted)' }} />
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', fontSize: '0.8125rem' }}
            >
              <option value="all">All Service Statuses</option>
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
              <option value="Retired">Retired</option>
              <option value="Resigned">Resigned</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Officer</th>
                <th>Ministry & Department</th>
                <th>Designation</th>
                <th>Joining Date</th>
                <th>Current Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={emp.avatar} alt={emp.name} style={{ width: '32px', height: '32px', borderRadius: '9999px', objectFit: 'cover' }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8125rem' }}>{emp.name}</p>
                        <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>{emp.employeeCode}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>
                    <div style={{ fontWeight: 600 }}>{emp.ministryName}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--slate-muted)' }}>{emp.department}</div>
                  </td>
                  <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{emp.designation}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>{emp.joiningDate}</td>
                  <td>
                    <StatusBadge status={emp.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => { setEditingOfficer(emp); setNewStatus(emp.status); }} 
                      className="btn btn-ghost" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.775rem' }}
                    >
                      <Edit3 size={14} /> Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE STATUS MODAL */}
      {editingOfficer && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '480px', width: '100%', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>Update Service Status</h3>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>{editingOfficer.name} ({editingOfficer.employeeCode})</p>
              </div>
              <button onClick={() => setEditingOfficer(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleUpdateStatus} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">New Status</label>
                <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="Active">Active (On Duty)</option>
                  <option value="Probation">Probation</option>
                  <option value="On Leave">On Approved Leave</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Retired">Retired</option>
                  <option value="Resigned">Resigned</option>
                </select>
              </div>

              <div>
                <label className="form-label">Reason / Administrative Order Reference</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={statusReason}
                  onChange={e => setStatusReason(e.target.value)}
                  placeholder="e.g. Office Order #88192 / Retirement Date"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingOfficer(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
