import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CalendarCheck, 
  FileText, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  Plus, 
  FileSpreadsheet, 
  Settings as SettingsIcon, 
  Activity, 
  UserCheck, 
  Radio,
  Sparkles,
  Zap,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMinistries } from '../hooks/useMinistries';
import { useLeaveRequests } from '../hooks/useLeave';
import { useAttendanceSummary } from '../hooks/useAttendance';
import StatusBadge from '../components/shared/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { data: ministries } = useMinistries();
  const { data: leaveRequests } = useLeaveRequests();
  const { data: attendanceSummary } = useAttendanceSummary();

  // Department-wise carousel index
  const [deptIndex, setDeptIndex] = useState(0);

  // Department attendance mock data (8 departments for 4-chart grid view)
  const departments = [
    {
      id: 1,
      name: "HR & Admin",
      totalEmployees: 18,
      presentCount: 15,
      percent: 50,
      color: "#10B981"
    },
    {
      id: 2,
      name: "Finance & Accounts",
      totalEmployees: 15,
      presentCount: 12,
      percent: 53,
      color: "#2563EB"
    },
    {
      id: 3,
      name: "Social Welfare Dept",
      totalEmployees: 42,
      presentCount: 36,
      percent: 85,
      color: "#059669"
    },
    {
      id: 4,
      name: "Women & Child Affairs",
      totalEmployees: 32,
      presentCount: 25,
      percent: 78,
      color: "#6366F1"
    },
    {
      id: 5,
      name: "ICT & Operations",
      totalEmployees: 24,
      presentCount: 22,
      percent: 92,
      color: "#06B6D4"
    },
    {
      id: 6,
      name: "PR & Communications",
      totalEmployees: 20,
      presentCount: 14,
      percent: 65,
      color: "#A855F7"
    },
    {
      id: 7,
      name: "Audit & Planning",
      totalEmployees: 28,
      presentCount: 22,
      percent: 80,
      color: "#F59E0B"
    },
    {
      id: 8,
      name: "Legal & Secretarial",
      totalEmployees: 16,
      presentCount: 14,
      percent: 88,
      color: "#EC4899"
    }
  ];

  // Attendance Feed items
  const attendanceFeed = [
    {
      id: 1,
      name: "Sayad Golam Morshed",
      deptBranch: "Education • Banani Branch (126)",
      timeAgo: "moments ago",
      timestamp: "03:55 PM",
      type: "OUT",
      method: "Face",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      name: "Golam Maula Lincoln",
      deptBranch: "HR & Admin • Banani Branch (101)",
      timeAgo: "moments ago",
      timestamp: "03:55 PM",
      type: "IN",
      method: "Fingerprint",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      name: "Golam Maula Lincoln",
      deptBranch: "HR & Admin • Paribagh (101)",
      timeAgo: "moments ago",
      timestamp: "03:50 PM",
      type: "OUT",
      method: "RFID",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      name: "Ashraful Anam Alve",
      deptBranch: "Software Department • Paribagh (116)",
      timeAgo: "moments ago",
      timestamp: "03:49 PM",
      type: "OUT",
      method: "RFID",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: 5,
      name: "Md. Kawsar Uddin",
      deptBranch: "PR & Communications • Paribagh (102)",
      timeAgo: "moments ago",
      timestamp: "03:48 PM",
      type: "IN",
      method: "Fingerprint",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80"
    }
  ];

  // Recent Activities
  const recentActivities = [
    { id: 1, text: "Leave application approved for Anisur Rahman", time: "10 mins ago", type: "approved" },
    { id: 2, text: "New Divisional Branch added: Sylhet Regional Office", time: "45 mins ago", type: "system" },
    { id: 3, text: "Biometric Terminal Sync completed for Dhaka Secretariat", time: "2 hours ago", type: "sync" },
    { id: 4, text: "Monthly Attendance Compliance Report generated", time: "4 hours ago", type: "report" }
  ];

  // Upcoming Leaves
  const upcomingLeaves = [
    { id: 101, name: "Tanvir Ahmed", dates: "Aug 05 - Aug 10", category: "Medical Leave", days: "5 days" },
    { id: 102, name: "Farhana Yasmin", dates: "Aug 12 - Aug 14", category: "Casual Leave", days: "3 days" },
    { id: 103, name: "Mustafizur Rahman", dates: "Aug 15 - Aug 25", category: "Earned Leave", days: "11 days" }
  ];

  // Shifts
  const shiftOverview = [
    { name: "Morning Shift", timing: "08:00 AM - 04:00 PM", count: 142, status: "Active" },
    { name: "Regular Day Shift", timing: "09:00 AM - 05:00 PM", count: 218, status: "Active" },
    { name: "Evening Duty", timing: "04:00 PM - 12:00 AM", count: 55, status: "Upcoming" }
  ];

  // SVG Donut Helper Component
  const DonutRing = ({ percent, color, size = 110, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', fontSize: '1.125rem', fontWeight: 800, color: '#1E293B' }}>
          {percent}%
        </div>
      </div>
    );
  };

  const handlePrevDept = () => {
    setDeptIndex((prev) => (prev === 0 ? Math.max(0, departments.length - 4) : Math.max(0, prev - 4)));
  };

  const handleNextDept = () => {
    setDeptIndex((prev) => (prev + 4 >= departments.length ? 0 : prev + 4));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Top Banner & Quick Actions Bar */}
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
              Government Attendance Intelligence
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>
            Welcome back, {currentUser.name}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '0.25rem' }}>
            {currentUser.ministryName} — Real-time Ministry Command Center
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
          <Link to="/reports" className="btn btn-secondary" style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
            <FileSpreadsheet size={16} /> Reports
          </Link>
        </div>
      </div>

      {/* Row 1: Department-wise Attendance (Left 2/3) + Attendance Feed (Right 1/3) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Department-wise Attendance Card */}
        <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-text)' }}>
                  Department-wise Attendance
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>
                  Live distribution across all departments
                </p>
              </div>

              <Link to="/attendance/summary" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                View all departments <ChevronRight size={16} />
              </Link>
            </div>

            {/* Department Carousel Slide */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
              <button
                onClick={handlePrevDept}
                className="btn btn-ghost"
                style={{ width: '36px', height: '36px', borderRadius: '9999px', padding: 0, border: '1px solid var(--slate-border)', backgroundColor: '#FFFFFF' }}
              >
                <ChevronLeft size={18} />
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', flex: 1 }}>
                {departments.slice(deptIndex, deptIndex + 4).map((dept) => (
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
                    <DonutRing percent={dept.percent} color={dept.color} size={100} strokeWidth={8} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.875rem', color: 'var(--slate-text)', lineHeight: 1.2 }}>
                      {dept.name}
                    </h3>
                    <p style={{ fontSize: '0.775rem', color: 'var(--slate-muted)', marginTop: '0.25rem' }}>
                      {dept.totalEmployees} employees - {dept.presentCount} present
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNextDept}
                className="btn btn-ghost"
                style={{ width: '36px', height: '36px', borderRadius: '9999px', padding: 0, border: '1px solid var(--slate-border)', backgroundColor: '#FFFFFF' }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Pagination Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem', marginTop: '0.75rem' }}>
              {Array.from({ length: Math.ceil(departments.length / 4) }).map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setDeptIndex(idx * 4)}
                  style={{
                    width: idx === Math.floor(deptIndex / 4) ? '1.25rem' : '0.5rem',
                    height: '0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: idx === Math.floor(deptIndex / 4) ? 'var(--primary)' : '#CBD5E1',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Color Legend Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            paddingTop: '1.25rem',
            marginTop: '1rem',
            borderTop: '1px solid var(--slate-border)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--slate-muted)'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#10B981' }} /> On Time
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#F59E0B' }} /> Late
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#EF4444' }} /> Absent
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#2563EB' }} /> On Leave
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#94A3B8' }} /> Holiday / Day Off
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#A855F7' }} /> Special Day
            </span>
          </div>
        </div>

        {/* Attendance Feed Card */}
        <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--slate-border)' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Attendance Feed</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>Device punches, most recent first</p>
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              fontSize: '0.675rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: '#10B981' }} /> LIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '380px', paddingRight: '0.25rem' }}>
            {attendanceFeed.map((item) => (
              <div key={item.id} style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--slate-border)',
                borderRadius: '0.625rem',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', overflow: 'hidden' }}>
                  <img
                    src={item.avatar}
                    alt={item.name}
                    style={{ width: '38px', height: '38px', borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--slate-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.deptBranch}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.25rem' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.375rem',
                        borderRadius: '0.25rem',
                        backgroundColor: item.type === 'IN' ? '#D1FAE5' : '#FEE2E2',
                        color: item.type === 'IN' ? '#047857' : '#B91C1C'
                      }}>
                        {item.type === 'IN' ? '↓ IN' : '↑ OUT'}
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        padding: '0.1rem 0.375rem',
                        borderRadius: '0.25rem',
                        backgroundColor: '#EEF2FF',
                        color: '#4338CA'
                      }}>
                        {item.method}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--slate-muted)' }}>{item.timeAgo}</p>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-text)', marginTop: '0.25rem' }}>{item.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Analytics Overview (Attendance Trend + Weekly Breakdown + Late vs On-Time + Monthly Rate) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Analytics Overview</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>Attendance trends, punctuality breakdowns & monthly rate</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Attendance Trend Chart */}
          <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-text)' }}>Attendance Trend (14 Days)</span>
                <TrendingUp size={18} style={{ color: 'var(--emerald)' }} />
              </div>

              {/* Simple SVG Trend Curve */}
              <div style={{ height: '100px', width: '100%', marginTop: '0.5rem' }}>
                <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 70 Q 30 40, 60 50 T 120 30 T 180 45 T 240 20 T 300 25 L 300 100 L 0 100 Z"
                    fill="url(#trendGrad)"
                  />
                  <path
                    d="M 0 70 Q 30 40, 60 50 T 120 30 T 180 45 T 240 20 T 300 25"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-border)' }}>
              <span>Avg Daily: 92.4%</span>
              <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>+3.2% vs last week</span>
            </div>
          </div>

          {/* Weekly Attendance Breakdown */}
          <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-text)' }}>Weekly Attendance</span>
              <Calendar size={18} style={{ color: 'var(--primary)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '90px', padding: '0 0.5rem' }}>
              {[
                { day: 'Sun', height: '80%', color: '#2563EB' },
                { day: 'Mon', height: '95%', color: '#2563EB' },
                { day: 'Tue', height: '88%', color: '#2563EB' },
                { day: 'Wed', height: '92%', color: '#2563EB' },
                { day: 'Thu', height: '85%', color: '#2563EB' },
                { day: 'Fri', height: '30%', color: '#94A3B8' },
                { day: 'Sat', height: '25%', color: '#94A3B8' }
              ].map((b, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', width: '12%' }}>
                  <div style={{ width: '100%', height: b.height, backgroundColor: b.color, borderRadius: '0.25rem 0.25rem 0 0' }} />
                  <span style={{ fontSize: '0.675rem', color: 'var(--slate-muted)', fontWeight: 600 }}>{b.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Late vs On-Time By Dept */}
          <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-text)' }}>Late vs On-Time By Dept</span>
              <Clock size={18} style={{ color: 'var(--amber)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0.25rem 0' }}>
              {[
                { dept: 'HR & Admin', onTime: 85, late: 15 },
                { dept: 'Social Welfare', onTime: 92, late: 8 },
                { dept: 'Women Affairs', onTime: 78, late: 22 }
              ].map((d, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <span>{d.dept}</span>
                    <span style={{ color: 'var(--slate-muted)' }}>{d.onTime}% On-Time</span>
                  </div>
                  <div style={{ display: 'flex', height: '8px', borderRadius: '9999px', overflow: 'hidden', backgroundColor: '#E2E8F0' }}>
                    <div style={{ width: `${d.onTime}%`, backgroundColor: '#10B981' }} />
                    <div style={{ width: `${d.late}%`, backgroundColor: '#F59E0B' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Attendance Rate (%) */}
          <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-text)', marginBottom: '0.75rem' }}>Monthly Attendance Rate</span>
            <DonutRing percent={94} color="#6366F1" size={100} strokeWidth={8} />
            <p style={{ fontSize: '0.75rem', color: 'var(--emerald)', fontWeight: 700, marginTop: '0.5rem' }}>
              Target Exceeded (&gt; 90%)
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Activities + Upcoming Leaves + Shift Overview + Calendar Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {/* Recent Activities */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--slate-border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Activities</h3>
            <Activity size={18} style={{ color: 'var(--primary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActivities.map((act) => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.8125rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: 'var(--primary)', marginTop: '0.375rem', flexShrink: 0 }} />
                <div>
                  <p style={{ color: 'var(--slate-text)', fontWeight: 500 }}>{act.text}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--slate-muted)' }}>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Leaves */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--slate-border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Upcoming Leaves</h3>
            <FileText size={18} style={{ color: 'var(--indigo)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcomingLeaves.map((l) => (
              <div key={l.id} style={{ padding: '0.625rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid var(--slate-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{l.name}</p>
                  <p style={{ fontSize: '0.725rem', color: 'var(--slate-muted)' }}>{l.category} • {l.dates}</p>
                </div>
                <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>{l.days}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shift Overview */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--slate-border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Shift Overview</h3>
            <Clock size={18} style={{ color: 'var(--amber)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {shiftOverview.map((s, idx) => (
              <div key={idx} style={{ padding: '0.625rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid var(--slate-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{s.name}</p>
                  <p style={{ fontSize: '0.725rem', color: 'var(--slate-muted)' }}>{s.timing}</p>
                </div>
                <span className="badge badge-active" style={{ fontSize: '0.675rem' }}>{s.count} Staff</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--slate-border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>August 2026 Calendar</h3>
            <Calendar size={18} style={{ color: 'var(--cyan)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', textAlign: 'center', fontSize: '0.75rem' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i} style={{ fontWeight: 700, color: 'var(--slate-muted)', paddingBottom: '0.25rem' }}>{d}</span>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isToday = day === 2;
              const isWeekend = day % 7 === 0 || day % 7 === 6;
              return (
                <div key={day} style={{
                  padding: '0.375rem 0',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: isToday ? 800 : 500,
                  backgroundColor: isToday ? 'var(--primary)' : isWeekend ? '#F1F5F9' : 'transparent',
                  color: isToday ? '#FFFFFF' : isWeekend ? '#94A3B8' : 'var(--slate-text)',
                }}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
