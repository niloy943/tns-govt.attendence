export const dummyAttendanceList = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Shaila Sharmin Zaman",
    employeeCode: "EMP-001",
    ministryName: "Department of Women Affairs",
    date: "2026-08-02",
    checkIn: "08:50 AM",
    checkOut: "05:15 PM",
    status: "present",
    workHours: "8h 25m",
    overtimeHours: "0h 15m",
    device: "Biometric Main Gate - Sec 1"
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Naima Hossain",
    employeeCode: "EMP-002",
    ministryName: "Department of Women Affairs",
    date: "2026-08-02",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    status: "present",
    workHours: "8h 00m",
    overtimeHours: "0h 0m",
    device: "Biometric Main Gate - Sec 1"
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Md. Monir Hossain",
    employeeCode: "EMP-003",
    ministryName: "Department of Women Affairs",
    date: "2026-08-02",
    checkIn: "09:12 AM",
    checkOut: "05:30 PM",
    status: "late",
    workHours: "8h 18m",
    overtimeHours: "0h 30m",
    device: "Biometric Gate 2"
  },
  {
    id: 4,
    employeeId: 11,
    employeeName: "Ms. Farzana Sharmin, MP",
    employeeCode: "EMP-011",
    ministryName: "Ministry of Social Welfare",
    date: "2026-08-02",
    checkIn: "08:45 AM",
    checkOut: "06:00 PM",
    status: "present",
    workHours: "9h 15m",
    overtimeHours: "1h 00m",
    device: "VIP Portal - Ministry"
  },
  {
    id: 5,
    employeeId: 12,
    employeeName: "Dr. Md. Mahmudul Haque",
    employeeCode: "EMP-012",
    ministryName: "Ministry of Social Welfare",
    date: "2026-08-02",
    checkIn: "08:55 AM",
    checkOut: "05:45 PM",
    status: "present",
    workHours: "8h 50m",
    overtimeHours: "0h 45m",
    device: "VIP Portal - Ministry"
  }
];

export const dummyAttendanceSummary = {
  totalEmployees: 19,
  presentToday: 16,
  lateToday: 2,
  onLeaveToday: 1,
  absentToday: 0,
  overallAttendancePercentage: "94.7%",
  monthlyPunctualityRate: "96.2%"
};

export const dummyAttendanceSheet = [
  { employeeId: 1, name: "Shaila Sharmin Zaman", code: "EMP-001", days: { "01": "P", "02": "P", "03": "P", "04": "P", "05": "P", "06": "W", "07": "W" } },
  { employeeId: 2, name: "Naima Hossain", code: "EMP-002", days: { "01": "P", "02": "P", "03": "P", "04": "P", "05": "P", "06": "W", "07": "W" } },
  { employeeId: 3, name: "Md. Monir Hossain", code: "EMP-003", days: { "01": "L", "02": "P", "03": "P", "04": "P", "05": "L", "06": "W", "07": "W" } },
  { employeeId: 11, name: "Ms. Farzana Sharmin, MP", code: "EMP-011", days: { "01": "P", "02": "P", "03": "P", "04": "P", "05": "P", "06": "W", "07": "W" } }
];
