import { apiClient } from '../client';

// GET /api/overtime
export async function fetchOvertimeRecords(params) {
  return await apiClient('/overtime', { params });
}

// POST /api/overtime
export async function createOvertimeRecord(overtimeData) {
  return await apiClient('/overtime', { body: overtimeData });
}

// PATCH /api/overtime/:id/review
export async function reviewOvertimeRecord(id, reviewData) {
  return await apiClient(`/overtime/${id}/review`, {
    method: 'PATCH',
    body: reviewData
  });
}
