import React from 'react';
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Briefcase, 
  Zap, 
  BarChart3, 
  Cpu, 
  UserCheck, 
  Download, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Building2,
  Lock,
  Server
} from 'lucide-react';
import { useAttendanceSummary } from '../../hooks/useAttendance';
import StatusBadge from '../../components/shared/StatusBadge';

// Import All 5 Dynamic Chart Components
import LineChartWidget from '../../components/charts/LineChartWidget';
import BarChartWidget from '../../components/charts/BarChartWidget';
import PieChartWidget from '../../components/charts/PieChartWidget';
import StackedBarChartWidget from '../../components/charts/StackedBarChartWidget';
import AreaChartWidget from '../../components/charts/AreaChartWidget';
import GoogleCalendarWidget from '../../components/shared/GoogleCalendarWidget';

export default function AttendanceDashboard() {
  const { data: summary, isLoading } = useAttendanceSummary();

  if (isLoading) return <div style={{ height: '500px' }} className="skeleton-shimmer"></div>;

  const navigateTo = (url) => {
    window.location.href = url;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#0F172A',
        backgroundImage: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
        color: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '0.625rem', borderRadius: '0.75rem' }}>
            <Cpu size={26} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Attendance Center
            </h1>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigateTo('/attendance/daily')} className="btn btn-secondary" style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none' }}>
            📋 Daily
          </button>
          <button onClick={() => navigateTo('/attendance/monthly')} className="btn btn-primary" style={{ fontSize: '0.75rem', backgroundColor: '#059669', border: 'none' }}>
            ⚡ Monthly
          </button>
          <button onClick={() => alert("Exporting Government Attendance Log CSV Report...")} className="btn btn-secondary" style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none' }}>
            <Download size={14} /> Export Attendance
          </button>
        </div>
      </div>

      {/* 1. TOP KPI CARDS (Present, Absent, On Time, Late) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        
        {/* Present KPI */}
        <div 
          onClick={() => navigateTo('/attendance/daily?status=Present')}
          className="card-base" 
          style={{ padding: '1.25rem', borderLeft: '4px solid #10B981', cursor: 'pointer', transition: 'transform 0.15s ease' }}
          title="Click to view Present Officers in Daily Attendance"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>PRESENT KPI</span>
            <CheckCircle size={20} style={{ color: '#10B981' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', margin: 0 }}>{summary?.presentToday || 42}</h2>
          <p style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem', fontWeight: 600 }}>Punctual & Verified ➔</p>
        </div>

        {/* Absent KPI */}
        <div 
          onClick={() => navigateTo('/attendance/daily?status=Absent')}
          className="card-base" 
          style={{ padding: '1.25rem', borderLeft: '4px solid #EF4444', cursor: 'pointer', transition: 'transform 0.15s ease' }}
          title="Click to view Absent Officers in Daily Attendance"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>ABSENT KPI</span>
            <AlertCircle size={20} style={{ color: '#EF4444' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626', margin: 0 }}>{summary?.absentToday || 2}</h2>
          <p style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '0.25rem', fontWeight: 600 }}>Unexcused Absences ➔</p>
        </div>

        {/* On Time KPI */}
        <div 
          onClick={() => navigateTo('/attendance/daily?status=On%20Time')}
          className="card-base" 
          style={{ padding: '1.25rem', borderLeft: '4px solid #3B82F6', cursor: 'pointer', transition: 'transform 0.15s ease' }}
          title="Click to view On-Time Officers in Daily Attendance"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>ON TIME KPI</span>
            <UserCheck size={20} style={{ color: '#3B82F6' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', margin: 0 }}>{summary?.onTimeToday || 38}</h2>
          <p style={{ fontSize: '0.75rem', color: '#2563EB', marginTop: '0.25rem', fontWeight: 600 }}>Before 09:00 AM ➔</p>
        </div>

        {/* Late KPI */}
        <div 
          onClick={() => navigateTo('/attendance/daily?status=Late')}
          className="card-base" 
          style={{ padding: '1.25rem', borderLeft: '4px solid #F59E0B', cursor: 'pointer', transition: 'transform 0.15s ease' }}
          title="Click to view Late Arrivals in Daily Attendance"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>LATE KPI</span>
            <Clock size={20} style={{ color: '#F59E0B' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706', margin: 0 }}>{summary?.lateToday || 4}</h2>
          <p style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '0.25rem', fontWeight: 600 }}>Flagged for Review ➔</p>
        </div>
      </div>

      {/* 2. DYNAMIC VISUAL CHART SUITE GRID (Line Chart, Bar Chart, Donut Chart, Stacked Bar Chart, Area Chart) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <LineChartWidget title="Daily Punch Peak Volume Trend" />
        <BarChartWidget title="Department Attendance Comparison" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
        <PieChartWidget title="Status Distribution" />
        <StackedBarChartWidget title="Shift Breakdown" />
        <AreaChartWidget title="30-Day Punctuality Fill" />
      </div>

      {/* 3. MAIN GRID LAYOUT (Attendance Feed & Right Column Widgets) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Unified Attendance Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Attendance Feed</h3>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '0.375rem' }}>
                LIVE STREAM
              </span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Employee Code</th>
                    <th>Department</th>
                    <th>Attendance Source</th>
                    <th>Device Name</th>
                    <th>Check-in Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Tariqul Islam", code: "EMP-101", dept: "Central Secretariat", source: "Fingerprint", device: "Gate-01 Terminal", time: "08:58 AM", status: "Present" },
                    { name: "Nusrat Jahan", code: "EMP-102", dept: "Safety Net Wing", source: "Face Recognition", device: "Wing-02 Kiosk", time: "09:18 AM", status: "Late" },
                    { name: "Abul Kalam", code: "EMP-103", dept: "Finance Dept", source: "ID Card", device: "Finance Gate Reader", time: "09:00 AM", status: "Present" },
                    { name: "Farhana Yasmin", code: "EMP-104", dept: "ICT Wing", source: "QR Code", device: "Lobby Kiosk-03", time: "11:00 AM", status: "Half Day" },
                    { name: "Kabir Hossain", code: "EMP-105", dept: "Child Protection", source: "Manual", device: "Admin Desk Log", time: "09:05 AM", status: "Present" }
                  ].map((feed, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 800, color: '#0F172A' }}>
                        <span>{feed.name}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#4F46E5' }}>{feed.code}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>{feed.dept}</td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{feed.source}</span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{feed.device}</td>
                      <td style={{ fontWeight: 800, color: '#059669' }}>{feed.time}</td>
                      <td>
                        <StatusBadge status={feed.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activities Table (Following Attendance Feed Design Pattern) */}
          <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Recent Activities</h3>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4F46E5', backgroundColor: '#EEF2FF', padding: '0.2rem 0.6rem', borderRadius: '0.375rem' }}>
                ACTIVITY STREAM
              </span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Description</th>
                    <th>Module Source</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { icon: "✅", title: "Attendance Approved", desc: "Approved July 2026 Secretariat Roster", source: "Approval Engine", time: "10m ago", status: "Approved" },
                    { icon: "✏️", title: "Attendance Corrected", desc: "Nusrat Jahan check-in 08:58 AM", source: "Correction Log", time: "1h ago", status: "Active" },
                    { icon: "📲", title: "Punch Logs Imported", desc: "Gate-01 synced 42 biometric logs", source: "Biometric Terminal", time: "2h ago", status: "Present" },
                    { icon: "⚡", title: "Summary Pushed", desc: "Pushed to Payroll Module engine", source: "Payroll Sync", time: "3h ago", status: "Approved" },
                    { icon: "🖥️", title: "Terminal Active", desc: "FacialScanner Wing-2 active & online", source: "Device Manager", time: "Yesterday", status: "Online" }
                  ].map((act, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 800, color: '#0F172A' }}>
                        <span>{act.title}</span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>{act.desc}</td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{act.source}</span>
                      </td>
                      <td style={{ fontWeight: 800, color: '#059669' }}>{act.time}</td>
                      <td>
                        <StatusBadge status={act.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shift Overview Bar Chart Widget (Positioned after Attendance Feed & Recent Activities) */}
          <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#0F172A' }}>
                <Briefcase size={16} color="#059669" /> Shift Overview
              </h3>
              <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '0.15rem 0.4rem', borderRadius: '0.375rem' }}>
                BAR
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { shift: "Morning (09:00-17:00)", count: "42 Officers", percent: 85, color: "#10B981", link: "/attendance/daily?shift=Morning" },
                { shift: "Evening (14:00-22:00)", count: "8 Officers", percent: 90, color: "#3B82F6", link: "/attendance/daily?shift=Evening" },
                { shift: "Night (22:00-06:00)", count: "4 Officers", percent: 95, color: "#8B5CF6", link: "/attendance/daily?shift=Night" }
              ].map((s, idx) => (
                <div key={idx} onClick={() => navigateTo(s.link)} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{s.shift}</span>
                    <strong style={{ color: s.color }}>{s.count} ({s.percent}%)</strong>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${s.percent}%`, backgroundColor: s.color, height: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Upcoming Leaves & Google Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Upcoming Leaves */}
          <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Calendar size={16} color="#D97706" /> Upcoming Leaves
            </h3>
            <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <div 
                onClick={() => navigateTo('/leave/history')}
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                title="View Leave Application"
              >
                <span>Abul Kalam (Finance)</span><strong style={{ color: '#D97706' }}>Aug 05 - Aug 07</strong>
              </div>
              <div 
                onClick={() => navigateTo('/leave/history')}
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                title="View Leave Application"
              >
                <span>Farhana Yasmin (ICT)</span><strong style={{ color: '#D97706' }}>Aug 10 - Aug 12</strong>
              </div>
            </div>
          </div>

          {/* Google Calendar Widget (Persistent Working Days & Holidays) */}
          <GoogleCalendarWidget />
        </div>
      </div>

      {/* QUICK ACTIONS FULL-WIDTH BOTTOM ACTION TOOLBAR */}
      <div className="card-base" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', backgroundColor: '#0F172A', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Quick Actions</h3>
          <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>Operational Workflow Shortcuts</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          <button onClick={() => navigateTo('/attendance/daily')} className="btn btn-secondary" style={{ fontSize: '0.8125rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none', justifyContent: 'center' }}>
            Daily Attendance
          </button>
          <button onClick={() => navigateTo('/attendance/approval')} className="btn btn-secondary" style={{ fontSize: '0.8125rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none', justifyContent: 'center' }}>
            Attendance Approval
          </button>
          <button onClick={() => navigateTo('/attendance/monthly')} className="btn btn-secondary" style={{ fontSize: '0.8125rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none', justifyContent: 'center' }}>
            Monthly Summary
          </button>
          <button onClick={() => navigateTo('/attendance/devices')} className="btn btn-secondary" style={{ fontSize: '0.8125rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none', justifyContent: 'center' }}>
            Attendance Devices
          </button>
          <button onClick={() => navigateTo('/attendance/reports')} className="btn btn-secondary" style={{ fontSize: '0.8125rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none', justifyContent: 'center' }}>
            Attendance Reports
          </button>
          <button onClick={() => alert("Exporting Attendance Data...")} className="btn btn-primary" style={{ fontSize: '0.8125rem', backgroundColor: '#059669', border: 'none', justifyContent: 'center' }}>
            <Download size={14} /> Export Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
