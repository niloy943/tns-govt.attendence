import { useQuery } from "@tanstack/react-query";
import { fetchAttendanceList, fetchAttendanceSummary, fetchAttendanceSheet } from "../api/endpoints/attendance";
import { dummyAttendanceList, dummyAttendanceSummary, dummyAttendanceSheet } from "../data/dummy/attendance";

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === "true";

export function useAttendanceList(filters = {}) {
  return useQuery({
    queryKey: ["attendanceList", filters],
    queryFn: USE_DUMMY
      ? () => Promise.resolve([...dummyAttendanceList])
      : () => fetchAttendanceList(filters),
  });
}

export function useAttendanceSummary() {
  return useQuery({
    queryKey: ["attendanceSummary"],
    queryFn: USE_DUMMY
      ? () => Promise.resolve(dummyAttendanceSummary)
      : fetchAttendanceSummary,
  });
}

export function useAttendanceSheet(month, year) {
  return useQuery({
    queryKey: ["attendanceSheet", month, year],
    queryFn: USE_DUMMY
      ? () => Promise.resolve(dummyAttendanceSheet)
      : () => fetchAttendanceSheet(month, year),
  });
}
