import { apiClient } from "../client";

// GET /api/employees
export async function fetchEmployees(params) {
  const data = await apiClient("/employees", { params });
  return Array.isArray(data) ? data : data?.data || [];
}

export async function fetchHierarchy(params) {
  return await apiClient("/employees/hierarchy", { params });
}

// GET /api/employees/:id
export async function fetchEmployeeById(id) {
  return await apiClient(`/employees/${id}`);
}

// POST /api/employees
export async function createEmployee(payload) {
  return await apiClient("/employees", { body: payload });
}

// PUT /api/employees/:id
export async function updateEmployee(id, payload) {
  return await apiClient(`/employees/${id}`, { method: "PUT", body: payload });
}

// GET /api/employees/hierarchy
export async function fetchEmployeeHierarchy(params) {
  return await apiClient("/employees/hierarchy", { params });
}

// GET /api/employees/:id/audit-trail
export async function fetchEmployeeAuditTrail(id) {
  return await apiClient(`/employees/${id}/audit-trail`);
}
