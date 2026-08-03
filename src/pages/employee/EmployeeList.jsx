import React, { useState } from 'react';
import { Search, Plus, Trash2, Mail, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEmployees, useDeleteEmployee } from '../../hooks/useEmployees';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';

export default function EmployeeList() {
  const { data: employees, isLoading } = useEmployees();
  const deleteMutation = useDeleteEmployee();
  const [search, setSearch] = useState('');

  if (isLoading) return <div style={{ height: '350px' }} className="skeleton-shimmer"></div>;

  const filtered = (employees || []).filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    (e.email && e.email.toLowerCase().includes(search.toLowerCase())) ||
    (e.designation && e.designation.toLowerCase().includes(search.toLowerCase())) ||
    (e.employeeCode && e.employeeCode.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the employee directory?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-text)' }}>
            Employee Directory
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)' }}>
            Manage active personnel, profiles and credentials
          </p>
        </div>

        <Link to="/employee/create" className="btn btn-primary" style={{ textDecoration: 'none', backgroundColor: '#6366F1' }}>
          <Plus size={18} /> Add Employee
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="card-base" style={{ padding: '1rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '24rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem', backgroundColor: '#F8FAFC' }}
            placeholder="Search by ID or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 2-Column Parallel Employee Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No employees found"
          description="No employee profile matches your search query."
          actionLabel="Create Employee"
          onAction={() => window.location.hash = '#/employee/create'}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem'
        }}>
          {filtered.map((emp) => (
            <div key={emp.id} className="card-base" style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '0.75rem',
              border: '1px solid var(--slate-border)'
            }}>
              <img
                src={emp.avatar}
                alt={emp.name}
                style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ overflow: 'hidden' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--slate-text)', margin: 0, lineHeight: 1.3 }}>
                  {emp.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)', margin: '0.25rem 0 0 0', lineHeight: 1.3 }}>
                  {emp.designation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
