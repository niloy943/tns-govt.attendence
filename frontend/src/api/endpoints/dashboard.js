import { apiClient } from '../client';

// GET /api/dashboard/central
export async function fetchCentralDashboard() {
  return await apiClient('/dashboard/central');
}

// GET /api/dashboard/ministry/:ministryId
export async function fetchMinistryDashboard(ministryId) {
  return await apiClient(`/dashboard/ministry/${ministryId}`);
}

// GET /api/reports/templates
export async function fetchReportTemplates() {
  return await apiClient('/reports/templates');
}

// GET /api/reports/:template/export
export async function exportReport(template, params) {
  return await apiClient(`/reports/${template}/export`, { params });
}

// GET /api/audit-logs  (super_admin only)
export async function fetchAuditLogs(params) {
  return await apiClient('/audit-logs', { params });
}
