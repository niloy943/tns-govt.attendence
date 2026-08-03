import React from 'react';
import { Search, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { currentUser, mockUsers, switchUser } = useAuth();

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
      {/* Search Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '24rem' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search employees, ministries, requests..."
            className="form-input"
            style={{ paddingLeft: '2.5rem', height: '38px', backgroundColor: '#F8FAFC' }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Active Role Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F1F5F9', padding: '0.375rem 0.75rem', borderRadius: '0.5rem' }}>
          <Shield size={16} style={{ color: 'var(--primary)' }} />
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)', whiteSpace: 'nowrap' }}>
            Role View:
          </label>
          <select
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
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
            {mockUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.roleLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Icon */}
        <button className="btn btn-ghost" style={{ position: 'relative', padding: '0.5rem' }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            borderRadius: '9999px',
            backgroundColor: 'var(--rose)'
          }}></span>
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
