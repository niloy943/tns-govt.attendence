import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Layers, 
  MapPin, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Save, 
  Edit3,
  ShieldAlert
} from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployees';
import { dummyMinistries } from '../../data/dummy/ministries';

export default function EmployeeAssignment() {
  const { data: employees = [] } = useEmployees();
  const [selectedMinistryId, setSelectedMinistryId] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  
  // Bulk reassignment target fields
  const [targetMinistryId, setTargetMinistryId] = useState(1);
  const [targetDepartment, setTargetDepartment] = useState('Administration & Operations');
  const [targetWing, setTargetWing] = useState('Executive Wing');
  const [targetSection, setTargetSection] = useState('Section-01');

  const filteredEmployees = employees.filter(e => {
    if (selectedMinistryId !== 'all' && e.ministryId !== Number(selectedMinistryId)) return false;
    if (selectedDepartment !== 'all' && e.department !== selectedDepartment) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.name.toLowerCase().includes(q) && !e.employeeCode.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmployeeIds(filteredEmployees.map(emp => emp.id));
    } else {
      setSelectedEmployeeIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedEmployeeIds.includes(id)) {
      setSelectedEmployeeIds(selectedEmployeeIds.filter(i => i !== id));
    } else {
      setSelectedEmployeeIds([...selectedEmployeeIds, id]);
    }
  };

  const handleExecuteBulkAssignment = () => {
    if (selectedEmployeeIds.length === 0) {
      alert("Please select at least one employee for organizational assignment.");
      return;
    }
    const targetMinistryObj = dummyMinistries.find(m => m.id === Number(targetMinistryId));
    employees.forEach(emp => {
      if (selectedEmployeeIds.includes(emp.id)) {
        emp.ministryId = Number(targetMinistryId);
        emp.ministryName = targetMinistryObj ? targetMinistryObj.name : emp.ministryName;
        emp.department = targetDepartment;
        emp.wing = targetWing;
        emp.section = targetSection;
      }
    });
    alert(`Successfully reassigned ${selectedEmployeeIds.length} officers to ${targetMinistryObj?.name || 'target ministry'}!`);
    setSelectedEmployeeIds([]);
  };

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
            <Building2 size={24} color="#34D399" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              Organizational Assignment & Wing Mapping
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '0.15rem 0 0 0' }}>
              Assign officers across Ministry, Department, Wing, Section & Command Hierarchy
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        
        {/* Left Column: Officer List & Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Filter Bar */}
          <div className="card-base" style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-muted)' }} />
              <input
                type="text"
                placeholder="Filter officer name or code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.25rem', fontSize: '0.8125rem' }}
              />
            </div>

            <select
              value={selectedMinistryId}
              onChange={e => setSelectedMinistryId(e.target.value)}
              className="form-select"
              style={{ width: 'auto', fontSize: '0.8125rem' }}
            >
              <option value="all">All Ministries</option>
              {dummyMinistries.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="card-base" style={{ padding: '1rem' }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={selectedEmployeeIds.length > 0 && selectedEmployeeIds.length === filteredEmployees.length}
                      />
                    </th>
                    <th>Officer</th>
                    <th>Current Ministry</th>
                    <th>Department & Wing</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedEmployeeIds.includes(emp.id)}
                          onChange={() => handleToggleSelect(emp.id)}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={emp.avatar} alt={emp.name} style={{ width: '32px', height: '32px', borderRadius: '9999px', objectFit: 'cover' }} />
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8125rem' }}>{emp.name}</p>
                            <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>{emp.employeeCode}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{emp.ministryName}</td>
                      <td style={{ fontSize: '0.775rem' }}>
                        <div><strong>{emp.department}</strong></div>
                        <div style={{ color: 'var(--slate-muted)' }}>{emp.wing || 'Executive Wing'} ({emp.section || 'Section-01'})</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Reassignment Action Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--primary)' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Target Assignment Specs</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: 0 }}>Selected Officers: <strong>{selectedEmployeeIds.length}</strong></p>
            </div>

            <div>
              <label className="form-label">New Ministry</label>
              <select className="form-select" value={targetMinistryId} onChange={e => setTargetMinistryId(e.target.value)}>
                {dummyMinistries.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Department Title</label>
              <input type="text" className="form-input" value={targetDepartment} onChange={e => setTargetDepartment(e.target.value)} />
            </div>

            <div>
              <label className="form-label">Wing Name</label>
              <input type="text" className="form-input" value={targetWing} onChange={e => setTargetWing(e.target.value)} />
            </div>

            <div>
              <label className="form-label">Section Designation</label>
              <input type="text" className="form-input" value={targetSection} onChange={e => setTargetSection(e.target.value)} />
            </div>

            <button 
              onClick={handleExecuteBulkAssignment} 
              className="btn btn-primary"
              style={{ marginTop: '0.5rem', width: '100%' }}
            >
              <Save size={16} /> Execute Reassignment
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
