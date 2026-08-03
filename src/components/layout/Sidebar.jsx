import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  ChevronRight,
  Landmark,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dummyMinistries } from '../../data/dummy/ministries';
import GovtLogo from './GovtLogo';

export default function Sidebar() {
  const location = useLocation();
  const { 
    currentUser, 
    viewLevel, 
    setCentralView, 
    setMinistryView, 
    selectedMinistryId 
  } = useAuth();

  // Selected Ministry Object to dynamically show name in fixed brand header
  const selectedMinistryObj = selectedMinistryId !== 'all'
    ? dummyMinistries.find(m => m.id === Number(selectedMinistryId))
    : null;

  const headerSubtitle = selectedMinistryObj ? selectedMinistryObj.name : "Central Secretariat";

  // Explicitly separate active states for Central vs Ministry Dashboard on route '/'
  const isCentralActive = location.pathname === '/' && (viewLevel === 'central' || selectedMinistryId === 'all');
  const isMinistryActive = location.pathname === '/' && viewLevel === 'ministry' && selectedMinistryId !== 'all';

  const navSections = [
    {
      level: "Central Operations",
      subtitle: "Government-wide Level",
      icon: Landmark,
      items: [
        { 
          to: "/", 
          label: "Central Dashboard", 
          icon: LayoutDashboard, 
          isCustomActive: isCentralActive,
          onClick: () => setCentralView() 
        },
        { to: "/ministry", label: "All Ministries", icon: Building2 },
        { to: "/reports", label: "Government Reports", icon: BarChart3 },
      ]
    },
    {
      level: "Ministry Operations",
      subtitle: "Selected Ministry Level",
      icon: Building,
      items: [
        { 
          to: "/", 
          label: "Ministry Dashboard", 
          icon: LayoutDashboard, 
          isCustomActive: isMinistryActive,
          onClick: () => {
            const targetId = (selectedMinistryId === 'all' || !selectedMinistryId) ? (currentUser.ministryId || 1) : selectedMinistryId;
            setMinistryView(targetId);
          }
        },
        {
          label: "Employee Management",
          icon: Users,
          children: [
            { to: "/employee/create", label: "Create Employee" },
            { to: "/employee/list", label: "List of Employees" },
            { to: "/employee/chart", label: "Hierarchy Chart" }
          ]
        },
        { 
          label: "Attendance Logs", 
          icon: CalendarCheck,
          children: [
            { to: "/attendance/list", label: "Daily Attendance" },
            { to: "/attendance/individual", label: "Individual Record" },
            { to: "/attendance/summary", label: "Monthly Summary" },
            { to: "/attendance/sheet", label: "Attendance Sheet" }
          ]
        },
        { to: "/leave", label: "Leave Requests", icon: FileText },
        { to: "/overtime", label: "Overtime Duty", icon: Clock },
        { to: "/settings", label: "Settings & Control", icon: SettingsIcon },
      ]
    }
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      borderRight: '1px solid #1E293B',
      flexShrink: 0,
      position: 'sticky',
      top: 0
    }}>
      {/* 1. FIXED BRAND HEADER WITH DYNAMIC SUBTITLE */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        position: 'sticky',
        top: 0,
        backgroundColor: '#0F172A',
        zIndex: 20
      }}>
        <GovtLogo style={{ width: '2.75rem', height: '2.75rem' }} />
        <div>
          <h1 style={{ fontSize: '0.8125rem', fontWeight: 700, lineHeight: 1.2, color: '#F8FAFC' }}>
            Government of Bangladesh
          </h1>
          {/* Subtitle displays selected ministry or Central Secretariat */}
          <p style={{
            fontSize: '0.725rem',
            color: selectedMinistryObj ? '#60A5FA' : '#38BDF8',
            fontWeight: 600,
            marginTop: '0.2rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '165px'
          }} title={headerSubtitle}>
            {headerSubtitle}
          </p>
        </div>
      </div>

      {/* Role Badge */}
      <div style={{ padding: '0.875rem 1.25rem 0.375rem 1.25rem' }}>
        <div style={{
          backgroundColor: '#1E293B',
          borderRadius: '0.5rem',
          padding: '0.4rem 0.625rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <ShieldAlert size={15} style={{ color: '#60A5FA' }} />
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.775rem', fontWeight: 600, color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser.roleLabel}
            </p>
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE NAVIGATION CONTENT */}
      <nav style={{ padding: '0.75rem 1rem', flex: 1, overflowY: 'auto' }}>
        {navSections.map((section, sIdx) => {
          const SectionIcon = section.icon;
          return (
            <div key={sIdx} style={{ marginBottom: '1.25rem' }}>
              {/* Tier Section Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem 0.5rem',
                marginBottom: '0.375rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}>
                <SectionIcon size={14} style={{ color: '#60A5FA' }} />
                <span style={{
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  {section.level}
                </span>
              </div>

              {/* Tier Nav Items */}
              <ul style={{ listStyle: 'none', paddingLeft: '0.5rem' }}>
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  if (item.children) {
                    return (
                      <li key={index} style={{ marginBottom: '0.375rem' }}>
                        <div style={{
                          padding: '0.5rem 0.625rem',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#CBD5E1',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <Icon size={16} style={{ color: '#94A3B8' }} />
                          <span>{item.label}</span>
                        </div>
                        <ul style={{ listStyle: 'none', paddingLeft: '1.5rem', marginTop: '0.125rem' }}>
                          {item.children.map((child, cIdx) => (
                            <li key={cIdx} style={{ marginBottom: '0.2rem' }}>
                              <NavLink
                                to={child.to}
                                style={({ isActive }) => ({
                                  display: 'block',
                                  padding: '0.375rem 0.625rem',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.775rem',
                                  textDecoration: 'none',
                                  color: isActive ? '#FFFFFF' : '#94A3B8',
                                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
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

                  // Determine active state cleanly
                  const isItemActive = item.isCustomActive !== undefined 
                    ? item.isCustomActive 
                    : location.pathname === item.to;

                  return (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>
                      <NavLink
                        to={item.to}
                        onClick={item.onClick}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.45rem 0.625rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.8125rem',
                          textDecoration: 'none',
                          color: isItemActive ? '#FFFFFF' : '#CBD5E1',
                          backgroundColor: isItemActive ? 'var(--primary)' : 'transparent',
                          fontWeight: isItemActive ? 600 : 500,
                          transition: 'all 0.15s ease-in-out'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight size={13} style={{ opacity: 0.4 }} />
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{
        padding: '0.875rem 1.25rem',
        borderTop: '1px solid #1E293B',
        fontSize: '0.725rem',
        color: '#94A3B8',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.125rem'
      }}>
        <p style={{ fontWeight: 600, color: '#E2E8F0' }}>Govt Ministry Attendance v2.4</p>
        <p>Government Digital Solutions</p>
      </div>
    </aside>
  );
}
