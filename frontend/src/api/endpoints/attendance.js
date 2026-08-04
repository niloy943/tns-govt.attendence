import { apiClient } from '../client';

export async function fetchAttendanceList(params) {
  const query = new URLSearchParams(params).toString();
  return await apiClient(`/attendance/list?${query}`);
}

export async function fetchAttendanceSummary() {
  return await apiClient('/attendance/summary');
}

export async function fetchAttendanceSheet(month, year) {
  return await apiClient(`/attendance/sheet?month=${month}&year=${year}`);
}
