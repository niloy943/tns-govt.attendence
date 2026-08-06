import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAttendanceList,
  fetchAttendanceSummary,
  fetchAttendanceSheet,
  fetchIndividualAttendance,
  createAttendanceRecord,
  transitionAttendance,
  fetchAttendanceDevices,
  fetchAttendanceCorrections,
  submitAttendanceCorrection,
} from "../api/endpoints/attendance";
import {
  dummyAttendanceList,
  dummyAttendanceSummary,
  dummyAttendanceSheet,
} from "../data/dummy/attendance";

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === "true";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useAttendanceList(filters = {}) {
  return useQuery({
    queryKey: ["attendanceList", filters],
    queryFn: USE_DUMMY
      ? () => Promise.resolve([...dummyAttendanceList])
      : () => fetchAttendanceList(filters),
  });
}

export function useAttendanceSummary(params = {}) {
  return useQuery({
    queryKey: ["attendanceSummary", params],
    queryFn: USE_DUMMY
      ? () => Promise.resolve(dummyAttendanceSummary)
      : () => fetchAttendanceSummary(params),
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

export function useIndividualAttendance(employeeId, month) {
  return useQuery({
    queryKey: ["individualAttendance", employeeId, month],
    queryFn: USE_DUMMY
      ? () => {
          // Generate mock individual attendance data
          const daysInMonth = 31;
          const logs = [];
          let presentDays = 0, absentDays = 0, lateCount = 0, totalHours = 0;
          for (let d = 1; d <= daysInMonth; d++) {
            const dayStr = d < 10 ? `0${d}` : `${d}`;
            const dateVal = `${month}-${dayStr}`;
            const dayOfWeek = new Date(dateVal).toLocaleDateString("en-US", { weekday: "short" });
            const isWeekend = dayOfWeek === "Sat" || dayOfWeek === "Sun";
            let status = "PRESENT", checkIn = "08:58 AM", checkOut = "05:05 PM", hours = 8.1;
            if (isWeekend) { status = "HOLIDAY"; checkIn = "--:--"; checkOut = "--:--"; hours = 0; }
            else if (d === 3 || d === 12) { status = "LATE"; checkIn = "09:35 AM"; lateCount++; presentDays++; totalHours += 7.9; hours = 7.9; }
            else if (d === 15) { status = "ON_LEAVE"; checkIn = "--:--"; checkOut = "--:--"; hours = 0; }
            else if (d === 22) { status = "ABSENT"; checkIn = "--:--"; checkOut = "--:--"; hours = 0; absentDays++; }
            else { presentDays++; totalHours += hours; }
            logs.push({ date: dateVal, dayOfWeek, checkIn, checkOut, totalHours: hours, status });
          }
          return Promise.resolve({
            period: month,
            summary: { presentDays, absentDays, lateCount, totalHours: Math.round(totalHours * 10) / 10, targetHours: 160.0 },
            logs,
          });
        }
      : () => fetchIndividualAttendance(employeeId, month),
    enabled: !!employeeId,
  });
}

export function useAttendanceDevices() {
  return useQuery({
    queryKey: ["attendanceDevices"],
    queryFn: USE_DUMMY
      ? () =>
          Promise.resolve([
            { id: 1, name: "Secretariat Gate-01 BioTerminal", type: "Fingerprint", location: "Main Gate", status: "active" },
            { id: 2, name: "Ministry Wing-2 FacialScanner", type: "Face", location: "Wing-2 Entry", status: "active" },
            { id: 3, name: "Finance Dept RFID Reader", type: "ID Card", location: "Finance Block", status: "active" },
            { id: 4, name: "Mobile QR Kiosk Terminal-03", type: "QR", location: "Lobby", status: "inactive" },
          ])
      : fetchAttendanceDevices,
  });
}

export function useAttendanceCorrections() {
  return useQuery({
    queryKey: ["attendanceCorrections"],
    queryFn: USE_DUMMY ? () => Promise.resolve([]) : fetchAttendanceCorrections,
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useCreateAttendanceRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recordData) => {
      if (USE_DUMMY) {
        return Promise.resolve({ success: true, record: { id: Date.now(), ...recordData } });
      }
      return createAttendanceRecord(recordData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendanceList"] });
      queryClient.invalidateQueries({ queryKey: ["attendanceSummary"] });
    },
  });
}

export function useTransitionAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...transitionData }) => {
      if (USE_DUMMY) return Promise.resolve({ success: true });
      return transitionAttendance(id, transitionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendanceList"] });
    },
  });
}

export function useSubmitAttendanceCorrection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (correctionData) => {
      if (USE_DUMMY) return Promise.resolve({ success: true, id: `CORR-${Date.now()}` });
      return submitAttendanceCorrection(correctionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendanceCorrections"] });
    },
  });
}
