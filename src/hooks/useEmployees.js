import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEmployees, fetchEmployeeById } from "../api/endpoints/employees";
import { dummyEmployees } from "../data/dummy/employees";

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === "true";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const rawData = USE_DUMMY
        ? await Promise.resolve([...dummyEmployees])
        : await fetchEmployees();
      return Array.isArray(rawData) ? rawData : (rawData?.data || []);
    }
  });
}

export function useEmployeeById(id) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: USE_DUMMY
      ? () => Promise.resolve(dummyEmployees.find(e => e.id === Number(id)))
      : () => fetchEmployeeById(id),
    enabled: !!id,
  });
}

export function useAddEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newEmp) => {
      if (USE_DUMMY) {
        const created = {
          id: Date.now(),
          employeeCode: `EMP-${Math.floor(100 + Math.random() * 900)}`,
          status: "active",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          ...newEmp
        };
        dummyEmployees.push(created);
        return Promise.resolve(created);
      }
      return Promise.resolve(newEmp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => {
      if (USE_DUMMY) {
        const idx = dummyEmployees.findIndex(e => e.id === Number(id));
        if (idx !== -1) {
          dummyEmployees.splice(idx, 1);
        }
        return Promise.resolve(true);
      }
      return Promise.resolve(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });
}
