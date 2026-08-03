import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Mail, 
  Users, 
  Eye, 
  Edit3, 
  Building2, 
  Filter, 
  Grid, 
  Table as TableIcon, 
  FileText, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  UserCheck, 
  Award, 
  Phone, 
  Calendar, 
  DollarSign, 
  X,
  Save,
  Activity,
  User,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEmployees, useDeleteEmployee } from '../../hooks/useEmployees';
import { dummyMinistries } from '../../data/dummy/ministries';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';

// Initial Audit Trail Activity Logs
const INITIAL_ACTIVITY_LOGS = [
  { id: 1, timestamp: "2026-08-03 16:45", user: "Super Admin", action: "Updated Officer Salary", target: "Dr. Md. Mahmudul Haque (EMP-1001)", details: "Adjusted monthly salary to ৳ 120,000" },
  { id: 2, timestamp: "2026-08-03 14:20", user: "Ministry Admin", action: "Changed Account Status", target: "Syeda Rehana Parveen (EMP-1004)", details: "Status updated to Active" },
  { id: 3, timestamp: "2026-08-02 11:15", user: "System", action: "Officer Created", target: "Mohammad Nasim Ahmed (EMP-1002)", details: "Added to Ministry of ICT" },
  { id: 4, timestamp: "2026-08-01 09:30", user: "Super Admin", action: "Department Reassignment", target: "Begum Akhtar Jahan (EMP-1003)", details: "Transferred to Planning & Budgeting Wing" }
];

export default function EmployeeList() {
  const { data: employees, isLoading } = useEmployees();
  const deleteMutation = useDeleteEmployee();

  // Navigation Sub-tab: 'list' | 'activity'
  const [activeTab, setActiveTab] = useState('list');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedMinistryId, setSelectedMinistryId] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals State
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFormTab, setEditFormTab] = useState('personal'); // 'personal' | 'govt' | 'employment' | 'salary' | 'status'

  // Edit Form State
  const [editFormData, setEditFormData] = useState({});
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);

  // Available Departments
  const availableDepartments = useMemo(() => {
    if (!employees) return [];
    const depts = new Set(employees.map(e => e.department).filter(Boolean));
    return Array.from(depts);
  }, [employees]);

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.filter(e => {
      if (selectedMinistryId !== 'all' && e.ministryId !== Number(selectedMinistryId)) {
        return false;
      }
      if (selectedDepartment !== 'all' && e.department !== selectedDepartment) {
        return false;
      }
      if (selectedStatus !== 'all' && e.status !== selectedStatus) {
        return false;
      }
      if (search.trim() !== '') {
        const q = search.toLowerCase();
        const nameMatch = e.name.toLowerCase().includes(q);
        const codeMatch = e.employeeCode ? e.employeeCode.toLowerCase().includes(q) : false;
        const desigMatch = e.designation ? e.designation.toLowerCase().includes(q) : false;
        if (!nameMatch && !codeMatch && !desigMatch) return false;
      }
      return true;
    });
  }, [employees, selectedMinistryId, selectedDepartment, selectedStatus, search]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the employee directory?`)) {
      deleteMutation.mutate(id);
      // Log Activity
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: "Super Admin",
        action: "Deleted Officer Profile",
        target: name,
        details: `Removed profile ID ${id}`
      };
      setActivityLogs([newLog, ...activityLogs]);
    }
  };

  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setEditFormData({
      id: emp.id,
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      nid: emp.nid || '1984269123847',
      employeeCode: emp.employeeCode || '',
      cadreId: emp.cadreId || `BCS-${emp.id + 100}`,
      ministryId: emp.ministryId || 1,
      department: emp.department || '',
      designation: emp.designation || '',
      joiningDate: emp.joiningDate || '2020-01-15',
      level: emp.level || 'manager',
      reportsTo: emp.reportsTo || null,
      payGrade: emp.payGrade || 'Grade 5',
      monthlySalary: emp.monthlySalary || 75000,
      status: emp.status || 'Active'
    });
    setEditFormTab('personal');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingEmployee) return;

    // Mutate local object directly for immediate feedback
    Object.assign(editingEmployee, editFormData);

    // Log Activity
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: "Super Admin",
      action: "Updated Officer Profile",
      target: `${editFormData.name} (${editFormData.employeeCode})`,
      details: `Updated info in ${editFormTab} section`
    };
    setActivityLogs([newLog, ...activityLogs]);

    setEditingEmployee(null);
    alert(`Successfully saved officer profile changes for ${editFormData.name}!`);
  };

  const formatBDT = (amount) => {
    return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 })
      .format(amount || 0)
      .replace('BDT', '৳');
  };

  if (isLoading) return <div style={{ height: '400px' }} className="skeleton-shimmer"></div>;

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
            <Users size={26} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Employee Management System
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#E0E7FF', margin: 0, marginTop: '0.125rem' }}>
              Central officer roster, profile edits, command hierarchy, and system activity logs
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/employee/create" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#FFFFFF', color: '#4F46E5' }}>
            <Plus size={16} /> Add New Employee
          </Link>
        </div>
      </div>

      {/* Main Sub-Tab Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveTab('list')}
          style={{
            padding: '0.625rem 1.125rem',
            borderRadius: '0.5rem 0.5rem 0 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'list' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'list' ? '#FFFFFF' : 'var(--slate-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Users size={16} /> Employee Directory ({filteredEmployees.length})
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          style={{
            padding: '0.625rem 1.125rem',
            borderRadius: '0.5rem 0.5rem 0 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'activity' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'activity' ? '#FFFFFF' : 'var(--slate-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Activity size={16} /> System Activity Log
        </button>
      </div>

      {/* TAB 1: EMPLOYEE DIRECTORY & LIST */}
      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Controls Bar & Filters */}
          <div className="card-base" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center', flex: 1 }}>
              
              {/* Search Box */}
              <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 200px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-muted)' }} />
                <input
                  type="text"
                  placeholder="Search officer, code, designation..."
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

              {/* Department Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={18} style={{ color: 'var(--slate-muted)' }} />
                <select
                  value={selectedDepartment}
                  onChange={e => setSelectedDepartment(e.target.value)}
                  className="form-input"
                  style={{ width: 'auto', minWidth: '160px', fontSize: '0.875rem' }}
                >
                  <option value="all">All Departments</option>
                  {availableDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="form-input"
                  style={{ width: 'auto', fontSize: '0.875rem' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: '0.5rem' }}>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  padding: '0.35rem 0.625rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer',
                  backgroundColor: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'table' ? '#4F46E5' : 'var(--slate-muted)',
                  display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.75rem'
                }}
              >
                <TableIcon size={14} /> Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.35rem 0.625rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer',
                  backgroundColor: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'grid' ? '#4F46E5' : 'var(--slate-muted)',
                  display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.75rem'
                }}
              >
                <Grid size={14} /> Cards Grid
              </button>
            </div>
          </div>

          {/* TABLE VIEW */}
          {viewMode === 'table' ? (
            <div className="card-base" style={{ padding: '1.5rem' }}>
              {filteredEmployees.length === 0 ? (
                <EmptyState title="No Officers Found" description="No employee profiles match the selected search criteria." />
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee Code</th>
                        <th>Officer Name</th>
                        <th>Ministry & Department</th>
                        <th>Designation</th>
                        <th>Pay Grade & Salary</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map(emp => (
                        <tr key={emp.id}>
                          <td style={{ fontWeight: 700, color: '#4F46E5' }}>{emp.employeeCode}</td>
                          <td style={{ fontWeight: 700 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                              <img src={emp.avatar} alt={emp.name} style={{ width: '36px', height: '36px', borderRadius: '9999px', objectFit: 'cover' }} />
                              <div>
                                <p style={{ margin: 0, fontWeight: 700 }}>{emp.name}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-muted)' }}>{emp.email}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <p style={{ margin: 0, fontWeight: 600 }}>{emp.ministryName}</p>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-muted)' }}>{emp.department}</p>
                            </div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{emp.designation}</td>
                          <td>
                            <div>
                              <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>{emp.payGrade}</span>
                              <p style={{ margin: '0.125rem 0 0 0', fontWeight: 700, color: '#059669', fontSize: '0.8125rem' }}>
                                {formatBDT(emp.monthlySalary)}
                              </p>
                            </div>
                          </td>
                          <td>
                            <StatusBadge status={emp.status} />
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.375rem' }}>
                              <button onClick={() => setViewingEmployee(emp)} title="View Officer Details" className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>
                                <Eye size={16} color="#4F46E5" />
                              </button>
                              <button onClick={() => handleOpenEditModal(emp)} title="Edit Employee Profile" className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>
                                <Edit3 size={16} color="#059669" />
                              </button>
                              <button onClick={() => handleDelete(emp.id, emp.name)} title="Remove Employee" className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>
                                <Trash2 size={16} color="#DC2626" />
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
          ) : (
            /* CARDS GRID VIEW */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {filteredEmployees.map(emp => (
                <div key={emp.id} className="card-base hover-card-elevation" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <img src={emp.avatar} alt={emp.name} style={{ width: '52px', height: '52px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #6366F1' }} />
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#4F46E5', backgroundColor: '#EEF2FF', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>
                        {emp.employeeCode}
                      </span>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: '0.25rem 0 0 0', color: 'var(--slate-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {emp.name}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, margin: 0 }}>
                        {emp.designation}
                      </p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--slate-muted)' }}>Ministry:</span>
                      <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{emp.ministryName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--slate-muted)' }}>Department:</span>
                      <strong>{emp.department}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--slate-muted)' }}>Pay Grade:</span>
                      <strong style={{ color: '#4F46E5' }}>{emp.payGrade} ({formatBDT(emp.monthlySalary)})</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-border)' }}>
                    <StatusBadge status={emp.status} />
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button onClick={() => setViewingEmployee(emp)} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        <Eye size={14} /> View
                      </button>
                      <button onClick={() => handleOpenEditModal(emp)} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#059669' }}>
                        <Edit3 size={14} /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SYSTEM ACTIVITY & AUDIT LOG */}
      {activeTab === 'activity' && (
        <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>System Audit & Employee Activity Trail</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)', margin: 0 }}>Real-time logs of profile edits, salary adjustments, and status changes</p>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User / Role</th>
                  <th>Action Event</th>
                  <th>Target Officer</th>
                  <th>Audit Details</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Clock size={14} /> {log.timestamp}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#4F46E5' }}>{log.user}</td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{log.action}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{log.target}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW OFFICER PROFILE MODAL */}
      {viewingEmployee && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '520px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Officer Record Profile</h3>
              <button onClick={() => setViewingEmployee(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img src={viewingEmployee.avatar} alt={viewingEmployee.name} style={{ width: '64px', height: '64px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #6366F1' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4F46E5', backgroundColor: '#EEF2FF', padding: '0.15rem 0.5rem', borderRadius: '0.375rem' }}>
                    {viewingEmployee.employeeCode}
                  </span>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: '0.25rem 0 0 0' }}>{viewingEmployee.name}</h3>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#059669', margin: 0 }}>{viewingEmployee.designation}</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ministry:</span><strong>{viewingEmployee.ministryName}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Department Wing:</span><strong>{viewingEmployee.department}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pay Grade:</span><strong>{viewingEmployee.payGrade}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Monthly Gross Salary:</span><strong style={{ color: '#059669' }}>{formatBDT(viewingEmployee.monthlySalary)}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Account Status:</span><StatusBadge status={viewingEmployee.status} /></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button onClick={() => setViewingEmployee(null)} className="btn btn-secondary">Close</button>
                <button onClick={() => { const emp = viewingEmployee; setViewingEmployee(null); handleOpenEditModal(emp); }} className="btn btn-primary">
                  <Edit3 size={16} /> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL (5 STRUCTURED SECTIONS) */}
      {editingEmployee && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '640px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            {/* Modal Header */}
            <div style={{ backgroundColor: '#4F46E5', color: '#FFFFFF', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Edit Employee Profile</h3>
                <p style={{ fontSize: '0.75rem', color: '#E0E7FF', margin: 0 }}>{editFormData.name} ({editFormData.employeeCode})</p>
              </div>
              <button onClick={() => setEditingEmployee(null)} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}><X size={22} /></button>
            </div>

            {/* 5 Form Sub-Tabs */}
            <div style={{ display: 'flex', backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--slate-border)', padding: '0.5rem 1rem 0 1rem', overflowX: 'auto' }}>
              {[
                { id: 'personal', label: '1. Personal Info' },
                { id: 'govt', label: '2. Govt Info' },
                { id: 'employment', label: '3. Employment' },
                { id: 'salary', label: '4. Salary Info' },
                { id: 'status', label: '5. Account Status' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setEditFormTab(tab.id)}
                  style={{
                    padding: '0.5rem 0.875rem',
                    borderRadius: '0.375rem 0.375rem 0 0',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: editFormTab === tab.id ? '#FFFFFF' : 'transparent',
                    color: editFormTab === tab.id ? '#4F46E5' : 'var(--slate-muted)',
                    borderBottom: editFormTab === tab.id ? '2px solid #4F46E5' : 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEdit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* SECTION 1: PERSONAL INFORMATION */}
              {editFormTab === 'personal' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Full Officer Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editFormData.name}
                      onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Official Email</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        value={editFormData.email}
                        onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editFormData.phone}
                        onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">National ID / Passport Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editFormData.nid}
                      onChange={e => setEditFormData({ ...editFormData, nid: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* SECTION 2: GOVERNMENT INFORMATION */}
              {editFormTab === 'govt' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Government Employee Code</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={editFormData.employeeCode}
                        onChange={e => setEditFormData({ ...editFormData, employeeCode: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Cadre / BICS ID</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editFormData.cadreId}
                        onChange={e => setEditFormData({ ...editFormData, cadreId: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Assigned Ministry</label>
                    <select
                      className="form-select"
                      value={editFormData.ministryId}
                      onChange={e => {
                        const mId = Number(e.target.value);
                        const mObj = dummyMinistries.find(m => m.id === mId);
                        setEditFormData({ ...editFormData, ministryId: mId, ministryName: mObj ? mObj.name : '' });
                      }}
                    >
                      {dummyMinistries.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* SECTION 3: EMPLOYMENT DETAILS */}
              {editFormTab === 'employment' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Designation Title</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={editFormData.designation}
                        onChange={e => setEditFormData({ ...editFormData, designation: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Department Wing</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={editFormData.department}
                        onChange={e => setEditFormData({ ...editFormData, department: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Official Joining Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={editFormData.joiningDate}
                        onChange={e => setEditFormData({ ...editFormData, joiningDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Command Level Hierarchy</label>
                      <select
                        className="form-select"
                        value={editFormData.level}
                        onChange={e => setEditFormData({ ...editFormData, level: e.target.value })}
                      >
                        <option value="ceo">Supreme Minister / Secretary (CEO)</option>
                        <option value="vp">Additional Secretary (VP)</option>
                        <option value="director">Joint Secretary / Director</option>
                        <option value="manager">Deputy Secretary / Manager</option>
                        <option value="asst_manager">Assistant Secretary</option>
                        <option value="staff">Executive Officer Staff</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: SALARY INFORMATION */}
              {editFormTab === 'salary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Pay Grade</label>
                      <select
                        className="form-select"
                        value={editFormData.payGrade}
                        onChange={e => setEditFormData({ ...editFormData, payGrade: e.target.value })}
                      >
                        {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Monthly Gross Salary (BDT Taka)</label>
                      <input
                        type="number"
                        required
                        className="form-input"
                        value={editFormData.monthlySalary}
                        onChange={e => setEditFormData({ ...editFormData, monthlySalary: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: ACCOUNT STATUS */}
              {editFormTab === 'status' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Account Operational Status</label>
                    <select
                      className="form-select"
                      value={editFormData.status}
                      onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                    >
                      <option value="Active">Active (On Duty)</option>
                      <option value="On Leave">On Approved Leave</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Retired">Retired / Deactivated</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-border)' }}>
                <button type="button" onClick={() => setEditingEmployee(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#059669' }}>
                  <Save size={16} /> Save Officer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
