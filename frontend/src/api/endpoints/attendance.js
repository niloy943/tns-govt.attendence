import { apiClient } from '../client';

// GET /api/attendance
export async function fetchAttendanceList(params) {
  return await apiClient('/attendance', { params });
}

// GET /api/attendance/monthly-summary
export async function fetchAttendanceSummary(params) {
  return await apiClient('/attendance/monthly-summary', { params });
}

// GET /api/attendance/sheet
export async function fetchAttendanceSheet(month, year) {
  return await apiClient('/attendance/sheet', {
    params: { month, year }
  });
}

// GET /api/attendance/individual/:employeeId
export async function fetchIndividualAttendance(employeeId, month) {
  return await apiClient(`/attendance/individual/${employeeId}`, {
    params: { month }
  });
}

// POST /api/attendance
export async function createAttendanceRecord(recordData) {
  return await apiClient('/attendance', { body: recordData });
}

// POST /api/attendance/bulk-import
export async function bulkImportAttendance(records) {
  return await apiClient('/attendance/bulk-import', { body: { records } });
}

// PATCH /api/attendance/:id/transition
export async function transitionAttendance(id, transitionData) {
  return await apiClient(`/attendance/${id}/transition`, {
    method: 'PATCH',
    body: transitionData
  });
}

// PATCH /api/attendance/:id/unlock  (super_admin only)
export async function unlockAttendance(id) {
  return await apiClient(`/attendance/${id}/unlock`, { method: 'PATCH' });
}

// GET /api/attendance/devices
export async function fetchAttendanceDevices() {
  return await apiClient('/attendance/devices');
}

// POST /api/attendance/devices
export async function createAttendanceDevice(deviceData) {
  return await apiClient('/attendance/devices', { body: deviceData });
}

// PUT /api/attendance/devices/:id
export async function updateAttendanceDevice(id, deviceData) {
  return await apiClient(`/attendance/devices/${id}`, {
    method: 'PUT',
    body: deviceData
  });
}

// DELETE /api/attendance/devices/:id  (super_admin only)
export async function deleteAttendanceDevice(id) {
  return await apiClient(`/attendance/devices/${id}`, { method: 'DELETE' });
}

// GET /api/attendance/corrections
export async function fetchAttendanceCorrections() {
  return await apiClient('/attendance/corrections');
}

// POST /api/attendance/corrections
export async function submitAttendanceCorrection(correctionData) {
  return await apiClient('/attendance/corrections', { body: correctionData });
}

// PATCH /api/attendance/corrections/:id/review
export async function reviewAttendanceCorrection(id, reviewData) {
  return await apiClient(`/attendance/corrections/${id}/review`, {
    method: 'PATCH',
    body: reviewData
  });
}
