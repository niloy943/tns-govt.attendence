export const leaveCategories = [
  { value: "casual", label: "Casual Leave", code: "CL", maxDays: 14 },
  { value: "sick", label: "Sick Leave", code: "SL", maxDays: 14 },
  { value: "earned", label: "Earned Leave", code: "EL", maxDays: 30 },
  { value: "rotational", label: "Rotational Leave", code: "RL", maxDays: 21 },
  { value: "medical", label: "Medical Leave", code: "ML", maxDays: 60 },
];

export const dummyLeaveRequests = [
  {
    id: 101,
    employeeId: 4,
    employeeName: "Al Noman",
    designation: "Deputy Director (Magistrate)",
    ministryId: 1,
    ministryName: "Department of Women Affairs",
    category: "casual",
    categoryLabel: "Casual Leave",
    startDate: "2026-08-05",
    endDate: "2026-08-07",
    totalDays: 3,
    reason: "Urgent personal family matter",
    attachmentUrl: null,
    attachmentName: null,
    status: "pending",
    appliedDate: "2026-08-01",
    approvedBy: null
  },
  {
    id: 102,
    employeeId: 7,
    employeeName: "Sharmin Shaheen",
    designation: "Deputy Director",
    ministryId: 1,
    ministryName: "Department of Women Affairs",
    category: "earned",
    categoryLabel: "Earned Leave",
    startDate: "2026-07-20",
    endDate: "2026-07-25",
    totalDays: 6,
    reason: "Official training and earned leave",
    attachmentUrl: null,
    attachmentName: null,
    status: "approved",
    appliedDate: "2026-07-15",
    approvedBy: "Shaila Sharmin Zaman"
  }
];
