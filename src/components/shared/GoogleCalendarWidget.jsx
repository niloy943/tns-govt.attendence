import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Bookmark } from 'lucide-react';

export default function GoogleCalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  // Government Calendar Highlights
  const holidays = [15]; // Aug 15: National Mourning Day
  const auditEvents = [20]; // Aug 20: Audit Sync
  const payrollEvents = [25]; // Aug 25: Payroll Push

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysArray = [];
  for (let i = 0; i < startDay; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  return (
    <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      
      {/* Calendar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={18} color="#4F46E5" />
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {monthNames[month]} {year}
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button onClick={prevMonth} className="btn btn-ghost" style={{ padding: '0.2rem 0.4rem' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="btn btn-ghost" style={{ padding: '0.2rem 0.4rem' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.7rem', fontWeight: 800, color: 'var(--slate-muted)' }}>
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>

      {/* Grid Days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', textAlign: 'center', fontSize: '0.75rem' }}>
        {daysArray.map((day, idx) => {
          if (!day) return <div key={idx} />;

          const isHoliday = holidays.includes(day);
          const isAuditEvent = auditEvents.includes(day);
          const isPayrollEvent = payrollEvents.includes(day);

          let bgColor = '#F8FAFC';
          let textColor = '#0F172A';
          let border = '1px solid transparent';

          if (isHoliday) {
            bgColor = '#FEE2E2';
            textColor = '#DC2626';
            border = '1px solid #FCA5A5';
          } else if (isPayrollEvent) {
            bgColor = '#ECFDF5';
            textColor = '#059669';
            border = '1px solid #A7F3D0';
          } else if (isAuditEvent) {
            bgColor = '#EEF2FF';
            textColor = '#4F46E5';
            border = '1px solid #C7D2FE';
          }

          return (
            <div
              key={idx}
              style={{
                padding: '0.35rem 0',
                borderRadius: '0.375rem',
                backgroundColor: bgColor,
                color: textColor,
                border: border,
                fontWeight: 700,
                cursor: 'pointer',
                position: 'relative'
              }}
              title={
                isHoliday ? `Aug ${day}: National Mourning Day (Govt Holiday)` :
                isPayrollEvent ? `Aug ${day}: Monthly Payroll Push` :
                isAuditEvent ? `Aug ${day}: Monthly Attendance Audit` :
                `Aug ${day}: Working Day (26 Working Days Schedule)`
              }
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend & Working Days Summary */}
      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.725rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#0F172A' }}>
          <span>Working Days:</span>
          <span style={{ color: '#059669' }}>26 Days / Month</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.7rem' }}>
          <span style={{ color: '#DC2626', fontWeight: 700 }}>🔴 Govt Holiday</span>
          <span style={{ color: '#059669', fontWeight: 700 }}>🟢 Payroll Push</span>
        </div>
      </div>

    </div>
  );
}
