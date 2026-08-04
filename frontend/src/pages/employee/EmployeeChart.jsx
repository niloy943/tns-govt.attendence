import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  UserCheck, 
  Mail, 
  Phone, 
  Calendar, 
  X, 
  ChevronRight, 
  Network, 
  Grid, 
  Users, 
  Award,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployees';
import { useAuth } from '../../context/AuthContext';
import { dummyMinistries } from '../../data/dummy/ministries';
import GovtLogo from '../../components/layout/GovtLogo';

export default function EmployeeChart() {
  const { data: employees, isLoading } = useEmployees();
  const { selectedMinistryId, setSelectedMinistryId } = useAuth();

  const [activeMinistryId, setActiveMinistryId] = useState(selectedMinistryId || "all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("tree"); // "tree" | "grid"
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Sync state if context changes externally
  React.useEffect(() => {
    setActiveMinistryId(selectedMinistryId || "all");
  }, [selectedMinistryId]);

  const handleMinistryChange = (e) => {
    const val = e.target.value;
    setActiveMinistryId(val);
    setSelectedMinistryId(val);
  };

  const handleFocusMinistry = (ministryId) => {
    const val = String(ministryId);
    setActiveMinistryId(val);
    setSelectedMinistryId(val);
  };

  // Group employees by Ministry for separated Central pitch view
  const employeesByMinistry = useMemo(() => {
    if (!employees) return [];

    let filtered = employees;

    // Apply Department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(e => e.department === selectedDepartment);
    }

    // Apply Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(q) || 
        e.designation.toLowerCase().includes(q) || 
        e.employeeCode.toLowerCase().includes(q)
      );
    }

    if (activeMinistryId !== "all") {
      const targetId = Number(activeMinistryId);
      const ministryObj = dummyMinistries.find(m => m.id === targetId) || { id: targetId, name: "Selected Ministry" };
      return [{
        ministry: ministryObj,
        list: filtered.filter(e => e.ministryId === targetId)
      }];
    }

    // Central View: Separate into pitches for each Ministry
    return dummyMinistries.map(m => {
      const list = filtered.filter(e => e.ministryId === m.id);
      return { ministry: m, list };
    }).filter(group => group.list.length > 0);
  }, [employees, activeMinistryId, selectedDepartment, searchQuery]);

  // Extract unique departments for current active filter
  const availableDepartments = useMemo(() => {
    if (!employees) return [];
    const source = activeMinistryId === "all" 
      ? employees 
      : employees.filter(e => e.ministryId === Number(activeMinistryId));
    const depts = new Set(source.map(e => e.department).filter(Boolean));
    return Array.from(depts);
  }, [employees, activeMinistryId]);

  if (isLoading) {
    return <div style={{ height: '500px' }} className="skeleton-shimmer"></div>;
  }

  // Superior name helper for modal
  const getSuperiorName = (reportsToId) => {
    if (!reportsToId || !employees) return "N/A (Head of Ministry)";
    const supervisor = employees.find(e => e.id === reportsToId);
    return supervisor ? `${supervisor.name} (${supervisor.designation})` : "N/A";
  };

  const totalFilteredCount = employeesByMinistry.reduce((acc, g) => acc + g.list.length, 0);

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
            <Network size={26} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {activeMinistryId === "all" ? "Central Government Organogram Dashboard" : "Ministry Organogram Chart"}
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#E0E7FF', margin: 0, marginTop: '0.125rem' }}>
              {activeMinistryId === "all" 
                ? "Click any ministry branch below to view its dedicated, separate organogram chart" 
                : "Displaying reporting structure and command hierarchy for selected ministry"}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Back to Central View Button */}
          {activeMinistryId !== "all" && (
            <button
              onClick={() => handleFocusMinistry("all")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.4rem 0.875rem',
                borderRadius: '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowLeft size={16} /> Back to Central View
            </button>
          )}

          {/* View Mode Switcher */}
          <div style={{ display: 'flex', backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '0.25rem', borderRadius: '0.5rem' }}>
            <button
              onClick={() => setViewMode("tree")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.4rem 0.875rem',
                borderRadius: '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === "tree" ? "#FFFFFF" : "transparent",
                color: viewMode === "tree" ? "#4F46E5" : "#FFFFFF",
                transition: 'all 0.2s ease'
              }}
            >
              <Network size={16} /> Tree Organogram
            </button>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.4rem 0.875rem',
                borderRadius: '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === "grid" ? "#FFFFFF" : "transparent",
                color: viewMode === "grid" ? "#4F46E5" : "#FFFFFF",
                transition: 'all 0.2s ease'
              }}
            >
              <Grid size={16} /> Department Grid
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="card-base" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center', flex: 1 }}>
          
          {/* Ministry Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} style={{ color: 'var(--primary)' }} />
            <select
              value={activeMinistryId}
              onChange={handleMinistryChange}
              className="form-input"
              style={{ width: 'auto', minWidth: '240px', fontSize: '0.875rem', fontWeight: 600 }}
            >
              <option value="all">🏢 Central View (All Ministries)</option>
              {dummyMinistries.map(m => (
                <option key={m.id} value={m.id}>📍 {m.name}</option>
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
              style={{ width: 'auto', minWidth: '180px', fontSize: '0.875rem' }}
            >
              <option value="all">All Departments</option>
              {availableDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-muted)' }} />
            <input
              type="text"
              placeholder="Search officer name or designation..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: '#EEF2FF', padding: '0.4rem 0.875rem', borderRadius: '0.5rem' }}>
          {totalFilteredCount} Personnel Listed
        </div>
      </div>

      {/* Main Organogram View */}
      {employeesByMinistry.length === 0 ? (
        <div className="card-base" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--slate-muted)' }}>
          <Users size={48} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No officers found matching the selected filter criteria.</p>
          <button 
            onClick={() => { setActiveMinistryId("all"); setSelectedDepartment("all"); setSearchQuery(""); }}
            className="btn btn-secondary"
            style={{ marginTop: '0.75rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
          {employeesByMinistry.map(({ ministry, list }) => (
            <MinistryOrganogramPitch
              key={ministry.id}
              ministry={ministry}
              employees={list}
              viewMode={viewMode}
              onSelectEmployee={setSelectedEmployee}
              onFocusMinistry={handleFocusMinistry}
              isCentralMode={activeMinistryId === "all"}
            />
          ))}
        </div>
      )}

      {/* OFFICER PROFILE MODAL */}
      {selectedEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '1rem',
            maxWidth: '520px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#4F46E5',
              backgroundImage: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 100%)',
              color: '#FFFFFF',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={22} />
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, margin: 0 }}>Officer Command Record</h3>
              </div>
              <button 
                onClick={() => setSelectedEmployee(null)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', opacity: 0.9 }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  style={{ width: '76px', height: '76px', borderRadius: '9999px', objectFit: 'cover', border: '3px solid #6366F1' }}
                />
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4F46E5', backgroundColor: '#EEF2FF', padding: '0.15rem 0.5rem', borderRadius: '0.375rem' }}>
                    {selectedEmployee.employeeCode}
                  </span>
                  <h2 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#1E293B', margin: '0.375rem 0 0.125rem 0' }}>
                    {selectedEmployee.name}
                  </h2>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4F46E5', margin: 0 }}>
                    {selectedEmployee.designation}
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--slate-border)', padding: '1rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-muted)' }}>Ministry / Office:</span>
                  <span style={{ fontWeight: 700, color: 'var(--slate-text)' }}>{selectedEmployee.ministryName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-muted)' }}>Department Wing:</span>
                  <span style={{ fontWeight: 700, color: 'var(--slate-text)' }}>{selectedEmployee.department}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-muted)' }}>Direct Superior:</span>
                  <span style={{ fontWeight: 700, color: '#4338CA' }}>{getSuperiorName(selectedEmployee.reportsTo)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-muted)' }}>Official Joining:</span>
                  <span style={{ fontWeight: 600, color: 'var(--slate-text)' }}>{selectedEmployee.joiningDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <a 
                  href={`mailto:${selectedEmployee.email}`}
                  className="btn btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.8125rem' }}
                >
                  <Mail size={16} /> Email Officer
                </a>
                <a 
                  href={`tel:${selectedEmployee.phone}`}
                  className="btn btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.8125rem' }}
                >
                  <Phone size={16} /> Call Phone
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Single Ministry Pitch Organogram Container
function MinistryOrganogramPitch({ ministry, employees, viewMode, onSelectEmployee, onFocusMinistry, isCentralMode }) {
  // Find Root Top Executive Node(s)
  const rootNodes = useMemo(() => {
    const ids = new Set(employees.map(e => e.id));
    return employees.filter(e => e.reportsTo === null || !ids.has(e.reportsTo) || e.level === 'ceo');
  }, [employees]);

  return (
    <div className="card-base" style={{ padding: '1.5rem', overflowX: 'auto' }}>
      
      {/* Ministry Pitch Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid #E2E8F0',
        paddingBottom: '0.875rem',
        marginBottom: '1.75rem'
      }}>
        <div 
          onClick={() => isCentralMode && onFocusMinistry(ministry.id)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            cursor: isCentralMode ? 'pointer' : 'default'
          }}
          title={isCentralMode ? "Click to open separate organogram chart for this ministry" : ""}
        >
          <div style={{
            backgroundColor: isCentralMode ? '#EEF2FF' : '#F0FDF4',
            color: isCentralMode ? '#4F46E5' : '#166534',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            display: 'flex'
          }}>
            <Building2 size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {ministry.name}
              {isCentralMode && <ExternalLink size={16} style={{ color: '#4F46E5' }} />}
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, marginTop: '0.125rem' }}>
              {ministry.city || "Bangladesh Secretariat, Dhaka"} • {employees.length} Active Officers
            </p>
          </div>
        </div>

        {isCentralMode ? (
          <button
            onClick={() => onFocusMinistry(ministry.id)}
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#4F46E5',
              backgroundColor: '#EEF2FF',
              padding: '0.375rem 0.875rem',
              borderRadius: '0.5rem',
              border: '1px solid #C7D2FE',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              transition: 'all 0.15s ease'
            }}
          >
            <ExternalLink size={14} /> View Separate Organogram →
          </button>
        ) : (
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            color: '#047857',
            backgroundColor: '#ECFDF5',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            border: '1px solid #A7F3D0'
          }}>
            INDIVIDUAL MINISTRY VIEW
          </span>
        )}
      </div>

      {viewMode === "tree" ? (
        /* CLEAN TREE ORGANOGRAM PITCH */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minWidth: '650px', padding: '1rem 0' }}>
          {rootNodes.map(root => (
            <TreeNodeBranch 
              key={root.id} 
              node={root} 
              allEmployees={employees} 
              onSelectEmployee={onSelectEmployee}
              isRoot={true}
            />
          ))}
        </div>
      ) : (
        /* GRID VIEW FOR THIS MINISTRY */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {employees.map(emp => (
            <div
              key={emp.id}
              onClick={() => onSelectEmployee(emp)}
              className="hover-card-elevation"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--slate-border)',
                borderRadius: '0.75rem',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <img
                src={emp.avatar}
                alt={emp.name}
                style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #6366F1' }}
              />
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--slate-text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {emp.name}
                </h4>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4F46E5', margin: '0.125rem 0 0 0' }}>
                  {emp.designation}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>
                  {emp.department}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Recursive Tree Node Renderer featuring mathematically perfect parent-to-child connector lines
function TreeNodeBranch({ node, allEmployees, onSelectEmployee, isRoot }) {
  // Find direct child subordinates reporting to this node
  const children = useMemo(() => {
    return allEmployees.filter(e => e.reportsTo === node.id);
  }, [allEmployees, node.id]);

  // Determine card style colors based on level
  const styleConfig = useMemo(() => {
    switch (node.level) {
      case 'ceo':
        return { borderColor: '#4F46E5', bg: '#EEF2FF', roleColor: '#3730A3', line: '#4F46E5' };
      case 'vp':
      case 'director':
        return { borderColor: '#9333EA', bg: '#F3E8FF', roleColor: '#6B21A8', line: '#9333EA' };
      case 'manager':
        return { borderColor: '#10B981', bg: '#ECFDF5', roleColor: '#047857', line: '#10B981' };
      case 'asst_manager':
        return { borderColor: '#F59E0B', bg: '#FFFBEB', roleColor: '#B45309', line: '#F59E0B' };
      default:
        return { borderColor: '#64748B', bg: '#F8FAFC', roleColor: '#334155', line: '#94A3B8' };
    }
  }, [node.level]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      
      {/* Node Card - Fixed 250px Width for Perfect Mathematical Line Alignment */}
      <div
        onClick={() => onSelectEmployee(node)}
        className="hover-card-elevation"
        style={{
          border: `2.5px solid ${styleConfig.borderColor}`,
          borderRadius: '1rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#FFFFFF',
          textAlign: 'center',
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          boxSizing: 'border-box',
          cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.06)',
          zIndex: 2,
          position: 'relative',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.375rem' }}>
          <img
            src={node.avatar}
            alt={node.name}
            style={{
              width: isRoot ? '56px' : '48px',
              height: isRoot ? '56px' : '48px',
              borderRadius: '9999px',
              objectFit: 'cover',
              border: `2px solid ${styleConfig.borderColor}`
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: '12px',
            height: '12px',
            borderRadius: '9999px',
            backgroundColor: '#10B981',
            border: '2px solid #FFFFFF'
          }} />
        </div>

        <h4 style={{ fontSize: isRoot ? '0.9375rem' : '0.875rem', fontWeight: 800, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.name}
        </h4>

        <p style={{
          fontSize: '0.65rem',
          fontWeight: 800,
          color: styleConfig.roleColor,
          textTransform: 'uppercase',
          marginTop: '0.25rem',
          marginBottom: '0.25rem',
          backgroundColor: styleConfig.bg,
          padding: '0.2rem 0.5rem',
          borderRadius: '0.375rem',
          display: 'inline-block',
          letterSpacing: '0.02em',
          lineHeight: '1.3',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {node.designation}
        </p>

        <p style={{ fontSize: '0.65rem', color: '#64748B', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.department}
        </p>
      </div>

      {/* CONNECTOR LINE SYSTEM TO SUBORDINATES */}
      {children.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
          
          {/* Vertical Stem dropping down from parent node */}
          <div style={{
            width: '3px',
            height: '24px',
            backgroundColor: '#4F46E5',
            position: 'relative'
          }}>
            {/* Split Junction Indicator Dot */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translate(-50%, 50%)',
              width: '8px',
              height: '8px',
              borderRadius: '9999px',
              backgroundColor: '#4F46E5',
              zIndex: 3
            }} />
          </div>

          {/* Children Container Branch */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            position: 'relative',
            marginTop: 0
          }}>
            {/* SINGLE CONTINUOUS UNBROKEN HORIZONTAL BRIDGE LINE */}
            {children.length > 1 && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '125px', // Exact center of first 250px child card!
                right: '125px', // Exact center of last 250px child card!
                height: '3px',
                backgroundColor: '#4F46E5',
                zIndex: 2
              }} />
            )}

            {/* Render Each Subordinate Child Branch */}
            {children.map((child) => (
              <div 
                key={child.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  position: 'relative',
                  width: '250px',
                  minWidth: '250px',
                  maxWidth: '250px'
                }}
              >
                {/* Vertical Drop Line connecting horizontal bridge into top center of child node */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '3px',
                  height: '20px',
                  backgroundColor: '#4F46E5',
                  zIndex: 1
                }} />

                <div style={{ paddingTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <TreeNodeBranch 
                    node={child} 
                    allEmployees={allEmployees} 
                    onSelectEmployee={onSelectEmployee}
                    isRoot={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
