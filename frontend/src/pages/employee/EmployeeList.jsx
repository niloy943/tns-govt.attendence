import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Globe, 
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
  CheckCircle2, 
  Banknote, 
  CalendarCheck, 
  ArrowRightLeft, 
  UserX,
  Layers,
  Award,
  MoreVertical
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEmployees, useDeleteEmployee } from '../../hooks/useEmployees';
import { dummyMinistries } from '../../data/dummy/ministries';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';
import EmployeeDetailsDrawer from '../../components/employee/EmployeeDetailsDrawer';
import ImportGovtEmployeesModal from '../../components/employee/ImportGovtEmployeesModal';

export default function EmployeeList() {
  const navigate = useNavigate();
  const { data: employees, isLoading, refetch } = useEmployees();
  const deleteMutation = useDeleteEmployee();

  // View Mode: 'table' | 'grid'
  const [viewMode, setViewMode] = useState('table');

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedMinistryId, setSelectedMinistryId] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedWing, setSelectedWing] = useState('all');
  const [selectedDesignation, setSelectedDesignation] = useState('all');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('all');
  const [selectedPayGrade, setSelectedPayGrade] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals & Drawers State
  const [selectedEmployeeForDrawer, setSelectedEmployeeForDrawer] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Available Filter Options
  const availableDepartments = useMemo(() => {
    if (!employees) return [];
    return Array.from(new Set(employees.map(e => e.department).filter(Boolean)));
  }, [employees]);

  const availableWings = useMemo(() => {
    if (!employees) return [];
    return Array.from(new Set(employees.map(e => e.wing).filter(Boolean)));
  }, [employees]);

  const availableDesignations = useMemo(() => {
    if (!employees) return [];
    return Array.from(new Set(employees.map(e => e.designation).filter(Boolean)));
  }, [employees]);

  // Filtered Employees Roster
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.filter(e => {
      if (selectedMinistryId !== 'all' && e.ministryId !== Number(selectedMinistryId)) return false;
      if (selectedDepartment !== 'all' && e.department !== selectedDepartment) return false;
      if (selectedWing !== 'all' && e.wing !== selectedWing) return false;
      if (selectedDesignation !== 'all' && e.designation !== selectedDesignation) return false;
      if (selectedEmploymentType !== 'all' && e.employmentType !== selectedEmploymentType) return false;
      if (selectedPayGrade !== 'all' && e.payGrade !== selectedPayGrade) return false;
      if (selectedStatus !== 'all' && e.status !== selectedStatus) return false;
      if (search.trim() !== '') {
        const q = search.toLowerCase();
        const nameMatch = e.name.toLowerCase().includes(q);
        const codeMatch = e.employeeCode ? e.employeeCode.toLowerCase().includes(q) : false;
        const desigMatch = e.designation ? e.designation.toLowerCase().includes(q) : false;
        if (!nameMatch && !codeMatch && !desigMatch) return false;
      }
      return true;
    });
  }, [employees, selectedMinistryId, selectedDepartment, selectedWing, selectedDesignation, selectedEmploymentType, selectedPayGrade, selectedStatus, search]);

  const handleOpenDrawer = (emp) => {
    setSelectedEmployeeForDrawer(emp);
    setIsDetailsDrawerOpen(true);
  };

  const handleDeactivate = (emp) => {
    if (window.confirm(`Are you sure you want to deactivate officer ${emp.name}?`)) {
      emp.status = 'Suspended';
      emp.serviceStatus = 'Suspended';
      refetch();
    }
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
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        border: '1px solid #1E293B',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ backgroundColor: 'rgba(5, 150, 105, 0.2)', padding: '0.625rem', borderRadius: '0.75rem' }}>
            <Users size={26} color="#34D399" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              Government Employee Directory
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '0.15rem 0 0 0' }}>
              Central Bangladesh Government Officer Directory & Personnel Management Roster
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => setIsImportModalOpen(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.8125rem', backgroundColor: '#1E293B', color: '#38BDF8', borderColor: '#334155' }}
          >
            <Globe size={16} /> + Import Government Employees
          </button>
          
          <Link 
            to="/employee/create" 
            className="btn btn-primary" 
            style={{ fontSize: '0.8125rem' }}
          >
            <Plus size={16} /> + Add Employee
          </Link>
        </div>
      </div>

      {/* Top Comprehensive Filters Box */}
      <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Search Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-muted)' }} />
            <input
              type="text"
              placeholder="Search by officer name, code, designation..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
            />
          </div>

          {/* View Mode Switcher */}
          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: '0.5rem' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '0.35rem 0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer',
                backgroundColor: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'table' ? 'var(--primary)' : 'var(--slate-muted)',
                display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.775rem'
              }}
            >
              <TableIcon size={14} /> Table View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.35rem 0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer',
                backgroundColor: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'grid' ? 'var(--primary)' : 'var(--slate-muted)',
                display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.775rem'
              }}
            >
              <Grid size={14} /> Card View
            </button>
          </div>
        </div>

        {/* 7 Filter Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
          
          {/* Ministry */}
          <div>
            <select
              value={selectedMinistryId}
              onChange={e => setSelectedMinistryId(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.775rem' }}
            >
              <option value="all">All Ministries</option>
              {dummyMinistries.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.775rem' }}
            >
              <option value="all">All Departments</option>
              {availableDepartments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Wing */}
          <div>
            <select
              value={selectedWing}
              onChange={e => setSelectedWing(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.775rem' }}
            >
              <option value="all">All Wings</option>
              {availableWings.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Designation */}
          <div>
            <select
              value={selectedDesignation}
              onChange={e => setSelectedDesignation(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.775rem' }}
            >
              <option value="all">All Designations</option>
              {availableDesignations.map(des => (
                <option key={des} value={des}>{des}</option>
              ))}
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <select
              value={selectedEmploymentType}
              onChange={e => setSelectedEmploymentType(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.775rem' }}
            >
              <option value="all">Employment Type</option>
              <option value="Permanent">Permanent</option>
              <option value="Contractual">Contractual</option>
              <option value="Probationary">Probationary</option>
              <option value="Deputation">Deputation</option>
            </select>
          </div>

          {/* Pay Grade */}
          <div>
            <select
              value={selectedPayGrade}
              onChange={e => setSelectedPayGrade(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.775rem' }}
            >
              <option value="all">All Pay Grades</option>
              {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.775rem' }}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

        </div>

      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="card-base" style={{ padding: '1.25rem' }}>
          {filteredEmployees.length === 0 ? (
            <EmptyState title="No Officers Found" description="No employee profiles match the selected search & filter criteria." />
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Employee</th>
                    <th>Employee Code</th>
                    <th>Designation</th>
                    <th>Ministry</th>
                    <th>Department</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <img 
                          src={emp.avatar} 
                          alt={emp.name} 
                          style={{ width: '40px', height: '40px', borderRadius: '9999px', objectFit: 'cover', border: '1.5 solid var(--primary)' }} 
                        />
                      </td>
                      <td>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, color: 'var(--slate-text)' }}>{emp.name}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-muted)' }}>{emp.email}</p>
                        </div>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                        {emp.employeeCode}
                      </td>
                      <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                        {emp.designation}
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>
                        {emp.ministryName}
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>
                        {emp.department}
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {emp.payGrade}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={emp.status} />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                          
                          {/* View Drawer Button */}
                          <button onClick={() => handleOpenDrawer(emp)} title="View Officer Details Drawer" className="btn btn-ghost" style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}>
                            <Eye size={15} color="var(--primary)" /> View
                          </button>

                          {/* Edit Button */}
                          <button onClick={() => handleOpenDrawer(emp)} title="Edit Officer Profile" className="btn btn-ghost" style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}>
                            <Edit3 size={15} color="#2563EB" /> Edit
                          </button>

                          {/* Salary Quick Action */}
                          <button onClick={() => handleOpenDrawer(emp)} title="View Salary Breakdown" className="btn btn-ghost" style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}>
                            <Banknote size={15} color="#059669" /> Salary
                          </button>

                          {/* Attendance Quick Action */}
                          <button onClick={() => handleOpenDrawer(emp)} title="Attendance Status & Device" className="btn btn-ghost" style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}>
                            <CalendarCheck size={15} color="#D97706" /> Attendance
                          </button>

                          {/* Transfer Quick Action */}
                          <button onClick={() => navigate('/employee/transfer')} title="Transfer Officer" className="btn btn-ghost" style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}>
                            <ArrowRightLeft size={15} color="#7C3AED" /> Transfer
                          </button>

                          {/* Deactivate Quick Action */}
                          <button onClick={() => handleDeactivate(emp)} title="Deactivate Officer" className="btn btn-ghost" style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}>
                            <UserX size={15} color="#DC2626" />
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
        /* CARD VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="card-base hover-card-elevation" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <img src={emp.avatar} alt={emp.name} style={{ width: '56px', height: '56px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <span style={{ fontSize: '0.675rem', fontWeight: 800, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>
                    {emp.employeeCode}
                  </span>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, margin: '0.2rem 0 0 0', color: 'var(--slate-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {emp.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, margin: 0 }}>
                    {emp.designation}
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
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
                  <strong style={{ color: '#059669' }}>{emp.payGrade} ({formatBDT(emp.monthlySalary)})</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-border)' }}>
                <StatusBadge status={emp.status} />
                <button onClick={() => handleOpenDrawer(emp)} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                  <Eye size={14} /> Open Drawer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILS DRAWER */}
      <EmployeeDetailsDrawer
        employee={selectedEmployeeForDrawer}
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        onEdit={(emp) => handleOpenDrawer(emp)}
      />

      {/* IMPORT GOVERNMENT EMPLOYEES MODAL */}
      <ImportGovtEmployeesModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => refetch()}
      />

    </div>
  );
}
