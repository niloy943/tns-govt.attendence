/**
 * PayrollService.js
 * 
 * Government Payroll Processing Engine Service
 * 
 * Flowchart Execution Pipeline:
 * PayrollService 
 *   ├── 1. Read salary_settings
 *   ├── 2. Read attendance
 *   ├── 3. Read leave
 *   ├── 4. Read salary components
 *   ├── 5. Calculate Salary
 *   └── 6. Save Payroll
 */

// Step 1: Read salary_settings (15-field Database Schema)
export async function getSalarySettings() {
  return {
    id: 1,
    working_days: 26,
    salary_policy: 'working_days',
    half_day_rule: '50_percent',
    late_policy: 'deduct_after_3',
    pf_percentage: 10,
    tax_percentage: 5,
    warning_percentage: 90,
    critical_percentage: 100,
    currency: 'BDT',
    payroll_date: 25,
    lock_date: 30,
    auto_lock: true,
    created_by: 'Super Admin (Tariqul Islam)',
    updated_by: 'Super Admin (Tariqul Islam)'
  };
}

// Step 2: Read attendance
export async function getOfficerAttendance(officerId, month) {
  return {
    presentDays: 22,
    absentDays: 1,
    lateDays: 4,
    halfDays: 1,
    officialDutyDays: 2
  };
}

// Step 3: Read leave
export async function getOfficerApprovedLeave(officerId, month) {
  return {
    approvedLeaveDays: 2,
    leaveType: "Casual Leave"
  };
}

// Step 4: Read salary components
export async function getOfficerSalaryComponents(monthlySalary) {
  const basic = Math.round(monthlySalary * 0.55);
  const houseRent = Math.round(monthlySalary * 0.20);
  const medical = Math.round(monthlySalary * 0.10);
  const transport = Math.round(monthlySalary * 0.05);
  const specialAllowance = Math.round(monthlySalary * 0.04);
  const festivalBonus = Math.round(monthlySalary * 0.03);
  const otherAllowance = Math.round(monthlySalary * 0.03);

  return {
    basic,
    houseRent,
    medical,
    transport,
    specialAllowance,
    festivalBonus,
    otherAllowance,
    totalAllowances: houseRent + medical + transport + specialAllowance + festivalBonus + otherAllowance
  };
}

// Step 5: Calculate Salary
export function calculatePayroll({ settings, attendance, leave, components, monthlySalary }) {
  const dailyRate = monthlySalary / settings.working_days;
  
  // Deductions calculation
  const absentDeduction = Math.round(attendance.absentDays * dailyRate);
  const halfDayDeduction = settings.half_day_rule === '50_percent' 
    ? Math.round(attendance.halfDays * (dailyRate * 0.5))
    : 0;
  
  const latePenalties = (settings.late_policy === 'deduct_after_3' && attendance.lateDays >= 3)
    ? Math.round(Math.floor(attendance.lateDays / 3) * (dailyRate * 0.5))
    : 0;

  const pfDeduction = Math.round(components.basic * (settings.pf_percentage / 100));
  const taxDeduction = Math.round(monthlySalary * (settings.tax_percentage / 100));

  const totalDeductions = pfDeduction + taxDeduction + absentDeduction + halfDayDeduction + latePenalties;
  const netSalary = components.basic + components.totalAllowances - totalDeductions;

  return {
    basic: components.basic,
    totalAllowances: components.totalAllowances,
    pfDeduction,
    taxDeduction,
    absentDeduction,
    halfDayDeduction,
    latePenalties,
    totalDeductions,
    netSalary: Math.max(0, netSalary)
  };
}

// Step 6: Save Payroll
export async function savePayrollRecord(payrollData) {
  return {
    success: true,
    payrollId: `PAY-${Date.now()}`,
    status: 'generated',
    savedAt: new Date().toISOString(),
    record: payrollData
  };
}

// Complete Orchestrator Service Procedure
export async function executePayrollPipeline(officer, month) {
  // 1. Read salary_settings
  const settings = await getSalarySettings();
  
  // 2. Read attendance
  const attendance = await getOfficerAttendance(officer.id, month);
  
  // 3. Read leave
  const leave = await getOfficerApprovedLeave(officer.id, month);
  
  // 4. Read salary components
  const components = await getOfficerSalaryComponents(officer.monthlySalary || 60000);
  
  // 5. Calculate Salary
  const calculation = calculatePayroll({
    settings,
    attendance,
    leave,
    components,
    monthlySalary: officer.monthlySalary || 60000
  });

  // 6. Save Payroll
  const saveResult = await savePayrollRecord({
    officerId: officer.id,
    officerName: officer.name,
    month,
    calculation
  });

  return saveResult;
}
