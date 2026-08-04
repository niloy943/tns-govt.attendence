import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Building2, 
  Users, 
  ArrowRightLeft, 
  UserX,
  Filter
} from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployees';
import { dummyMinistries } from '../../data/dummy/ministries';

export default function EmployeeReports() {
  const { data: employees = [] } = useEmployees();
  const [activeReportTab, setActiveReportTab] = useState('list'); // 'list' | 'department' | 'designation' | 'transfer' | 'retirement'
  const [selectedMinistryId, setSelectedMinistryId] = useState('all');

  const filteredEmployees = employees.filter(e => {
    if (selectedMinistryId !== 'all' && e.ministryId !== Number(selectedMinistryId)) return false;
    if (activeReportTab === 'retirement' && e.status !== 'Retired') return false;
    return true;
  });

  const handleExport = (format) => {
    alert(`Exporting ${activeReportTab.toUpperCase()} Report in ${format.toUpperCase()} format... Downloading file...`);
  };

  const reportTabs = [
    { id: 'list', label: 'Employee List Report', icon: Users },
    { id: 'department', label: 'Department Report', icon: Building2 },
    { id: 'designation', label: 'Designation Report', icon: FileText },
    { id: 'transfer', label: 'Transfer Report', icon: ArrowRightLeft },
    { id: 'retirement', label: 'Retirement Report', icon: UserX }
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
            <BarChart3 size={24} color="#34D399" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              Government HRMS Roster Reports & Exports
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '0.15rem 0 0 0' }}>
              Generate official reports for Ministry, Department, Designation, Transfers & Retirements
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => handleExport('pdf')} className="btn btn-secondary" style={{ backgroundColor: '#DC2626', color: '#FFFFFF', borderColor: '#DC2626', fontSize: '0.8125rem' }}>
            <Printer size={16} /> PDF
          </button>
          <button onClick={() => handleExport('excel')} className="btn btn-secondary" style={{ backgroundColor: '#059669', color: '#FFFFFF', borderColor: '#059669', fontSize: '0.8125rem' }}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button onClick={() => handleExport('csv')} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
            <Download size={16} /> CSV
          </button>
        </div>
      </div>

      {/* Report Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.25rem' }}>
        {reportTabs.map(t => {
          const Icon = t.icon;
          const isActive = activeReportTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveReportTab(t.id)}
              style={{
                padding: '0.625rem 1rem',
                borderRadius: '0.5rem 0.5rem 0 0',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--slate-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Filter & Data Table Container */}
      <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} style={{ color: 'var(--primary)' }} />
            <select
              value={selectedMinistryId}
              onChange={e => setSelectedMinistryId(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '220px', fontSize: '0.8125rem' }}
            >
              <option value="all">All Ministries</option>
              {dummyMinistries.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-muted)' }}>
            Total Records: <strong>{filteredEmployees.length}</strong>
          </span>
        </div>

        {/* Report Content View */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Code</th>
                <th>Officer Name</th>
                <th>Ministry</th>
                <th>Department / Wing</th>
                <th>Designation</th>
                <th>Pay Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{emp.employeeCode}</td>
                  <td style={{ fontWeight: 700 }}>{emp.name}</td>
                  <td>{emp.ministryName}</td>
                  <td>{emp.department} ({emp.wing || 'Executive'})</td>
                  <td style={{ fontWeight: 600 }}>{emp.designation}</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>{emp.payGrade}</td>
                  <td>
                    <span className="badge badge-active">{emp.status}</span>
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
