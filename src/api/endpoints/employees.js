import { apiClient } from '../client';

export async function fetchEmployees() {
  return await apiClient('/employees');
}

export async function fetchEmployeeById(id) {
  return await apiClient(`/employees/${id}`);
}
