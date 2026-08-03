export const dummySettings = {
  systemName: "Govt Attendence Portal",
  primaryMinistry: "Ministry of Social Welfare",
  secondaryMinistry: "Ministry of Women and Children Affairs",
  officialWorkingHours: {
    start: "09:00 AM",
    end: "05:00 PM",
    lateThresholdMinutes: 15
  },
  weekendDays: ["Friday", "Saturday"],
  leaveRules: {
    maxCasualDaysPerYear: 14,
    maxSickDaysPerYear: 14,
    maxRotationalDaysPerShift: 21,
    requireMedicalAttachmentForDaysAbove: 3
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    autoApproveRotational: false
  }
};
