import React from 'react';
import { Search, Bell, Landmark, Building, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dummyMinistries } from '../../data/dummy/ministries';

export default function Topbar() {
  const { 
    currentUser, 
    viewLevel, 
    setCentralView, 
    setMinistryView, 
    setDepartmentView,
    selectedMinistryId, 
    setSelectedMinistryId,
    selectedDepartmentId,
    setSelectedDepartmentId
  } = useAuth();

  const mockDepartments = [
    { id: 1, name: "HR & Admin" },
    { id: 2, name: "Finance & Accounts" },
    { id: 3, name: "Social Welfare Dept" },
    { id: 4, name: "Women & Child Affairs" },
    { id: 5, name: "ICT & Digital Infra" }
  ];

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--slate-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {/* 3-TIER LEVEL SWITCHER: Central -> Ministry -> Department */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
        <button
          onClick={setCentralView}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontSize: '0.775rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: viewLevel === 'central' ? 'var(--primary)' : 'transparent',
            color: viewLevel === 'central' ? '#FFFFFF' : '#475569',
            transition: 'all 0.15s ease'
          }}
        >
          <Landmark size={14} />
          Central (All Ministries)
        </button>

        <button
          onClick={() => setMinistryView(selectedMinistryId === 'all' ? 1 : selectedMinistryId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontSize: '0.775rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: viewLevel === 'ministry' ? 'var(--primary)' : 'transparent',
            color: viewLevel === 'ministry' ? '#FFFFFF' : '#475569',
            transition: 'all 0.15s ease'
          }}
        >
          <Building size={14} />
          Ministry
        </button>

        <button
          onClick={() => setDepartmentView(selectedDepartmentId === 'all' ? 1 : selectedDepartmentId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontSize: '0.775rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: viewLevel === 'department' ? 'var(--primary)' : 'transparent',
            color: viewLevel === 'department' ? '#FFFFFF' : '#475569',
            transition: 'all 0.15s ease'
          }}
        >
          <Layers size={14} />
          Department
        </button>
      </div>

      {/* Dynamic Dropdowns & Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {viewLevel === 'ministry' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F8FAFC', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Ministry:</label>
            <select
              value={selectedMinistryId}
              onChange={(e) => setSelectedMinistryId(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-text)', outline: 'none', cursor: 'pointer' }}
            >
              {dummyMinistries.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        )}

        {viewLevel === 'department' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F8FAFC', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Department:</label>
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-text)', outline: 'none', cursor: 'pointer' }}
            >
              {mockDepartments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Notifications Icon */}
        <button className="btn btn-ghost" style={{ position: 'relative', padding: '0.5rem' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: 'var(--rose)' }}></span>
        </button>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--slate-border)', paddingLeft: '1.25rem' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: '38px', height: '38px', borderRadius: '9999px', objectFit: 'cover' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-text)' }}>
              {currentUser.name}
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--slate-muted)' }}>
              {currentUser.ministryName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
