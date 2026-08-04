import { apiClient } from '../client';
import { employeeService } from '../../services/employeeService';

export async function fetchEmployees(params) {
  return await employeeService.getEmployees(params);
}

export async function fetchEmployeeById(id) {
  return await employeeService.getEmployeeById(id);
}

export async function createEmployee(payload) {
  return await employeeService.createEmployee(payload);
}

export async function updateEmployee(id, payload) {
  return await employeeService.updateEmployee(id, payload);
}

export async function importGovtEmployees(records) {
  return await employeeService.importGovtEmployees(records);
}

export async function transferEmployee(transferData) {
  return await employeeService.transferEmployee(transferData);
}

export async function fetchTransferHistory() {
  return await employeeService.getTransferHistory();
}
