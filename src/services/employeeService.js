import { apiClient } from '../api/client';
import { dummyEmployees, dummyTransferHistory } from '../data/dummy/employees';

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA !== "false";

/**
 * Service Layer abstraction matching Laravel architecture:
 * Controller -> Service -> Mapper -> Repository -> employees table
 */
export const employeeService = {
  /**
   * Fetch all employees with optional filters
   */
  async getEmployees(params = {}) {
    if (USE_DUMMY) {
      let result = [...dummyEmployees];
      if (params.search) {
        const q = params.search.toLowerCase();
        result = result.filter(e =>
          e.name.toLowerCase().includes(q) ||
          e.employeeCode.toLowerCase().includes(q) ||
          (e.designation && e.designation.toLowerCase().includes(q))
        );
      }
      if (params.ministryId && params.ministryId !== 'all') {
        result = result.filter(e => e.ministryId === Number(params.ministryId));
      }
      if (params.department && params.department !== 'all') {
        result = result.filter(e => e.department === params.department);
      }
      if (params.status && params.status !== 'all') {
        result = result.filter(e => e.status === params.status);
      }
      return Promise.resolve({ data: result, total: result.length });
    }
    return await apiClient('/employees', { params });
  },

  /**
   * Fetch single employee details by ID
   */
  async getEmployeeById(id) {
    if (USE_DUMMY) {
      const emp = dummyEmployees.find(e => e.id === Number(id));
      return Promise.resolve(emp || null);
    }
    return await apiClient(`/employees/${id}`);
  },

  /**
   * Add new employee (used by 6-step wizard)
   */
  async createEmployee(payload) {
    if (USE_DUMMY) {
      const newEmp = {
        id: Date.now(),
        employeeCode: payload.employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        govtEmployeeId: payload.govtEmployeeId || `BCS-${Math.floor(100000 + Math.random() * 900000)}`,
        name: payload.name || "Unnamed Officer",
        gender: payload.gender || "Male",
        dob: payload.dob || "1985-01-01",
        bloodGroup: payload.bloodGroup || "O+",
        nid: payload.nid || "19852691238471999",
        passport: payload.passport || "",
        designation: payload.designation || "Assistant Officer",
        department: payload.department || "General Administration",
        wing: payload.wing || "Admin Wing",
        section: payload.section || "Section-01",
        ministryId: Number(payload.ministryId) || 1,
        ministryName: payload.ministryName || "Ministry of Social Welfare",
        email: payload.email || "officer@gov.bd",
        phone: payload.phone || "01700000000",
        joiningDate: payload.joiningDate || new Date().toISOString().substring(0, 10),
        employmentType: payload.employmentType || "Permanent",
        serviceStatus: payload.serviceStatus || "Active",
        status: payload.status || "Active",
        level: payload.level || "staff",
        reportsTo: payload.reportsTo || null,
        reportingOfficer: payload.reportingOfficer || "Senior Secretary",
        monthlySalary: Number(payload.monthlySalary) || 35500,
        basicSalary: Number(payload.basicSalary) || 29000,
        payGrade: payload.payGrade || "Grade 9",
        salaryStatus: payload.salaryStatus || "Regular Paid",
        attendanceSource: payload.attendanceSource || "Biometric Device",
        attendanceDevice: payload.attendanceDevice || "DEV-MAIN-SECRETARIAT-01",
        assignedShift: payload.assignedShift || "General Office (09:00 AM - 05:00 PM)",
        currentAttendanceStatus: "Present",
        role: payload.role || "Officer",
        createdBy: "Super Admin",
        updatedBy: "Super Admin",
        avatar: payload.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      };
      dummyEmployees.unshift(newEmp);
      return Promise.resolve(newEmp);
    }
    return await apiClient('/employees', { method: 'POST', data: payload });
  },

  /**
   * Update existing employee details
   */
  async updateEmployee(id, payload) {
    if (USE_DUMMY) {
      const idx = dummyEmployees.findIndex(e => e.id === Number(id));
      if (idx !== -1) {
        dummyEmployees[idx] = { ...dummyEmployees[idx], ...payload, updatedBy: "Super Admin" };
        return Promise.resolve(dummyEmployees[idx]);
      }
      return Promise.reject(new Error("Employee not found"));
    }
    return await apiClient(`/employees/${id}`, { method: 'PUT', data: payload });
  },

  /**
   * Import Government Officers flow:
   * Maps to Laravel GovernmentImportController -> GovernmentImportService -> EmployeeMapper -> EmployeeRepository -> employees table
   */
  async importGovtEmployees(records) {
    if (USE_DUMMY) {
      const imported = records.map((rec, index) => ({
        id: Date.now() + index,
        employeeCode: rec.employeeCode || `EMP-GOVT-${Math.floor(1000 + Math.random() * 9000)}`,
        govtEmployeeId: rec.govtEmployeeId || `BCS-${Math.floor(100000 + Math.random() * 900000)}`,
        name: rec.name,
        gender: rec.gender || "Male",
        dob: rec.dob || "1982-05-10",
        bloodGroup: rec.bloodGroup || "B+",
        nid: rec.nid || `1982${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        passport: rec.passport || "",
        designation: rec.designation,
        department: rec.office || rec.department || "General Administration",
        wing: rec.wing || "Executive Wing",
        section: rec.section || "Admin Section",
        ministryId: rec.ministryId || 1,
        ministryName: rec.ministryName || "Ministry of Social Welfare",
        email: rec.email || `officer.${index}@gov.bd`,
        phone: rec.phone || "N/A",
        joiningDate: rec.joiningDate || "2024-01-01",
        employmentType: rec.employmentType || "Permanent",
        serviceStatus: rec.status || "Active",
        status: rec.status || "Active",
        level: "manager",
        reportingOfficer: "Director General",
        monthlySalary: Number(rec.monthlySalary) || 50000,
        basicSalary: Number(rec.basicSalary) || 43000,
        payGrade: rec.payGrade || "Grade 5",
        salaryStatus: "Regular Paid",
        attendanceSource: rec.attendanceSource || "Biometric Device",
        attendanceDevice: rec.attendanceDevice || "DEV-SECRETARIAT-01",
        assignedShift: "General Office (09:00 AM - 05:00 PM)",
        currentAttendanceStatus: "Present",
        role: rec.role || "Officer",
        createdBy: "Govt Portal Auto-Import",
        updatedBy: "Super Admin",
        avatar: rec.photo || rec.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      }));
      dummyEmployees.unshift(...imported);
      return Promise.resolve({ success: true, importedCount: imported.length, data: imported });
    }
    return await apiClient('/import/government', { method: 'POST', data: { records } });
  },

  /**
   * Transfer Employee between Ministries / Departments
   */
  async transferEmployee(transferData) {
    if (USE_DUMMY) {
      const record = {
        id: Date.now(),
        transferDate: new Date().toISOString().substring(0, 10),
        status: "Approved",
        ...transferData
      };
      dummyTransferHistory.unshift(record);

      // Update employee record
      const emp = dummyEmployees.find(e => e.id === Number(transferData.employeeId));
      if (emp) {
        emp.ministryId = Number(transferData.toMinistryId) || emp.ministryId;
        emp.ministryName = transferData.toMinistryName || emp.ministryName;
        emp.department = transferData.toDepartment || emp.department;
        emp.wing = transferData.toWing || emp.wing;
      }
      return Promise.resolve(record);
    }
    return await apiClient('/employees/transfer', { method: 'POST', data: transferData });
  },

  /**
   * Fetch transfer history
   */
  async getTransferHistory() {
    if (USE_DUMMY) {
      return Promise.resolve([...dummyTransferHistory]);
    }
    return await apiClient('/employees/transfers');
  }
};
