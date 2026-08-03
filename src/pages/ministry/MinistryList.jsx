import React, { useState, useMemo } from 'react';
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
  Eye,
  X,
  Save,
  CheckCircle2,
  Filter,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { useMinistries, useDeleteMinistry } from '../../hooks/useMinistries';
import { dummyMinistries } from '../../data/dummy/ministries';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';

// Initial Departments Data Roster
const INITIAL_DEPARTMENTS = [
  { id: 101, name: "Social Protection & Safety Net Wing", ministryId: 1, ministryName: "Ministry of Social Welfare", head: "Dr. Md. Mahmudul Haque", headDesignation: "Additional Secretary", staffCount: 145, status: "Active" },
  { id: 102, name: "Disability & Neuro-developmental Affairs", ministryId: 1, ministryName: "Ministry of Social Welfare", head: "Begum Akhtar Jahan", headDesignation: "Joint Secretary", staffCount: 98, status: "Active" },
  { id: 103, name: "Women Empowerment & Rights Wing", ministryId: 2, ministryName: "Ministry of Women and Children Affairs", head: "Syeda Rehana Parveen", headDesignation: "Joint Secretary", staffCount: 112, status: "Active" },
  { id: 104, name: "Child Rights & Protection Directorate", ministryId: 2, ministryName: "Ministry of Women and Children Affairs", head: "Tariqul Islam Chowdhury", headDesignation: "Deputy Secretary", staffCount: 84, status: "Active" },
  { id: 105, name: "Civil Service Reform & Governance Wing", ministryId: 3, ministryName: "Ministry of Public Administration", head: "Kazi Nurul Islam", headDesignation: "Additional Secretary", staffCount: 210, status: "Active" },
  { id: 106, name: "National Budget & Expenditure Control", ministryId: 4, ministryName: "Ministry of Finance", head: "Farhana Ahmed", headDesignation: "Director General", staffCount: 175, status: "Active" },
  { id: 107, name: "Digital Government & Infrastructure Wing", ministryId: 5, ministryName: "Ministry of ICT", head: "Mohammad Nasim Ahmed", headDesignation: "Director General", staffCount: 160, status: "Active" }
];

export default function MinistryList() {
  const { data: apiMinistries, isLoading, isError } = useMinistries();
  const deleteMutation = useDeleteMinistry();

  // Local state for interactive editing & status tracking
  const [ministriesList, setMinistriesList] = useState(() => dummyMinistries);
  const [departmentsList, setDepartmentsList] = useState(INITIAL_DEPARTMENTS);

  // Active Main Tab: 'ministry' | 'department'
  const [activeTab, setActiveTab] = useState('ministry');

  // Search & Filter state
  const [ministrySearch, setMinistrySearch] = useState('');
  const [deptSearch, setDeptSearch] = useState('');
  const [deptMinistryFilter, setDeptMinistryFilter] = useState('all');

  // Modals state
  const [viewingMinistry, setViewingMinistry] = useState(null);
  const [editingMinistry, setEditingMinistry] = useState(null);
  const [editMinistryForm, setEditMinistryForm] = useState({});

  const [viewingDept, setViewingDept] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [editDeptForm, setEditDeptForm] = useState({});

  // Sync API data if available
  React.useEffect(() => {
    if (apiMinistries && apiMinistries.length > 0) {
      setMinistriesList(apiMinistries);
    }
  }, [apiMinistries]);

  // Filtered Ministries
  const filteredMinistries = useMemo(() => {
    return ministriesList.filter(m => {
      if (ministrySearch.trim() === '') return true;
      const q = ministrySearch.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        (m.code && m.code.toLowerCase().includes(q)) ||
        (m.city && m.city.toLowerCase().includes(q))
      );
    });
  }, [ministriesList, ministrySearch]);

  // Filtered Departments
  const filteredDepartments = useMemo(() => {
    return departmentsList.filter(d => {
      if (deptMinistryFilter !== 'all' && d.ministryId !== Number(deptMinistryFilter)) {
        return false;
      }
      if (deptSearch.trim() !== '') {
        const q = deptSearch.toLowerCase();
        const nameMatch = d.name.toLowerCase().includes(q);
        const headMatch = d.head ? d.head.toLowerCase().includes(q) : false;
        const minMatch = d.ministryName ? d.ministryName.toLowerCase().includes(q) : false;
        if (!nameMatch && !headMatch && !minMatch) return false;
      }
      return true;
    });
  }, [departmentsList, deptMinistryFilter, deptSearch]);

  // Handle Edit Ministry Modal Open
  const handleOpenEditMinistry = (m) => {
    setEditingMinistry(m);
    setEditMinistryForm({
      id: m.id,
      name: m.name || '',
      code: m.code || '',
      city: m.city || 'Bangladesh Secretariat, Dhaka',
      description: m.description || 'Government Ministry Operations',
      status: m.status || 'Active'
    });
  };

  const handleSaveMinistry = (e) => {
    e.preventDefault();
    if (!editingMinistry) return;

    setMinistriesList(prev => prev.map(m => m.id === editingMinistry.id ? { ...m, ...editMinistryForm } : m));
    setEditingMinistry(null);
    alert(`Successfully updated ministry details for ${editMinistryForm.name}!`);
  };

  // Handle Edit Department Modal Open
  const handleOpenEditDept = (d) => {
    setEditingDept(d);
    setEditDeptForm({
      id: d.id,
      name: d.name || '',
      ministryId: d.ministryId || 1,
      head: d.head || '',
      headDesignation: d.headDesignation || 'Department Head',
      status: d.status || 'Active'
    });
  };

  const handleSaveDept = (e) => {
    e.preventDefault();
    if (!editingDept) return;

    const parentMin = dummyMinistries.find(m => m.id === Number(editDeptForm.ministryId));
    const updatedName = parentMin ? parentMin.name : editDeptForm.ministryName;

    setDepartmentsList(prev => prev.map(d => d.id === editingDept.id ? { 
      ...d, 
      ...editDeptForm, 
      ministryId: Number(editDeptForm.ministryId),
      ministryName: updatedName 
    } : d));
    
    setEditingDept(null);
    alert(`Successfully updated department info for ${editDeptForm.name}!`);
  };

  if (isLoading) return <div style={{ height: '400px' }} className="skeleton-shimmer"></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Top Banner */}
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
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.25)',
        borderLeft: '4px solid #38BDF8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '0.625rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Landmark size={26} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Ministry & Department Governance Suite
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: 0, marginTop: '0.125rem' }}>
              Government Secretariat ministry directory, department wings, and leadership assignments
            </p>
          </div>
        </div>
      </div>

      {/* Main Sub-Tab Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveTab('ministry')}
          style={{
            padding: '0.625rem 1.125rem',
            borderRadius: '0.5rem 0.5rem 0 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'ministry' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'ministry' ? '#FFFFFF' : 'var(--slate-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Building2 size={16} /> Ministry List ({filteredMinistries.length})
        </button>

        <button
          onClick={() => setActiveTab('department')}
          style={{
            padding: '0.625rem 1.125rem',
            borderRadius: '0.5rem 0.5rem 0 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'department' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'department' ? '#FFFFFF' : 'var(--slate-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Briefcase size={16} /> Department Wings ({filteredDepartments.length})
        </button>
      </div>

      {/* TAB 1: MINISTRY MANAGEMENT */}
      {activeTab === 'ministry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Search Controls */}
          <div className="card-base" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-muted)' }} />
              <input
                type="text"
                placeholder="Search ministry name or code..."
                value={ministrySearch}
                onChange={e => setMinistrySearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
              />
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>
              {filteredMinistries.length} Ministries Active
            </div>
          </div>

          {/* Ministry Table */}
          <div className="card-base" style={{ padding: '1.5rem' }}>
            {filteredMinistries.length === 0 ? (
              <EmptyState title="No Ministries Found" description="No ministry matches your search query." />
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Ministry Name</th>
                      <th>Secretariat Location</th>
                      <th>Active Officers</th>
                      <th>Operational Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMinistries.map(m => (
                      <tr key={m.id}>
                        <td style={{ fontWeight: 700, color: '#4F46E5' }}>{m.code}</td>
                        <td style={{ fontWeight: 700 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <Building2 size={18} color="#4F46E5" />
                            <span>{m.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--slate-muted)', fontSize: '0.8125rem' }}>{m.city || "Bangladesh Secretariat, Dhaka"}</td>
                        <td style={{ fontWeight: 700, color: '#059669' }}>{m.employeeCount || 24} Officers</td>
                        <td>
                          <StatusBadge status={m.status || "Active"} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.375rem' }}>
                            <button onClick={() => setViewingMinistry(m)} title="View Details" className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>
                              <Eye size={16} color="#4F46E5" /> View
                            </button>
                            <button onClick={() => handleOpenEditMinistry(m)} title="Edit Ministry" className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', color: '#059669' }}>
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
        </div>
      )}

      {/* TAB 2: DEPARTMENT MANAGEMENT */}
      {activeTab === 'department' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Controls Bar & Filters */}
          <div className="card-base" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center', flex: 1 }}>
              {/* Department Search */}
              <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 200px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-muted)' }} />
                <input
                  type="text"
                  placeholder="Search department wing or head..."
                  value={deptSearch}
                  onChange={e => setDeptSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
                />
              </div>

              {/* Ministry Association Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} style={{ color: 'var(--primary)' }} />
                <select
                  value={deptMinistryFilter}
                  onChange={e => setDeptMinistryFilter(e.target.value)}
                  className="form-input"
                  style={{ width: 'auto', minWidth: '200px', fontSize: '0.875rem', fontWeight: 600 }}
                >
                  <option value="all">All Ministries</option>
                  {dummyMinistries.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>
              {filteredDepartments.length} Department Wings
            </div>
          </div>

          {/* Department Table */}
          <div className="card-base" style={{ padding: '1.5rem' }}>
            {filteredDepartments.length === 0 ? (
              <EmptyState title="No Departments Found" description="No department wing matches the selected search filter." />
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Department Wing Name</th>
                      <th>Parent Ministry</th>
                      <th>Assigned Department Head</th>
                      <th>Staff Members</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.map(d => (
                      <tr key={d.id}>
                        <td style={{ fontWeight: 700, color: '#0F172A' }}>{d.name}</td>
                        <td style={{ fontWeight: 600, color: '#4F46E5' }}>{d.ministryName}</td>
                        <td>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700 }}>{d.head}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-muted)' }}>{d.headDesignation}</p>
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: '#059669' }}>{d.staffCount} Staff</td>
                        <td>
                          <StatusBadge status={d.status} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.375rem' }}>
                            <button onClick={() => setViewingDept(d)} title="View Department Details" className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>
                              <Eye size={16} color="#4F46E5" /> View
                            </button>
                            <button onClick={() => handleOpenEditDept(d)} title="Edit Department" className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', color: '#059669' }}>
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
        </div>
      )}

      {/* VIEW MINISTRY DETAILS MODAL */}
      {viewingMinistry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Ministry Profile Record</h3>
              <button onClick={() => setViewingMinistry(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Building2 size={24} color="#4F46E5" />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800 }}>{viewingMinistry.name}</h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4F46E5' }}>Code: {viewingMinistry.code}</span>
                </div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                <div><span style={{ color: 'var(--slate-muted)' }}>Location: </span><strong>{viewingMinistry.city || "Bangladesh Secretariat, Dhaka"}</strong></div>
                <div><span style={{ color: 'var(--slate-muted)' }}>Active Officers: </span><strong>{viewingMinistry.employeeCount || 24} Officers</strong></div>
                <div><span style={{ color: 'var(--slate-muted)' }}>Status: </span><StatusBadge status={viewingMinistry.status || "Active"} /></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MINISTRY MODAL */}
      {editingMinistry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '500px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Edit Ministry Information</h3>
              <button onClick={() => setEditingMinistry(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveMinistry} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Ministry Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={editMinistryForm.name}
                  onChange={e => setEditMinistryForm({ ...editMinistryForm, name: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Ministry Code</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editMinistryForm.code}
                    onChange={e => setEditMinistryForm({ ...editMinistryForm, code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Operational Status</label>
                  <select
                    className="form-select"
                    value={editMinistryForm.status}
                    onChange={e => setEditMinistryForm({ ...editMinistryForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Secretariat Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={editMinistryForm.city}
                  onChange={e => setEditMinistryForm({ ...editMinistryForm, city: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingMinistry(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#059669' }}>
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DEPARTMENT MODAL */}
      {viewingDept && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Department Wing Record</h3>
              <button onClick={() => setViewingDept(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Briefcase size={24} color="#4F46E5" />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800 }}>{viewingDept.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#4F46E5', fontWeight: 700 }}>{viewingDept.ministryName}</p>
                </div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                <div><span style={{ color: 'var(--slate-muted)' }}>Assigned Head: </span><strong>{viewingDept.head} ({viewingDept.headDesignation})</strong></div>
                <div><span style={{ color: 'var(--slate-muted)' }}>Total Personnel: </span><strong>{viewingDept.staffCount} Officers</strong></div>
                <div><span style={{ color: 'var(--slate-muted)' }}>Status: </span><StatusBadge status={viewingDept.status} /></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DEPARTMENT MODAL */}
      {editingDept && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '500px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Edit Department Information</h3>
              <button onClick={() => setEditingDept(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveDept} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Department Wing Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={editDeptForm.name}
                  onChange={e => setEditDeptForm({ ...editDeptForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Parent Ministry</label>
                <select
                  className="form-select"
                  value={editDeptForm.ministryId}
                  onChange={e => setEditDeptForm({ ...editDeptForm, ministryId: Number(e.target.value) })}
                >
                  {dummyMinistries.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Department Head Officer</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editDeptForm.head}
                    onChange={e => setEditDeptForm({ ...editDeptForm, head: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editDeptForm.status}
                    onChange={e => setEditDeptForm({ ...editDeptForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Restructuring">Restructuring</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingDept(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#059669' }}>
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
