import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users,
  CalendarCheck, 
  FileText, 
  Clock, 
  BarChart3, 
  Settings as SettingsIcon,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GovtLogo from './GovtLogo';

export default function Sidebar() {
  const { currentUser } = useAuth();

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/ministry", label: "Ministry & Branches", icon: Building2 },
    {
      label: "Employee",
      icon: Users,
      children: [
        { to: "/employee/create", label: "Create Employee" },
        { to: "/employee/list", label: "List of Employee" },
        { to: "/employee/chart", label: "Employee Chart" }
      ]
    },
    { 
      label: "Attendance", 
      icon: CalendarCheck,
      children: [
        { to: "/attendance/list", label: "Attendance List" },
        { to: "/attendance/individual", label: "Individual Record" },
        { to: "/attendance/summary", label: "Monthly Summary" },
        { to: "/attendance/sheet", label: "Attendance Sheet" }
      ]
    },
    { to: "/leave", label: "Leave Requests", icon: FileText },
    { to: "/overtime", label: "Overtime Duty", icon: Clock },
    { to: "/reports", label: "Government Reports", icon: BarChart3 },
    { to: "/settings", label: "System Settings", icon: SettingsIcon },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      borderRight: '1px solid #1E293B',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <GovtLogo style={{ width: '2.75rem', height: '2.75rem' }} />
        <div>
          <h1 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Govt Attendence</h1>
          <p style={{ fontSize: '0.725rem', color: 'var(--text-sidebar)' }}>Ministry Portal</p>
        </div>
      </div>

      {/* Role Pill */}
      <div style={{ padding: '1rem 1.5rem 0.5rem 1.5rem' }}>
        <div style={{
          backgroundColor: '#1E293B',
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <ShieldAlert size={16} style={{ color: '#60A5FA' }} />
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Role</p>
            <p style={{ fontSize: '0.775rem', fontWeight: 600, color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser.roleLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none' }}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            if (item.children) {
              return (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  <div style={{
                    padding: '0.625rem 0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--text-sidebar)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  <ul style={{ listStyle: 'none', paddingLeft: '1.75rem', marginTop: '0.25rem' }}>
                    {item.children.map((child, cIdx) => (
                      <li key={cIdx} style={{ marginBottom: '0.25rem' }}>
                        <NavLink
                          to={child.to}
                          style={({ isActive }) => ({
                            display: 'block',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.8125rem',
                            textDecoration: 'none',
                            color: isActive ? 'var(--text-sidebar-active)' : 'var(--text-sidebar)',
                            backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'all 0.15s ease-in-out'
                          })}
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }

            return (
              <li key={index} style={{ marginBottom: '0.375rem' }}>
                <NavLink
                  to={item.to}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    color: isActive ? 'var(--text-sidebar-active)' : 'var(--text-sidebar)',
                    backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.15s ease-in-out'
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span style={{
                      backgroundColor: '#3730A3',
                      color: '#E0E7FF',
                      fontSize: '0.675rem',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.25rem',
                      fontWeight: 600
                    }}>
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight size={14} style={{ opacity: 0.4 }} />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Info */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid #1E293B',
        fontSize: '0.75rem',
        color: 'var(--text-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}>
        <p style={{ fontWeight: 600, color: '#E2E8F0' }}>Govt Ministry Attendance v2.4</p>
        <p>Government Digital Solutions</p>
      </div>
    </aside>
  );
}
