import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CalendarCheck, 
  FileText, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  Plus, 
  FileSpreadsheet, 
  UserCheck, 
  Landmark,
  Building,
  Layers,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMinistries } from '../hooks/useMinistries';
import { useLeaveRequests } from '../hooks/useLeave';
import { useAttendanceSummary } from '../hooks/useAttendance';
import StatusBadge from '../components/shared/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { dummyMinistries } from '../data/dummy/ministries';

export default function Dashboard() {
  const { 
    currentUser, 
    viewLevel, 
    setCentralView, 
    setMinistryView, 
    setDepartmentView,
    selectedMinistryId, 
    selectedDepartmentId 
  } = useAuth();

  const { data: ministries } = useMinistries();
  const { data: leaveRequests } = useLeaveRequests();
  const { data: attendanceSummary } = useAttendanceSummary();

  const selectedMinistryObj = dummyMinistries.find(m => m.id === Number(selectedMinistryId)) || dummyMinistries[0];

  const mockDepartments = [
    { id: 1, name: "HR & Admin", totalEmployees: 18, presentCount: 15, percent: 83, color: "#10B981" },
    { id: 2, name: "Finance & Accounts", totalEmployees: 15, presentCount: 12, percent: 80, color: "#2563EB" },
    { id: 3, name: "Social Welfare Dept", totalEmployees: 42, presentCount: 36, percent: 85, color: "#059669" },
    { id: 4, name: "Women & Child Affairs", totalEmployees: 32, presentCount: 25, percent: 78, color: "#6366F1" },
    { id: 5, name: "ICT & Digital Infra", totalEmployees: 28, presentCount: 22, percent: 80, color: "#F59E0B" }
  ];

  const selectedDeptObj = mockDepartments.find(d => d.id === Number(selectedDepartmentId)) || mockDepartments[0];

  // Carousel index for department charts
  const [deptIndex, setDeptIndex] = useState(0);

  const DonutRing = ({ percent, color, size = 100, strokeWidth = 8 }) => {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* HERO BANNER & LEVEL INDICATOR */}
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
              {viewLevel === 'central' && "🏛️ Central Dashboard (All Ministries)"}
              {viewLevel === 'ministry' && `🏢 ${selectedMinistryObj.name}`}
              {viewLevel === 'department' && `📊 ${selectedDeptObj.name} Department`}
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>
            Welcome back, {currentUser.name}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '0.25rem' }}>
            {viewLevel === 'central' && "Government of Bangladesh — Central Secretariat Command Center"}
            {viewLevel === 'ministry' && `${selectedMinistryObj.name} — Ministry Command Center`}
            {viewLevel === 'department' && `${selectedDeptObj.name} — Field & Branch Operations Center`}
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
          <Link to="/ministry" className="btn btn-secondary" style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
            <Building2 size={16} /> Add Branch
          </Link>
        </div>
      </div>

      {/* ================= LEVEL 1: CENTRAL DASHBOARD ================= */}
      {viewLevel === 'central' && (
        <>
          {/* Central KPI Stat Cards */}
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
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Total Gov Workforce</span>
                <Users size={20} style={{ color: '#2563EB' }} />
              </div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--slate-text)' }}>272</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>Registered Government Officers</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Today's Attendance Rate</span>
                <CalendarCheck size={20} style={{ color: '#10B981' }} />
              </div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--slate-text)' }}>86.4%</p>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>+2.4% vs last week</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Pending Secretariat Approvals</span>
                <FileText size={20} style={{ color: '#F59E0B' }} />
              </div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--slate-text)' }}>8</p>
              <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 600 }}>Requires Action</span>
            </div>
          </div>

          {/* Central Ministries Overview Table */}
          <div className="card-base" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--slate-text)' }}>
              Central Government Ministries Performance Overview
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Ministry Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Head of Office</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Officers</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Budget</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Today's Attendance</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyMinistries.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{m.name}</td>
                      <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>{m.code}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>{m.headOfOffice.name}</td>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{m.employeeCount}</td>
                      <td style={{ padding: '0.875rem 1rem', color: '#059669', fontWeight: 600 }}>{m.budgetAllocated}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.75rem' }}>
                          88.5% Present
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <button onClick={() => setMinistryView(m.id)} className="btn btn-secondary" style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}>
                          View Dashboard
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

      {/* ================= LEVEL 2: MINISTRY DASHBOARD ================= */}
      {viewLevel === 'ministry' && (
        <>
          {/* Ministry Overview KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="card-base" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Selected Ministry</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--primary)' }}>{selectedMinistryObj.name}</p>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Code: {selectedMinistryObj.code}</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Ministry Staff</span>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--slate-text)' }}>{selectedMinistryObj.employeeCount}</p>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Active Officers</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Annual Budget</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem', color: '#059669' }}>{selectedMinistryObj.budgetAllocated}</p>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Secretariat Allocation</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Head of Office</span>
              <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--slate-text)' }}>{selectedMinistryObj.headOfOffice.name}</p>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{selectedMinistryObj.headOfOffice.title}</span>
            </div>
          </div>

          {/* Department-wise Attendance Grid */}
          <div className="card-base" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--slate-text)' }}>
              {selectedMinistryObj.name} — Department Attendance Breakdown
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {mockDepartments.map((dept) => (
                <div key={dept.id} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.75rem', padding: '1.25rem 1rem', textAlign: 'center' }}>
                  <DonutRing percent={dept.percent} color={dept.color} size={90} strokeWidth={7} />
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginTop: '0.75rem' }}>{dept.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>{dept.presentCount} of {dept.totalEmployees} Present</p>
                  <button onClick={() => setDepartmentView(dept.id)} className="btn btn-ghost" style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--primary)' }}>
                    Open Dept Dashboard →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ================= LEVEL 3: DEPARTMENT DASHBOARD ================= */}
      {viewLevel === 'department' && (
        <>
          {/* Department KPI Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="card-base" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Active Department</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--primary)' }}>{selectedDeptObj.name}</p>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Ministry: {selectedMinistryObj.name}</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Department Officers</span>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--slate-text)' }}>{selectedDeptObj.totalEmployees}</p>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>100% Roster Strength</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>Present Today</span>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: '#10B981' }}>{selectedDeptObj.presentCount}</p>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>{selectedDeptObj.percent}% Compliance</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>On Leave / Absent</span>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: '#EF4444' }}>{selectedDeptObj.totalEmployees - selectedDeptObj.presentCount}</p>
              <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 600 }}>Approved Absences</span>
            </div>
          </div>

          {/* Department Officers Roster Table */}
          <div className="card-base" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--slate-text)' }}>
              {selectedDeptObj.name} — Department Officers Today's Attendance Log
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Officer Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Designation</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Shift Timing</th>
                    <th style={{ padding: '0.75rem 1rem' }}>In Time</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Verification Method</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Tariqul Islam</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Senior Assistant Secretary</td>
                    <td style={{ padding: '0.875rem 1rem' }}>09:00 AM - 05:00 PM</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#10B981', fontWeight: 600 }}>08:52 AM</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Face Recognition (VIP Portal)</td>
                    <td style={{ padding: '0.875rem 1rem' }}><span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.75rem' }}>PRESENT</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Shaila Sharmin Zaman</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Director General</td>
                    <td style={{ padding: '0.875rem 1rem' }}>09:00 AM - 05:00 PM</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#10B981', fontWeight: 600 }}>08:45 AM</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Biometric Palm Scanner</td>
                    <td style={{ padding: '0.875rem 1rem' }}><span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.75rem' }}>PRESENT</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Anisur Rahman</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Senior Executive Officer</td>
                    <td style={{ padding: '0.875rem 1rem' }}>09:00 AM - 05:00 PM</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>—</td>
                    <td style={{ padding: '0.875rem 1rem' }}>Casual Leave Approved</td>
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
