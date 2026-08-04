/**
 * AttendanceDeviceService.js
 * 
 * Government Biometric Attendance to Payroll Processing Pipeline
 * 
 * Database Schema: attendance
 *   ├── id
 *   ├── employee_id
 *   ├── attendance_source (Fingerprint / Face / ID Card / QR / Manual)
 *   ├── device_name
 *   ├── date
 *   ├── check_in
 *   ├── check_out
 *   ├── working_hours
 *   ├── status
 *   └── remarks
 * 
 * Pipeline Flowchart:
 * Attendance Device ➔ Attendance Records ➔ Validate Attendance ➔ Attendance Review ➔ Manual Correction ➔ Attendance Approval ➔ Monthly Summary ➔ Payroll Module
 */

export async function fetchAttendanceRecords() {
  return [
    {
      id: 1,
      employee_id: 1,
      officer_name: "Tariqul Islam",
      attendance_source: "Fingerprint",
      device_name: "Secretariat Gate-01 BioTerminal",
      date: "2026-08-03",
      check_in: "08:55 AM",
      check_out: "05:05 PM",
      working_hours: "8.17 hrs",
      status: "Present",
      remarks: "Punctual check-in verified"
    },
    {
      id: 2,
      employee_id: 2,
      officer_name: "Nusrat Jahan",
      attendance_source: "Face",
      device_name: "Ministry Wing-2 FacialScanner",
      date: "2026-08-03",
      check_in: "09:22 AM",
      check_out: "05:00 PM",
      working_hours: "7.63 hrs",
      status: "Late",
      remarks: "Traffic delay reported"
    },
    {
      id: 3,
      employee_id: 3,
      officer_name: "Abul Kalam",
      attendance_source: "ID Card",
      device_name: "Finance Dept RFID Reader",
      date: "2026-08-03",
      check_in: "09:00 AM",
      check_out: "05:10 PM",
      working_hours: "8.17 hrs",
      status: "Present",
      remarks: "Regular shift"
    },
    {
      id: 4,
      employee_id: 4,
      officer_name: "Farhana Yasmin",
      attendance_source: "QR",
      device_name: "Mobile QR Kiosk Terminal-03",
      date: "2026-08-03",
      check_in: "11:15 AM",
      check_out: "05:00 PM",
      working_hours: "5.75 hrs",
      status: "Half Day",
      remarks: "Morning medical permission approved"
    },
    {
      id: 5,
      employee_id: 5,
      officer_name: "Kabir Hossain",
      attendance_source: "Manual",
      device_name: "Admin Log Sheet Entry",
      date: "2026-08-03",
      check_in: null,
      check_out: null,
      working_hours: "0.00 hrs",
      status: "Absent",
      remarks: "Unauthorized absence"
    }
  ];
}

// Validate Attendance Record
export function validateAttendanceRecord(record) {
  if (!record.check_in) {
    return { ...record, isValid: false, validation_msg: "Missing Check-in Punch" };
  }
  if (record.status === "Late") {
    return { ...record, isValid: true, validation_msg: "Late Arrival (>15 mins)" };
  }
  return { ...record, isValid: true, validation_msg: "Compliant" };
}

// Manual Correction Action
export function executeManualCorrection(id, updatedFields) {
  return {
    success: true,
    id,
    updated_at: new Date().toISOString(),
    ...updatedFields
  };
}

// Monthly Attendance Summary Aggregation
export function generateMonthlyAttendanceSummary(records) {
  return {
    total_records: records.length,
    present: records.filter(r => r.status === 'Present').length,
    late: records.filter(r => r.status === 'Late').length,
    absent: records.filter(r => r.status === 'Absent').length,
    half_day: records.filter(r => r.status === 'Half Day').length,
    status: 'Approved & Signed Off',
    approved_by: 'Super Admin (Tariqul Islam)',
    approved_at: new Date().toISOString()
  };
}

// Transfer Approved Attendance to Payroll Module
export async function pushAttendanceToPayrollModule(summary) {
  return {
    success: true,
    sync_status: 'Pushed to Payroll Engine',
    timestamp: new Date().toISOString(),
    summary
  };
}
