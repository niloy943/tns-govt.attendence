import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardShell from './components/layout/DashboardShell';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import MinistryList from './pages/ministry/MinistryList';

// Employee Module Suite Components
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeList from './pages/employee/EmployeeList';
import EmployeeCreateWizard from './pages/employee/EmployeeCreateWizard';
import EmployeeAssignment from './pages/employee/EmployeeAssignment';
import EmployeeTransfer from './pages/employee/EmployeeTransfer';
import EmployeeStatusManager from './pages/employee/EmployeeStatusManager';
import EmployeeReports from './pages/employee/EmployeeReports';
import EmployeeChart from './pages/employee/EmployeeChart';

// Attendance Suite Components
import AttendanceDashboard from './pages/attendance/AttendanceDashboard';
import DailyAttendance from './pages/attendance/DailyAttendance';
import MonthlySummary from './pages/attendance/MonthlySummary';
import AttendanceApproval from './pages/attendance/AttendanceApproval';
import AttendanceDevices from './pages/attendance/AttendanceDevices';
import AttendanceReports from './pages/attendance/AttendanceReports';
import AttendanceIndividual from './pages/attendance/AttendanceIndividual';
import AttendanceSheet from './pages/attendance/AttendanceSheet';

import Leave from './pages/leave/Leave';
import Overtime from './pages/overtime/Overtime';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import Salary from './pages/salary/Salary';
import ConfigureSalary from './pages/salary/configure/ConfigureSalary';

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        fontSize: '1rem',
        fontWeight: 600,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTop: '4px solid #059669',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          animation: 'spin 1s linear infinite',
          marginRight: '0.75rem'
        }} />
        <span>Verifying Security Session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <DashboardShell>
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/ministry" element={<MinistryList />} />
        
        {/* Employee Module Sub-routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/list" element={<EmployeeList />} />
        <Route path="/employee/create" element={<EmployeeCreateWizard />} />
        <Route path="/employee/assignment" element={<EmployeeAssignment />} />
        <Route path="/employee/transfer" element={<EmployeeTransfer />} />
        <Route path="/employee/status" element={<EmployeeStatusManager />} />
        <Route path="/employee/reports" element={<EmployeeReports />} />
        <Route path="/employee/chart" element={<EmployeeChart />} />
        <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
        
        {/* Attendance Sub-routes */}
        <Route path="/attendance/dashboard" element={<AttendanceDashboard />} />
        <Route path="/attendance/daily" element={<DailyAttendance />} />
        <Route path="/attendance/list" element={<DailyAttendance />} />
        <Route path="/attendance/monthly" element={<MonthlySummary />} />
        <Route path="/attendance/summary" element={<MonthlySummary />} />
        <Route path="/attendance/approval" element={<AttendanceApproval />} />
        <Route path="/attendance/devices" element={<AttendanceDevices />} />
        <Route path="/attendance/reports" element={<AttendanceReports />} />
        <Route path="/attendance/individual" element={<AttendanceIndividual />} />
        <Route path="/attendance/sheet" element={<AttendanceSheet />} />
        <Route path="/attendance" element={<Navigate to="/attendance/dashboard" replace />} />
        
        {/* Leave Sub-routes */}
        <Route path="/leave/apply" element={<Leave initialTab="apply" />} />
        <Route path="/leave/history" element={<Leave initialTab="history" />} />
        <Route path="/leave" element={<Navigate to="/leave/apply" replace />} />
        
        {/* Overtime */}
        <Route path="/overtime" element={<Overtime />} />

        {/* Salary Module */}
        <Route path="/salary" element={<Salary />} />
        <Route path="/salary/configure" element={<ConfigureSalary />} />
        
        {/* Reports */}
        <Route path="/reports" element={<Reports />} />
        
        {/* Settings */}
        <Route path="/settings" element={<Settings />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardShell>
  );
}
