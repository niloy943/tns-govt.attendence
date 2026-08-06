import React from 'react';
import { Search, Bell, Landmark, Building, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrentMinistry } from '../../hooks/useCurrentMinistry';

export default function Topbar() {
  const { 
    currentUser, 
    viewLevel, 
    setCentralView, 
    setMinistryView, 
    selectedMinistryId, 
    setSelectedMinistryId,
    selectMinistry,
    logout
  } = useAuth();
  const { ministries } = useCurrentMinistry();

  const [showNotifications, setShowNotifications] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(3);

  const notifications = [
    { id: 1, title: "Leave Request", text: "Anisur Rahman submitted a Casual Leave request.", time: "10 mins ago" },
    { id: 2, title: "Device Sync", text: "Device 'DEV-MOF-02' sync completed successfully.", time: "1 hour ago" },
    { id: 3, title: "Budget Warning", text: "Ministry budget allocation is at 92% utilization.", time: "3 hours ago", urgent: true }
  ];

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

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
            {ministries.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Icon with Interactive Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-ghost" 
            style={{ position: 'relative', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: 'var(--rose)' }}></span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--slate-border)',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              width: '320px',
              zIndex: 50,
              padding: '1rem',
              color: 'var(--slate-text)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--slate-border)', paddingBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto' }}>
                {unreadCount === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--slate-muted)', fontSize: '0.8125rem' }}>
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: n.urgent ? 'var(--rose-light)' : '#F8FAFC' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.75rem', color: n.urgent ? '#991B1B' : 'var(--slate-text)' }}>{n.title}</span>
                        <span style={{ fontSize: '0.625rem', color: 'var(--slate-muted)' }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', margin: 0, color: n.urgent ? '#991B1B' : '#475569' }}>{n.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
