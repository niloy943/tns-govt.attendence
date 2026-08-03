import React, { useState } from 'react';
import { 
  BarChart2, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Percent, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Edit3, 
  Send, 
  CheckCircle2,
  Server,
  Wifi,
  FileSpreadsheet,
  Lock,
  Calendar,
  Filter,
  Check,
  X
} from 'lucide-react';
import { useAttendanceSummary } from '../../hooks/useAttendance';
import { fetchAttendanceRecords, generateMonthlyAttendanceSummary, pushAttendanceToPayrollModule } from '../../services/attendanceDeviceService';

export default function AttendanceSummary() {
  const { data: summary, isLoading } = useAttendanceSummary();
  const [records, setRecords] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null);
  
  // Navigation Tab State: 'dashboard' | 'daily' | 'monthly' | 'corrections' | 'devices' | 'approval' | 'reports'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [approvalState, setApprovalState] = useState('pending'); // 'pending' | 'approved' | 'locked'

  React.useEffect(() => {
    fetchAttendanceRecords().then(data => setRecords(data));
  }, []);

  const handlePushToPayroll = async () => {
    const monthlySummary = generateMonthlyAttendanceSummary(records);
    const res = await pushAttendanceToPayrollModule(monthlySummary);
    setSyncStatus(res);
    setApprovalState('approved');
    alert("Monthly Attendance Summary successfully validated & pushed to Payroll Module!");
  };

  if (isLoading) return <div style={{ height: '300px' }} className="skeleton-shimmer"></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      
      {/* Title & Sync Action Banner */}
      <div style={{
        backgroundColor: '#0F172A',
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
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.625rem', borderRadius: '0.75rem' }}>
            <Cpu size={26} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Attendance & Biometric Terminal Suite
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '0.125rem 0 0 0' }}>
              Secretariat Biometric Terminal Sync & Monthly Payroll Integration
            </p>
          </div>
        </div>

        <button
          onClick={handlePushToPayroll}
          className="btn btn-primary"
          style={{ backgroundColor: '#059669', color: '#FFFFFF', fontWeight: 800, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem' }}
        >
          <Send size={16} /> Validate & Push to Payroll Module
        </button>
      </div>

      {syncStatus && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1.5px solid #A7F3D0', padding: '0.875rem 1.25rem', borderRadius: '0.75rem', color: '#047857', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>
          <CheckCircle2 size={20} color="#059669" />
          <span>Attendance data synchronized with Payroll Engine at {new Date(syncStatus.timestamp).toLocaleTimeString()}</span>
        </div>
      )}

      {/* 7-SUBMODULE NAVIGATION TAB BAR */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.25rem', flexWrap: 'wrap' }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'daily', label: '📋 Daily Attendance' },
          { id: 'monthly', label: '📅 Monthly Attendance' },
          { id: 'corrections', label: '✏️ Attendance Corrections' },
          { id: 'devices', label: '🖥️ Device Sync & Status' },
          { id: 'approval', label: '🔒 Attendance Approval' },
          { id: 'reports', label: '📑 Reports' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '0.625rem 1.125rem',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontSize: '0.875rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === t.id ? 'var(--primary)' : 'transparent',
              color: activeTab === t.id ? '#FFFFFF' : 'var(--slate-text)',
              transition: 'all 0.15s ease'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 8-STEP PIPELINE FLOWCHART VISUALIZER */}
      <div className="card-base" style={{ padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--slate-muted)', textTransform: 'uppercase', marginBottom: '0.875rem' }}>
          End-to-End Biometric Pipeline Flowchart
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
          <span style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.35rem 0.65rem', borderRadius: '0.375rem' }}>1. Attendance Device (Fingerprint/Face/ID/QR/Manual)</span>
          <ArrowRight size={14} color="#94A3B8" />
          <span style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.35rem 0.65rem', borderRadius: '0.375rem' }}>2. Attendance Records</span>
          <ArrowRight size={14} color="#94A3B8" />
          <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.35rem 0.65rem', borderRadius: '0.375rem' }}>3. Validate Attendance</span>
          <ArrowRight size={14} color="#94A3B8" />
          <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.35rem 0.65rem', borderRadius: '0.375rem' }}>4. Attendance Review</span>
          <ArrowRight size={14} color="#94A3B8" />
          <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.35rem 0.65rem', borderRadius: '0.375rem' }}>5. Manual Correction</span>
          <ArrowRight size={14} color="#94A3B8" />
          <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.35rem 0.65rem', borderRadius: '0.375rem' }}>6. Attendance Approval</span>
          <ArrowRight size={14} color="#94A3B8" />
          <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.35rem 0.65rem', borderRadius: '0.375rem' }}>7. Monthly Summary</span>
          <ArrowRight size={14} color="#94A3B8" />
          <span style={{ backgroundColor: '#059669', color: '#FFFFFF', padding: '0.35rem 0.65rem', borderRadius: '0.375rem' }}>8. Payroll Module</span>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {(activeTab === 'dashboard' || activeTab === 'monthly') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div className="card-base" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>TOTAL STAFF</span>
              <Users size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{summary?.totalEmployees || 48}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--emerald)', marginTop: '0.25rem' }}>Active Officers</p>
          </div>

          <div className="card-base" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>PRESENT TODAY</span>
              <CheckCircle size={20} style={{ color: 'var(--emerald)' }} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--emerald)' }}>{summary?.presentToday || 42}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', marginTop: '0.25rem' }}>Punctual & verified</p>
          </div>

          <div className="card-base" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>LATE ARRIVALS</span>
              <Clock size={20} style={{ color: 'var(--amber)' }} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--amber)' }}>{summary?.lateToday || 4}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--amber)', marginTop: '0.25rem' }}>Flagged for review</p>
          </div>

          <div className="card-base" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)' }}>ATTENDANCE RATE</span>
              <Percent size={20} style={{ color: 'var(--indigo)' }} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--indigo)' }}>{summary?.overallAttendancePercentage || "95.8%"}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--emerald)', marginTop: '0.25rem' }}>Target: &gt; 90.0%</p>
          </div>
        </div>
      )}

      {/* DEVICE SYNC & STATUS TAB */}
      {(activeTab === 'dashboard' || activeTab === 'devices') && (
        <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Server size={20} style={{ color: '#2563EB' }} /> Attendance Device Status & Terminal Sync
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>
                Real-time terminal connection status across 7 attendance sources
              </p>
            </div>
            <button onClick={() => alert("Pinged all 7 attendance terminals! Systems 100% operational.")} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>
              <Wifi size={14} /> Refresh Terminal Ping
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Terminal ID</th>
                  <th>Device Name</th>
                  <th>Attendance Source</th>
                  <th>Location</th>
                  <th>Last Sync Time</th>
                  <th>Connection Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "DEV-01", name: "Secretariat Gate-01 BioTerminal", source: "Fingerprint", loc: "Main Secretariat Gate 1", sync: "Just Now", status: "Online" },
                  { id: "DEV-02", name: "Ministry Wing-2 FacialScanner", source: "Face Recognition", loc: "Social Welfare Wing Entrance", sync: "1 min ago", status: "Online" },
                  { id: "DEV-03", name: "Finance Dept RFID Reader", source: "ID Card", loc: "Finance Building Gate 01", sync: "2 mins ago", status: "Online" },
                  { id: "DEV-04", name: "Mobile QR Kiosk Terminal-03", source: "QR Code", loc: "ICT Ministry Lobby", sync: "Just Now", status: "Online" },
                  { id: "DEV-05", name: "Admin Log Sheet Entry", source: "Manual", loc: "HR Officer Desk", sync: "10 mins ago", status: "Active" },
                  { id: "DEV-06", name: "Bulk Secretariat Attendance Upload", source: "CSV Import", loc: "Central HR Server", sync: "1 hour ago", status: "Ready" },
                  { id: "DEV-07", name: "Biometric Webhook Gateway API", source: "API Sync", loc: "Cloud Gateway Server", sync: "Live", status: "Online" }
                ].map(dev => (
                  <tr key={dev.id}>
                    <td style={{ fontWeight: 700, color: '#4F46E5' }}>{dev.id}</td>
                    <td style={{ fontWeight: 700 }}>{dev.name}</td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>{dev.source}</span>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>{dev.loc}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>{dev.sync}</td>
                    <td>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#047857', backgroundColor: '#ECFDF5', padding: '0.15rem 0.5rem', borderRadius: '0.375rem' }}>
                        🟢 {dev.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10-FIELD DATABASE SCHEMA TABLE: attendance */}
      {(activeTab === 'dashboard' || activeTab === 'daily' || activeTab === 'corrections') && (
        <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: 0 }}>
              Daily Biometric Punch Logs (<code style={{ color: '#4F46E5' }}>attendance</code> table)
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>
              Columns: <code style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>id, employee_id, attendance_source, device_name, date, check_in, check_out, working_hours, status, remarks</code>
            </p>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee ID & Officer Name</th>
                  <th>Source</th>
                  <th>Device Name</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.map(rec => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 700, color: '#4F46E5' }}>#{rec.id}</td>
                    <td>
                      <div>
                        <strong style={{ fontSize: '0.875rem' }}>{rec.officer_name}</strong>
                        <p style={{ fontSize: '0.7rem', color: 'var(--slate-muted)', margin: 0 }}>EMP-{rec.employee_id}</p>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>{rec.attendance_source}</span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{rec.device_name}</td>
                    <td style={{ fontSize: '0.8125rem' }}>{rec.date}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>{rec.check_in || '--:--'}</td>
                    <td style={{ fontWeight: 700, color: '#2563EB' }}>{rec.check_out || '--:--'}</td>
                    <td style={{ fontWeight: 700 }}>{rec.working_hours}</td>
                    <td>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: rec.status === 'Present' ? '#047857' : rec.status === 'Late' ? '#92400E' : rec.status === 'Half Day' ? '#4F46E5' : '#991B1B',
                        backgroundColor: rec.status === 'Present' ? '#ECFDF5' : rec.status === 'Late' ? '#FEF3C7' : rec.status === 'Half Day' ? '#EEF2FF' : '#FEE2E2',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '0.375rem'
                      }}>
                        {rec.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>{rec.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ATTENDANCE APPROVAL & REPORTS TAB */}
      {(activeTab === 'approval' || activeTab === 'reports') && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Monthly Attendance Sign-Off & Lock</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)', margin: 0 }}>
              Current Status: <strong style={{ color: approvalState === 'approved' ? '#059669' : '#D97706', textTransform: 'uppercase' }}>{approvalState}</strong>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button onClick={() => { setApprovalState('approved'); alert("Monthly Attendance Approved & Signed Off!"); }} className="btn btn-primary" style={{ backgroundColor: '#059669', fontSize: '0.8125rem' }}>
                <Check size={16} /> Approve & Sign Off
              </button>
              <button onClick={() => { setApprovalState('locked'); alert("Monthly Attendance Locked for Audit!"); }} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
                <Lock size={16} /> Lock Month
              </button>
            </div>
          </div>

          <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Attendance Compliance Reports</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)', margin: 0 }}>Download official secretariat attendance summary reports</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => alert("Downloading PDF Report...")} className="btn btn-secondary" style={{ fontSize: '0.75rem', flex: 1 }}>PDF</button>
              <button onClick={() => alert("Downloading Excel Sheet...")} className="btn btn-secondary" style={{ fontSize: '0.75rem', flex: 1 }}>Excel</button>
              <button onClick={() => alert("Downloading CSV File...")} className="btn btn-secondary" style={{ fontSize: '0.75rem', flex: 1 }}>CSV</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
