import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  fetchEmployeeHierarchy,
} from "../api/endpoints/employees";
import { dummyEmployees } from "../data/dummy/employees";

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === "true";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useEmployees(filters = {}) {
  return useQuery({
    queryKey: ["employees", filters],
    queryFn: async () => {
      if (USE_DUMMY) {
        let result = [...dummyEmployees];
        if (filters.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (e) =>
              e.name.toLowerCase().includes(q) ||
              e.employeeCode.toLowerCase().includes(q) ||
              (e.designation && e.designation.toLowerCase().includes(q)),
          );
        }
        if (filters.ministryId && filters.ministryId !== "all") {
          result = result.filter(
            (e) => e.ministryId === Number(filters.ministryId),
          );
        }
        if (filters.department && filters.department !== "all") {
          result = result.filter((e) => e.department === filters.department);
        }
        if (filters.status && filters.status !== "all") {
          result = result.filter((e) => e.status === filters.status);
        }
        return result;
      }
      const response = await fetchEmployees(filters);
      return Array.isArray(response) ? response : response?.data || [];
    },
  });
}

export function useEmployeeById(id) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: USE_DUMMY
      ? () => Promise.resolve(dummyEmployees.find((e) => e.id === Number(id)))
      : () => fetchEmployeeById(id),
    enabled: !!id,
  });
}

export function useEmployeeHierarchy(ministryId) {
  return useQuery({
    queryKey: ["employeeHierarchy", ministryId],
    queryFn: USE_DUMMY
      ? () => {
          const filtered =
            ministryId && ministryId !== "all"
              ? dummyEmployees.filter(
                  (e) => e.ministryId === Number(ministryId),
                )
              : [...dummyEmployees];
          return Promise.resolve(filtered);
        }
      : () =>
          fetchEmployeeHierarchy(
            ministryId && ministryId !== "all"
              ? { ministry_id: ministryId }
              : {},
          ),
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useAddEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newEmp) => {
      if (USE_DUMMY) {
        const created = {
          id: Date.now(),
          employeeCode:
            newEmp.employeeCode ||
            `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          govtEmployeeId:
            newEmp.govtEmployeeId ||
            `BCS-${Math.floor(100000 + Math.random() * 900000)}`,
          status: "Active",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          ...newEmp,
        };
        dummyEmployees.unshift(created);
        return Promise.resolve(created);
      }
      return createEmployee(newEmp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => {
      if (USE_DUMMY) {
        const idx = dummyEmployees.findIndex((e) => e.id === Number(id));
        if (idx !== -1) {
          dummyEmployees[idx] = {
            ...dummyEmployees[idx],
            ...payload,
            updatedBy: "Super Admin",
          };
          return Promise.resolve(dummyEmployees[idx]);
        }
        return Promise.reject(new Error("Employee not found"));
      }
      return updateEmployee(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => {
      if (USE_DUMMY) {
        const idx = dummyEmployees.findIndex((e) => e.id === Number(id));
        if (idx !== -1) dummyEmployees.splice(idx, 1);
        return Promise.resolve(true);
      }
      return Promise.resolve(true); // TODO: add DELETE endpoint when backend supports it
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
