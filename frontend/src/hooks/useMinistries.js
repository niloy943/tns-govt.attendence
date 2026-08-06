import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMinistries, createMinistry, updateMinistry, deleteMinistry } from "../api/endpoints/ministries";
import { dummyMinistries } from "../data/dummy/ministries";

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === "true";

export function useMinistries() {
  return useQuery({
    queryKey: ["ministries"],
    queryFn: async () => {
      if (USE_DUMMY) return [...dummyMinistries];
      const res = await fetchMinistries();
      return Array.isArray(res) ? res : (res?.data || []);
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export function useAddMinistry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newMinistry) => {
      if (USE_DUMMY) {
        const created = {
          id: Date.now(),
          employeeCount: 0,
          status: "active",
          ...newMinistry
        };
        dummyMinistries.push(created);
        return Promise.resolve(created);
      }
      return createMinistry(newMinistry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    }
  });
}

export function useUpdateMinistry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updatedData }) => {
      if (USE_DUMMY) {
        const index = dummyMinistries.findIndex(m => m.id === Number(id));
        if (index !== -1) {
          dummyMinistries[index] = { ...dummyMinistries[index], ...updatedData };
        }
        return Promise.resolve(dummyMinistries[index]);
      }
      return updateMinistry(id, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    }
  });
}

export function useDeleteMinistry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => {
      if (USE_DUMMY) {
        const index = dummyMinistries.findIndex(m => m.id === Number(id));
        if (index !== -1) {
          dummyMinistries.splice(index, 1);
        }
        return Promise.resolve(true);
      }
      return deleteMinistry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    }
  });
}
