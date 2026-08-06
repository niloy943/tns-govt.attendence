import { employeeService } from "../../services/employeeService";

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
