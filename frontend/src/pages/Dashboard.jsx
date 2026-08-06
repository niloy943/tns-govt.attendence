import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CalendarCheck, 
  FileText, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  FileSpreadsheet, 
  UserCheck, 
  Landmark,
  Building,
  Layers,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMinistries } from '../hooks/useMinistries';
import { useLeaveRequests } from '../hooks/useLeave';
import { useAttendanceSummary } from '../hooks/useAttendance';
import StatusBadge from '../components/shared/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useCurrentMinistry } from '../hooks/useCurrentMinistry';

export default function Dashboard() {
  const { 
    currentUser, 
    viewLevel, 
    setCentralView, 
    setMinistryView, 
    selectedMinistryId, 
    setSelectedMinistryId 
  } = useAuth();

  const { data: ministries } = useMinistries();
  const { data: leaveRequests } = useLeaveRequests();
  const { data: attendanceSummary } = useAttendanceSummary();
  const { currentMinistry, ministries: ministryList, getMinistryById } = useCurrentMinistry();

  const selectedMinistryObj = currentMinistry || (ministryList[0] ?? {});

  const mockDepartments = [
    { id: 1, name: "HR & Admin", totalEmployees: 18, presentCount: 15, percent: 83, color: "#10B981" },
    { id: 2, name: "Finance & Accounts", totalEmployees: 15, presentCount: 12, percent: 80, color: "#2563EB" },
    { id: 3, name: "Social Welfare Dept", totalEmployees: 42, presentCount: 36, percent: 85, color: "#059669" },
    { id: 4, name: "Women & Child Affairs", totalEmployees: 32, presentCount: 25, percent: 78, color: "#6366F1" },
    { id: 5, name: "ICT & Digital Infra", totalEmployees: 28, presentCount: 22, percent: 80, color: "#F59E0B" }
  ];

  // Carousel index for department charts inside Ministry Dashboard
  const [deptIndex, setDeptIndex] = useState(0);

  const handlePrevDept = () => {
    setDeptIndex((prev) => Math.max(0, prev - 4));
  };

  const handleNextDept = () => {
    setDeptIndex((prev) => (prev + 4 >= mockDepartments.length ? 0 : prev + 4));
  };

  const DonutRing = ({ percent, color, size = 90, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E2E8F0" strokeWidth={strokeWidth} fill="none" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
        </svg>
        <div style={{ position: 'absolute', fontSize: '1.125rem', fontWeight: 800, color: '#1E293B' }}>
          {percent}%
        </div>
      </div>
    );
  };

  const isCentral = viewLevel === 'central' || selectedMinistryId === 'all';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* HERO BANNER */}
      <div className="card-base" style={{
        padding: '1.5rem 1.75rem',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <span style={{
              backgroundColor: 'rgba(37, 99, 235, 0.3)',
              color: '#93C5FD',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.625rem',
              borderRadius: '9999px',
              border: '1px solid rgba(147, 197, 253, 0.3)'
            }}>
              {isCentral ? "🏛️ Central Dashboard (All Ministries)" : `🏢 ${selectedMinistryObj.name}`}
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>
            Welcome back, {currentUser.name}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '0.25rem' }}>
            {isCentral 
              ? "Government of Bangladesh — Central Secretariat Command Center" 
              : `${selectedMinistryObj.name} — Department-Wise Ministry Command Center`}
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/attendance/list" className="btn btn-primary" style={{ textDecoration: 'none', gap: '0.375rem' }}>
            <UserCheck size={16} /> Mark Attendance
          </Link>
          <Link to="/leave" className="btn btn-secondary" style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
            <Plus size={16} /> Apply Leave
          </Link>
          <Link to="/reports" className="btn btn-secondary" style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
            <FileSpreadsheet size={16} /> Reports
          </Link>
        </div>
      </div>

      {/* ================= MODE 1: CENTRAL DASHBOARD (OVERVIEW OF ALL MINISTRIES) ================= */}
      {isCentral && (
        <>
          {/* Central Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="card-base" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Total Ministries</span>
                <Landmark size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--slate-text)' }}>5</p>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Active Ministries & Secretariats</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Total Gov Officers</span>
                <Users size={20} style={{ color: '#2563EB' }} />
              </div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--slate-text)' }}>272</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>Registered Government Personnel</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Nationwide Attendance</span>
                <CalendarCheck size={20} style={{ color: '#10B981' }} />
              </div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--slate-text)' }}>86.4%</p>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>+2.4% vs last week</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Pending Approvals</span>
                <FileText size={20} style={{ color: '#F59E0B' }} />
              </div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--slate-text)' }}>8</p>
              <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 600 }}>Secretariat Level</span>
            </div>
          </div>

          {/* All Ministries Table Overview */}
          <div className="card-base" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--slate-text)' }}>
                All Ministries & Secretariats Overview
              </h2>
              <Link to="/ministry" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
                View All Details →
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Ministry Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Head of Office</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Officers</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Attendance Rate</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ministryList.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{m.name}</td>
                      <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>{m.code}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>{m.headOfOffice.name}</td>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{m.employeeCount}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.75rem' }}>
                          88.5% Present
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <button onClick={() => setMinistryView(m.id)} className="btn btn-secondary" style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}>
                          Open Ministry Dashboard
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ================= MODE 2: MINISTRY DASHBOARD (ORGANIZED DEPARTMENT-WISE) ================= */}
      {!isCentral && (
        <>
          {/* Ministry KPI Header Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="card-base" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Selected Ministry</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--primary)' }}>{selectedMinistryObj.name}</p>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Code: {selectedMinistryObj.code}</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Total Departments</span>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--slate-text)' }}>5</p>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Department-Wise Tracking</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Ministry Officers</span>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: '#2563EB' }}>{selectedMinistryObj.employeeCount}</p>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Active Roster Strength</span>
            </div>
          </div>

          {/* Department-Wise Attendance Charts Grid */}
          <div className="card-base" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-text)' }}>
                  {selectedMinistryObj.name} — Department-Wise Attendance Distribution
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>
                  Live metrics organized department-wise across the ministry
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
              {mockDepartments.map((dept) => (
                <div key={dept.id} style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid var(--slate-border)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <DonutRing percent={dept.percent} color={dept.color} size={90} strokeWidth={8} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.875rem', color: 'var(--slate-text)', lineHeight: 1.2 }}>
                    {dept.name}
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--slate-muted)', marginTop: '0.25rem' }}>
                    {dept.totalEmployees} officers — {dept.presentCount} present
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Department-Wise Detailed Personnel Attendance Log Table */}
          <div className="card-base" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--slate-text)' }}>
              {selectedMinistryObj.name} — Department Officers Attendance Log
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Officer Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Department</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Designation</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Shift Timing</th>
                    <th style={{ padding: '0.75rem 1rem' }}>In Time</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Method</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Tariqul Islam</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--primary)', fontWeight: 600 }}>HR & Admin</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Senior Assistant Secretary</td>
                    <td style={{ padding: '0.875rem 1rem' }}>09:00 AM - 05:00 PM</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#10B981', fontWeight: 600 }}>08:52 AM</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Face Recognition</td>
                    <td style={{ padding: '0.875rem 1rem' }}><span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.75rem' }}>PRESENT</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Shaila Sharmin Zaman</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--primary)', fontWeight: 600 }}>Finance & Accounts</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Director General</td>
                    <td style={{ padding: '0.875rem 1rem' }}>09:00 AM - 05:00 PM</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#10B981', fontWeight: 600 }}>08:45 AM</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Biometric Palm Scanner</td>
                    <td style={{ padding: '0.875rem 1rem' }}><span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.75rem' }}>PRESENT</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Anisur Rahman</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--primary)', fontWeight: 600 }}>Social Welfare Dept</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Senior Executive Officer</td>
                    <td style={{ padding: '0.875rem 1rem' }}>09:00 AM - 05:00 PM</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>—</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Approved Casual Leave</td>
                    <td style={{ padding: '0.875rem 1rem' }}><span style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.75rem' }}>ON LEAVE</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
