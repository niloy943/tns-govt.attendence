import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardShell from "./components/layout/DashboardShell";

import Dashboard from "./pages/Dashboard";
import MinistryList from "./pages/ministry/MinistryList";

// Employee Module Suite Components
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeList from "./pages/employee/EmployeeList";
import EmployeeCreateWizard from "./pages/employee/EmployeeCreateWizard";

// Attendance Suite Components
import AttendanceDashboard from "./pages/attendance/AttendanceDashboard";
import DailyAttendance from "./pages/attendance/DailyAttendance";
import MonthlySummary from "./pages/attendance/MonthlySummary";
import AttendanceApproval from "./pages/attendance/AttendanceApproval";
import AttendanceDevices from "./pages/attendance/AttendanceDevices";
import AttendanceReports from "./pages/attendance/AttendanceReports";
import AttendanceIndividual from "./pages/attendance/AttendanceIndividual";
import AttendanceSheet from "./pages/attendance/AttendanceSheet";

import Leave from "./pages/leave/Leave";
import Overtime from "./pages/overtime/Overtime";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/settings/Settings";
import Salary from "./pages/salary/Salary";
import ConfigureSalary from "./pages/salary/configure/ConfigureSalary";

export default function App() {
  return (
    <DashboardShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ministry" element={<MinistryList />} />

        {/* Employee Module Sub-routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/list" element={<EmployeeList />} />
        <Route path="/employee/create" element={<EmployeeCreateWizard />} />
        <Route
          path="/employee"
          element={<Navigate to="/employee/dashboard" replace />}
        />

        {/* Attendance Sub-routes */}
        <Route path="/attendance/dashboard" element={<AttendanceDashboard />} />
        <Route path="/attendance/daily" element={<DailyAttendance />} />
        <Route path="/attendance/list" element={<DailyAttendance />} />
        <Route path="/attendance/monthly" element={<MonthlySummary />} />
        <Route path="/attendance/summary" element={<MonthlySummary />} />
        <Route path="/attendance/approval" element={<AttendanceApproval />} />
        <Route path="/attendance/devices" element={<AttendanceDevices />} />
        <Route path="/attendance/reports" element={<AttendanceReports />} />
        <Route
          path="/attendance/individual"
          element={<AttendanceIndividual />}
        />
        <Route path="/attendance/sheet" element={<AttendanceSheet />} />
        <Route
          path="/attendance"
          element={<Navigate to="/attendance/dashboard" replace />}
        />

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
