import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Building2, 
  Banknote, 
  CalendarCheck, 
  UserCheck, 
  Mail, 
  Phone, 
  CreditCard, 
  FileText, 
  Clock, 
  HardDrive, 
  CheckCircle2, 
  Edit3,
  Award,
  Layers,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

export default function EmployeeDetailsDrawer({ employee, isOpen, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'govt' | 'org' | 'salary' | 'attendance' | 'account'

  if (!isOpen || !employee) return null;

  const formatBDT = (amount) => {
    return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 })
      .format(amount || 0)
      .replace('BDT', '৳');
  };

  const tabs = [
    { id: 'personal', label: '1. Personal Info', icon: User },
    { id: 'govt', label: '2. Government Info', icon: ShieldCheck },
    { id: 'org', label: '3. Organization', icon: Building2 },
    { id: 'salary', label: '4. Salary', icon: Banknote },
    { id: 'attendance', label: '5. Attendance', icon: CalendarCheck },
    { id: 'account', label: '6. Account', icon: UserCheck }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      transition: 'opacity 0.25s ease'
    }}>
      <div 
        className="animate-slide-in-right"
        style={{
          width: '100%',
          maxWidth: '680px',
          height: '100vh',
          backgroundColor: '#FFFFFF',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1E293B'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <img 
              src={employee.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
              alt={employee.name} 
              style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #059669' }} 
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#34D399', backgroundColor: 'rgba(5, 150, 105, 0.2)', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>
                  {employee.employeeCode}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8' }}>
                  {employee.govtEmployeeId || "BCS Cadre"}
                </span>
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#F8FAFC', margin: '0.15rem 0 0 0' }}>
                {employee.name}
              </h2>
              <p style={{ fontSize: '0.775rem', color: '#60A5FA', margin: 0, fontWeight: 600 }}>
                {employee.designation}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onEdit && (
              <button 
                onClick={() => { onClose(); onEdit(employee); }} 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem', backgroundColor: '#1E293B', color: '#38BDF8', borderColor: '#334155' }}
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            )}
            <button 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* 6 Tabs Navigation */}
        <div style={{
          display: 'flex',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid var(--slate-border)',
          padding: '0.5rem 1rem 0 1rem',
          gap: '0.25rem',
          overflowX: 'auto'
        }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem 0.5rem 0 0',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--slate-muted)',
                  borderBottom: isActive ? '2px solid var(--primary)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Drawer Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* SECTION 1: PERSONAL INFORMATION */}
          {activeTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid var(--slate-border)' }}>
                <img src={employee.avatar} alt={employee.name} style={{ width: '80px', height: '80px', borderRadius: '0.75rem', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>{employee.name}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0.5rem 0' }}>Official Government Officer Record</p>
                  <StatusBadge status={employee.status} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <DetailCard label="Gender" value={employee.gender || "Male"} icon={User} />
                <DetailCard label="Date of Birth" value={employee.dob || "1985-05-14"} icon={Calendar} />
                <DetailCard label="Blood Group" value={employee.bloodGroup || "O+"} icon={Award} />
                <DetailCard label="National ID (NID)" value={employee.nid || "19852691238471029"} icon={CreditCard} />
                <DetailCard label="Passport Number" value={employee.passport || "Not Issued / N/A"} icon={FileText} />
                <DetailCard label="Official Email" value={employee.email} icon={Mail} />
                <DetailCard label="Phone Number" value={employee.phone || "N/A"} icon={Phone} />
                <DetailCard label="Service Status" value={employee.serviceStatus || "Active Service"} icon={ShieldCheck} />
              </div>
            </div>
          )}

          {/* SECTION 2: GOVERNMENT INFORMATION */}
          {activeTab === 'govt' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={24} color="#059669" />
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#065F46', margin: 0 }}>Government Cadre Roster Record</h4>
                  <p style={{ fontSize: '0.75rem', color: '#047857', margin: 0 }}>Officially verified entry under Bangladesh Public Service Commission</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <DetailCard label="Employee Code" value={employee.employeeCode} icon={FileText} highlight />
                <DetailCard label="Government Employee ID" value={employee.govtEmployeeId || "BCS-849201"} icon={CreditCard} />
                <DetailCard label="Cadre / Service" value={employee.cadre || "BCS Administration Cadre"} icon={Briefcase} />
                <DetailCard label="Government Joining Date" value={employee.joiningDate || "2021-01-15"} icon={Calendar} />
                <DetailCard label="Employment Type" value={employee.employmentType || "Permanent"} icon={Layers} />
                <DetailCard label="Service Status" value={employee.serviceStatus || "Active"} icon={ShieldCheck} />
              </div>
            </div>
          )}

          {/* SECTION 3: ORGANIZATION */}
          {activeTab === 'org' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <DetailCard label="Assigned Ministry" value={employee.ministryName} icon={Building2} highlight />
                <DetailCard label="Department" value={employee.department} icon={Building2} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <DetailCard label="Wing" value={employee.wing || "Executive Wing"} icon={Layers} />
                  <DetailCard label="Section" value={employee.section || "Section-01"} icon={MapPin} />
                </div>
                <DetailCard label="Designation Title" value={employee.designation} icon={Award} />
                <DetailCard label="Reporting Superior Officer" value={employee.reportingOfficer || "Director General"} icon={User} />
              </div>
            </div>
          )}

          {/* SECTION 4: SALARY */}
          {activeTab === 'salary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1.25rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Monthly Gross Salary</p>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>
                  {formatBDT(employee.monthlySalary)}
                </h2>
                <span className="badge badge-active" style={{ fontSize: '0.75rem' }}>{employee.salaryStatus || "Regular Paid"}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <DetailCard label="National Pay Grade" value={employee.payGrade || "Grade 1"} icon={Banknote} highlight />
                <DetailCard label="Basic Salary (BDT)" value={formatBDT(employee.basicSalary || (employee.monthlySalary * 0.8))} icon={Banknote} />
                <DetailCard label="Gross Salary (BDT)" value={formatBDT(employee.monthlySalary)} icon={Banknote} />
                <DetailCard label="Payroll Disbursement Status" value={employee.salaryStatus || "Regular Paid"} icon={CheckCircle2} />
              </div>
            </div>
          )}

          {/* SECTION 5: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <DetailCard label="Attendance Source" value={employee.attendanceSource || "Biometric Device"} icon={HardDrive} />
                <DetailCard label="Assigned Device Code" value={employee.attendanceDevice || "DEV-MAIN-SECRETARIAT-01"} icon={HardDrive} highlight />
                <DetailCard label="Assigned Work Shift" value={employee.assignedShift || "General Office (09:00 AM - 05:00 PM)"} icon={Clock} />
                <DetailCard label="Today's Attendance Status" value={employee.currentAttendanceStatus || "Present"} icon={CalendarCheck} />
              </div>
            </div>
          )}

          {/* SECTION 6: ACCOUNT */}
          {activeTab === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <DetailCard label="System Access Role" value={employee.role || "Officer"} icon={UserCheck} highlight />
                <DetailCard label="Account Status" value={employee.status} icon={ShieldCheck} />
                <DetailCard label="Created By" value={employee.createdBy || "Super Admin"} icon={User} />
                <DetailCard label="Last Updated By" value={employee.updatedBy || "Super Admin"} icon={User} />
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--slate-border)', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value, icon: Icon, highlight }) {
  return (
    <div style={{
      backgroundColor: highlight ? '#ECFDF5' : '#FFFFFF',
      border: `1px solid ${highlight ? '#A7F3D0' : 'var(--slate-border)'}`,
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }}>
      {Icon && <Icon size={18} style={{ color: highlight ? '#059669' : 'var(--slate-muted)', flexShrink: 0 }} />}
      <div style={{ overflow: 'hidden' }}>
        <p style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--slate-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: highlight ? '#065F46' : 'var(--slate-text)', margin: '0.1rem 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );
}
