import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardShell from './components/layout/DashboardShell';

import Dashboard from './pages/Dashboard';
import MinistryList from './pages/ministry/MinistryList';
import EmployeeList from './pages/employee/EmployeeList';
import EmployeeCreate from './pages/employee/EmployeeCreate';
import EmployeeChart from './pages/employee/EmployeeChart';
import AttendanceList from './pages/attendance/AttendanceList';
import AttendanceIndividual from './pages/attendance/AttendanceIndividual';
import AttendanceSummary from './pages/attendance/AttendanceSummary';
import AttendanceSheet from './pages/attendance/AttendanceSheet';
import Leave from './pages/leave/Leave';
import Overtime from './pages/overtime/Overtime';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

export default function App() {
  return (
    <DashboardShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ministry" element={<MinistryList />} />
        
        {/* Employee Sub-routes */}
        <Route path="/employee/list" element={<EmployeeList />} />
        <Route path="/employee/create" element={<EmployeeCreate />} />
        <Route path="/employee/chart" element={<EmployeeChart />} />
        <Route path="/employee" element={<Navigate to="/employee/list" replace />} />
        
        {/* Attendance Sub-routes */}
        <Route path="/attendance/list" element={<AttendanceList />} />
        <Route path="/attendance/individual" element={<AttendanceIndividual />} />
        <Route path="/attendance/summary" element={<AttendanceSummary />} />
        <Route path="/attendance/sheet" element={<AttendanceSheet />} />
        <Route path="/attendance" element={<Navigate to="/attendance/list" replace />} />
        
        {/* Leave */}
        <Route path="/leave" element={<Leave />} />
        
        {/* Overtime */}
        <Route path="/overtime" element={<Overtime />} />
        
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
