import React from 'react';
import { Search, Bell, Landmark, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dummyMinistries } from '../../data/dummy/ministries';

export default function Topbar() {
  const { 
    currentUser, 
    viewLevel, 
    setCentralView, 
    setMinistryView, 
    selectedMinistryId, 
    setSelectedMinistryId,
    selectMinistry
  } = useAuth();

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
      {/* 2-LEVEL VIEW SWITCHER: Central -> Ministry */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
        <button
          onClick={setCentralView}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.875rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: viewLevel === 'central' ? 'var(--primary)' : 'transparent',
            color: viewLevel === 'central' ? '#FFFFFF' : '#475569',
            transition: 'all 0.15s ease'
          }}
        >
          <Landmark size={15} />
          Central (All Ministries)
        </button>

        <button
          onClick={() => setMinistryView(selectedMinistryId === 'all' ? 1 : selectedMinistryId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.875rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: viewLevel === 'ministry' ? 'var(--primary)' : 'transparent',
            color: viewLevel === 'ministry' ? '#FFFFFF' : '#475569',
            transition: 'all 0.15s ease'
          }}
        >
          <Building size={15} />
          Ministry View
        </button>
      </div>

      {/* Dynamic Ministry Dropdown & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Ministry Dropdown Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F8FAFC', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}>
          <Building size={16} style={{ color: 'var(--primary)' }} />
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)', whiteSpace: 'nowrap' }}>
            Select Ministry:
          </label>
          <select
            value={selectedMinistryId}
            onChange={(e) => selectMinistry(e.target.value)}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--slate-text)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">Central Dashboard (All Ministries)</option>
            {dummyMinistries.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

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
