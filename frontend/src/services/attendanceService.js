// Mock API Service simulating backend endpoints for Attendance List and Individual Attendance
// Endpoints: GET /api/v1/attendance, PUT /api/v1/attendance/{id}, GET /api/v1/attendance/individual, POST /api/v1/attendance/request-correction

import { INITIAL_ATTENDANCE_LOGS, INITIAL_EMPLOYEES } from '../utils/mockData';

let attendanceDb = [...INITIAL_ATTENDANCE_LOGS];

export const attendanceService = {
  // GET /api/v1/attendance
  async getAttendanceList(params = {}) {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      status = '',
      department = '',
      date = ''
    } = params;

    await new Promise((resolve) => setTimeout(resolve, 150));

    let filtered = attendanceDb.map((log) => {
      let totalHours = '0 hrs 0 mins';
      if (log.timeIn && log.timeOut && log.timeIn !== '--:--' && log.timeOut !== '--:--') {
        totalHours = '8 hrs 30 mins';
      } else if (log.status === 'Present' || log.status === 'On Time') {
        totalHours = '8 hrs 00 mins';
      } else if (log.status === 'Half-Day' || log.status === 'Late') {
        totalHours = '4 hrs 15 mins';
      }

      return {
        ...log,
        totalHours,
        checkIn: log.timeIn || 'N/A',
        checkOut: log.timeOut || 'N/A',
        remarks: log.remarks || (log.status === 'Late' ? 'Late arrival buffer exceeded' : 'Normal punch')
      };
    });

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.employeeId.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'All') {
      filtered = filtered.filter((item) => item.status.toLowerCase() === status.toLowerCase());
    }

    if (department) {
      filtered = filtered.filter((item) => item.department.toLowerCase() === department.toLowerCase());
    }

    if (date) {
      filtered = filtered.filter((item) => item.date === date);
    }

    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        pageSize,
        totalRecords,
        totalPages
      }
    };
  },

  // GET /api/v1/attendance/individual?employee_id={id}&month={YYYY-MM}
  async getIndividualAttendance(employeeId, month = '2026-08') {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const employee = INITIAL_EMPLOYEES.find((e) => e.id === employeeId) || INITIAL_EMPLOYEES[0];

    // Generate daily logs for the month
    const daysInMonth = 31;
    const logs = [];
    let presentDays = 0;
    let absentDays = 0;
    let lateCount = 0;
    let totalHoursAccumulated = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = d < 10 ? `0${d}` : `${d}`;
      const dateVal = `${month}-${dayStr}`;
      const dayOfWeek = new Date(dateVal).toLocaleDateString('en-US', { weekday: 'short' });
      const isWeekend = dayOfWeek === 'Sat' || dayOfWeek === 'Sun';

      let status = 'PRESENT';
      let checkIn = '08:58 AM';
      let checkOut = '05:05 PM';
      let hours = 8.1;
      let punches = [
        { type: 'IN', time: '08:58 AM' },
        { type: 'OUT', time: '12:30 PM' },
        { type: 'IN', time: '01:15 PM' },
        { type: 'OUT', time: '05:05 PM' }
      ];

      if (isWeekend) {
        status = 'HOLIDAY';
        checkIn = '--:--';
        checkOut = '--:--';
        hours = 0;
        punches = [];
      } else if (d === 3 || d === 12) {
        status = 'LATE';
        checkIn = '09:35 AM';
        checkOut = '05:30 PM';
        hours = 7.9;
        lateCount++;
        presentDays++;
        totalHoursAccumulated += hours;
      } else if (d === 15) {
        status = 'ON_LEAVE';
        checkIn = '--:--';
        checkOut = '--:--';
        hours = 0;
        punches = [];
      } else if (d === 22) {
        status = 'ABSENT';
        checkIn = '--:--';
        checkOut = '--:--';
        hours = 0;
        absentDays++;
        punches = [];
      } else {
        presentDays++;
        totalHoursAccumulated += hours;
      }

      logs.push({
        date: dateVal,
        dayOfWeek,
        checkIn,
        checkOut,
        totalHours: hours,
        status,
        punches
      });
    }

    return {
      employee,
      period: month,
      summary: {
        presentDays,
        absentDays,
        lateCount,
        totalHours: Math.round(totalHoursAccumulated * 10) / 10,
        targetHours: 160.0,
        leaveBalance: {
          paid: 14,
          casual: 8,
          sick: 10
        }
      },
      logs
    };
  },

  // POST /api/v1/attendance/request-correction
  async submitCorrectionRequest(data) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true, id: `CORR-${Date.now()}` };
  },

  // PUT /api/v1/attendance/{id}
  async updateAttendanceLog(id, updateData) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    attendanceDb = attendanceDb.map((item) =>
      item.id === id ? { ...item, ...updateData } : item
    );
    return { success: true, id };
  },

  // POST /api/v1/attendance
  async createAttendanceRecord(recordData) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const newRecord = {
      id: `ATT-${900 + attendanceDb.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      method: 'Manual Override',
      ...recordData
    };
    attendanceDb = [newRecord, ...attendanceDb];
    return { success: true, record: newRecord };
  },

  // POST /api/v1/attendance/export
  async exportAttendanceReport() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let csvContent = 'Employee ID,Name,Department,Date,Check-In,Check-Out,Total Hours,Status\n';
    attendanceDb.forEach((log) => {
      csvContent += `"${log.employeeId}","${log.name}","${log.department}","${log.date}","${log.timeIn}","${log.timeOut}","8 hrs","${log.status}"\n`;
    });
    return csvContent;
  }
};
