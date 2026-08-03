import React from 'react';

const statusMap = {
  active: { label: 'Active', className: 'badge-active' },
  inactive: { label: 'Inactive', className: 'badge-inactive' },
  pending: { label: 'Pending', className: 'badge-pending' },
  approved: { label: 'Approved', className: 'badge-approved' },
  rejected: { label: 'Rejected', className: 'badge-rejected' },
  present: { label: 'Present', className: 'badge-present' },
  late: { label: 'Late', className: 'badge-late' },
  absent: { label: 'Absent', className: 'badge-absent' },
  on_leave: { label: 'On Leave', className: 'badge-info' },
  rotational: { label: 'Rotational', className: 'badge-rotational' },
  medical: { label: 'Medical', className: 'badge-medical' },
  casual: { label: 'Casual', className: 'badge-info' },
  sick: { label: 'Sick', className: 'badge-pending' },
  earned: { label: 'Earned', className: 'badge-active' }
};

export default function StatusBadge({ status, customLabel }) {
  const config = statusMap[status?.toLowerCase()] || {
    label: status || 'Unknown',
    className: 'badge-info'
  };

  return (
    <span className={`badge ${config.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {customLabel || config.label}
    </span>
  );
}
