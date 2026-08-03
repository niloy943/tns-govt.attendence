import { apiClient } from '../client';

export async function fetchLeaveRequests() {
  return await apiClient('/leave-requests');
}

export async function createLeaveRequest(leaveData) {
  return await apiClient('/leave-requests', { body: leaveData });
}

export async function updateLeaveStatus(id, status) {
  return await apiClient(`/leave-requests/${id}/status`, { method: 'PATCH', body: { status } });
}
