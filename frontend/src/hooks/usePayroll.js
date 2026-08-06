import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPayrollRecords,
  fetchPayrollById,
  fetchPayrollDistribution,
  generatePayroll,
  lockPayroll,
  fetchBudgetAllocations,
  createBudgetAllocation,
  updateBudgetAllocation,
  fetchPayrollRules,
  updatePayrollRule,
} from "../api/endpoints/payroll";
import { fetchSalarySettings, updateSalarySettings } from "../api/endpoints/salarySettings";

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === "true";

// Default salary settings for dummy mode
const DUMMY_SALARY_SETTINGS = {
  id: 1,
  workingDays: 26,
  salaryPolicy: "working_days",
  halfDayRule: "50_percent",
  latePolicy: "deduct_after_3",
  pfPercentage: 10,
  taxPercentage: 5,
  warningPercentage: 90,
  criticalPercentage: 100,
  currency: "BDT",
  payrollDate: 25,
  lockDate: 30,
  autoLock: true,
};

const DUMMY_BUDGET_ALLOCATIONS = {
  1: 1500000,
  2: 1200000,
  3: 2500000,
  4: 3000000,
  5: 2000000,
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useSalarySettings() {
  return useQuery({
    queryKey: ["salarySettings"],
    queryFn: USE_DUMMY
      ? () => Promise.resolve({ ...DUMMY_SALARY_SETTINGS })
      : fetchSalarySettings,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePayrollRecords(params = {}) {
  return useQuery({
    queryKey: ["payrollRecords", params],
    queryFn: USE_DUMMY ? () => Promise.resolve([]) : () => fetchPayrollRecords(params),
  });
}

export function usePayrollById(id) {
  return useQuery({
    queryKey: ["payroll", id],
    queryFn: USE_DUMMY ? () => Promise.resolve(null) : () => fetchPayrollById(id),
    enabled: !!id,
  });
}

export function usePayrollDistribution(params = {}) {
  return useQuery({
    queryKey: ["payrollDistribution", params],
    queryFn: USE_DUMMY ? () => Promise.resolve([]) : () => fetchPayrollDistribution(params),
  });
}

export function useBudgetAllocations(params = {}) {
  return useQuery({
    queryKey: ["budgetAllocations", params],
    queryFn: USE_DUMMY
      ? () => Promise.resolve(DUMMY_BUDGET_ALLOCATIONS)
      : () => fetchBudgetAllocations(params),
  });
}

export function usePayrollRules() {
  return useQuery({
    queryKey: ["payrollRules"],
    queryFn: USE_DUMMY ? () => Promise.resolve([]) : fetchPayrollRules,
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useUpdateSalarySettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newSettings) => {
      if (USE_DUMMY) {
        Object.assign(DUMMY_SALARY_SETTINGS, newSettings);
        return Promise.resolve(DUMMY_SALARY_SETTINGS);
      }
      return updateSalarySettings(newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salarySettings"] });
    },
  });
}

export function useGeneratePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => {
      if (USE_DUMMY) return Promise.resolve({ success: true, payrollId: `PAY-${Date.now()}` });
      return generatePayroll(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrollRecords"] });
    },
  });
}

export function useLockPayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => {
      if (USE_DUMMY) return Promise.resolve({ success: true });
      return lockPayroll(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrollRecords"] });
    },
  });
}

export function useCreateBudgetAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (budgetData) => {
      if (USE_DUMMY) return Promise.resolve({ success: true, id: Date.now(), ...budgetData });
      return createBudgetAllocation(budgetData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetAllocations"] });
    },
  });
}

export function useUpdateBudgetAllocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => {
      if (USE_DUMMY) return Promise.resolve({ success: true });
      return updateBudgetAllocation(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetAllocations"] });
    },
  });
}

export function useUpdatePayrollRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => {
      if (USE_DUMMY) return Promise.resolve({ success: true });
      return updatePayrollRule(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrollRules"] });
    },
  });
}
