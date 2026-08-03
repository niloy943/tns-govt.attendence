import React, { useState } from 'react';
import { Clock, Plus, Users, Calendar } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';

const ShiftManagement = () => {
  const shifts = [
    { id: 'SH-01', name: 'Morning Shift', code: 'SHIFT-AM', timing: '06:00 AM - 02:00 PM', graceMinutes: 15, assignedEmployees: 25, status: 'Active' },
    { id: 'SH-02', name: 'Evening Shift', code: 'SHIFT-PM', timing: '02:00 PM - 10:00 PM', graceMinutes: 15, assignedEmployees: 30, status: 'Active' },
    { id: 'SH-03', name: 'Night Shift', code: 'SHIFT-NIGHT', timing: '10:00 PM - 06:00 AM', graceMinutes: 20, assignedEmployees: 22, status: 'Active' }
  ];

  const columns = [
    { header: 'Shift Code', key: 'code' },
    { header: 'Shift Name', key: 'name', render: (s) => <span className="font-bold text-slate-800">{s.name}</span> },
    { header: 'Schedule Timing', key: 'timing', render: (s) => <span className="font-bold text-indigo-600">{s.timing}</span> },
    { header: 'Grace Period', key: 'graceMinutes', render: (s) => <span>{s.graceMinutes} mins</span> },
    { header: 'Assigned Staff', key: 'assignedEmployees', render: (s) => <span className="font-bold">{s.assignedEmployees} Staff</span> },
    { header: 'Status', key: 'status', render: (s) => <StatusBadge status={s.status} /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Shift Management</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Configure rotational shifts, start times, and grace thresholds</p>
        </div>
      </div>

      <DataTable columns={columns} data={shifts} />
    </div>
  );
};

export default ShiftManagement;
