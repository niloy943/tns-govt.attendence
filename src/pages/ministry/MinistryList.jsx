import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Users, 
  MapPin, 
  Mail, 
  Phone, 
  Edit3, 
  Trash2, 
  Landmark,
  BadgeDollarSign
} from 'lucide-react';
import { useMinistries, useDeleteMinistry } from '../../hooks/useMinistries';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';
import MinistryForm from './MinistryForm';

export default function MinistryList() {
  const { data: ministries, isLoading, isError } = useMinistries();
  const deleteMutation = useDeleteMinistry();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState(null);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ height: '40px', width: '200px' }} className="skeleton-shimmer"></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{ height: '220px', borderRadius: '0.75rem' }} className="skeleton-shimmer"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <EmptyState title="Unable to load ministries" description="An error occurred while fetching ministry details." />;
  }

  const filteredMinistries = (ministries || []).filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleEdit = (item) => {
    setEditingMinistry(item);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingMinistry(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this ministry/branch?")) {
      deleteMutation.mutate(id);
    }
  };

  const totalEmployees = (ministries || []).reduce((acc, m) => acc + (m.employeeCount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Top Banner & Pitch Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <div style={{
              padding: '0.625rem',
              borderRadius: '0.625rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)'
            }}>
              <Landmark size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-text)' }}>
                Government Ministries & Branches
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)' }}>
                Ministry of Social Welfare & Ministry of Women and Children Affairs Organisational Network
              </p>
            </div>
          </div>
        </div>

        <button onClick={handleAddNew} className="btn btn-primary">
          <Plus size={18} />
          Add Ministry / Branch
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card-base" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Building2 size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active Ministries</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-text)' }}>{ministries?.length || 0}</h3>
          </div>
        </div>

        <div className="card-base" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--emerald-light)', color: '#047857' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Personnel</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-text)' }}>{totalEmployees}</h3>
          </div>
        </div>

        <div className="card-base" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--indigo-light)', color: '#4338CA' }}>
            <BadgeDollarSign size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Govt Budget Pool</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-text)' }}>৳ 1,050 Cr</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-base" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by ministry name, code, or city..."
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Type:</span>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="Head Ministry">Head Ministry</option>
            <option value="Divisional Directorate">Divisional Directorate</option>
            <option value="Divisional Branch">Divisional Branch</option>
            <option value="Regional Office">Regional Office</option>
          </select>
        </div>
      </div>

      {/* Grid of Ministry Cards */}
      {filteredMinistries.length === 0 ? (
        <EmptyState
          title="No ministry found"
          description="No government entity matches your current search filters."
          actionLabel="Add New Ministry"
          onAction={handleAddNew}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredMinistries.map((item) => (
            <div key={item.id} className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.25rem',
                      display: 'inline-block',
                      marginBottom: '0.375rem'
                    }}>
                      {item.code}
                    </span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--slate-text)', lineHeight: 1.3 }}>
                      {item.name}
                    </h3>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0', fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span>{item.address} ({item.city})</span>
                  </div>

                  {item.headOfOffice && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Landmark size={16} style={{ color: '#059669', flexShrink: 0 }} />
                      <span><strong>{item.headOfOffice.title}:</strong> {item.headOfOffice.name}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} style={{ color: '#6366F1', flexShrink: 0 }} />
                    <span><strong>Staff Size:</strong> {item.employeeCount} Registered Officers</span>
                  </div>

                  {item.contactEmail && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={16} style={{ color: '#64748B', flexShrink: 0 }} />
                      <span>{item.contactEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div style={{
                paddingTop: '0.875rem',
                borderTop: '1px solid var(--slate-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>
                  Budget: {item.budgetAllocated}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <button onClick={() => handleEdit(item)} className="btn btn-ghost" style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem' }}>
                    <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn btn-ghost" style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem', color: 'var(--rose)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <MinistryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingMinistry}
      />
    </div>
  );
}
