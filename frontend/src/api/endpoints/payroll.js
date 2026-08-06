import { apiClient } from '../client';

// GET /api/payroll
export async function fetchPayrollRecords(params) {
  return await apiClient('/payroll', { params });
}

// GET /api/payroll/:id
export async function fetchPayrollById(id) {
  return await apiClient(`/payroll/${id}`);
}

// GET /api/payroll/distribution
export async function fetchPayrollDistribution(params) {
  return await apiClient('/payroll/distribution', { params });
}

// POST /api/payroll/generate
export async function generatePayroll(payload) {
  return await apiClient('/payroll/generate', { body: payload });
}

// PATCH /api/payroll/:id/lock  (super_admin only)
export async function lockPayroll(id) {
  return await apiClient(`/payroll/${id}/lock`, { method: 'PATCH' });
}

// GET /api/budget
export async function fetchBudgetAllocations(params) {
  return await apiClient('/budget', { params });
}

// POST /api/budget  (super_admin only)
export async function createBudgetAllocation(budgetData) {
  return await apiClient('/budget', { body: budgetData });
}

// PUT /api/budget/:id  (super_admin only)
export async function updateBudgetAllocation(id, budgetData) {
  return await apiClient(`/budget/${id}`, { method: 'PUT', body: budgetData });
}

// GET /api/payroll-rules
export async function fetchPayrollRules() {
  return await apiClient('/payroll-rules');
}

// PUT /api/payroll-rules/:id  (super_admin only)
export async function updatePayrollRule(id, ruleData) {
  return await apiClient(`/payroll-rules/${id}`, { method: 'PUT', body: ruleData });
}
