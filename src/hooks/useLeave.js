import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLeaveRequests, createLeaveRequest, updateLeaveStatus } from "../api/endpoints/leave";
import { dummyLeaveRequests } from "../data/dummy/leaveRequests";

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === "true";

export function useLeaveRequests() {
  return useQuery({
    queryKey: ["leaveRequests"],
    queryFn: USE_DUMMY
      ? () => Promise.resolve([...dummyLeaveRequests])
      : fetchLeaveRequests,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newLeave) => {
      if (USE_DUMMY) {
        const created = {
          id: Date.now(),
          status: "pending",
          appliedDate: new Date().toISOString().split('T')[0],
          ...newLeave
        };
        dummyLeaveRequests.unshift(created);
        return Promise.resolve(created);
      }
      return createLeaveRequest(newLeave);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
    }
  });
}

export function useUpdateLeaveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, approvedBy }) => {
      if (USE_DUMMY) {
        const target = dummyLeaveRequests.find(l => l.id === Number(id));
        if (target) {
          target.status = status;
          if (approvedBy) target.approvedBy = approvedBy;
        }
        return Promise.resolve(target);
      }
      return updateLeaveStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
    }
  });
}
