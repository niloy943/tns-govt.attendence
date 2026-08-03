import React from 'react';
import { Car, Key, CheckCircle } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';

const ParkingManagement = () => {
  const slots = [
    { slotNo: 'P-101', type: 'Executive Reserved', assignedTo: 'Abul Kalam Azad', vehicleNo: 'Dhaka Metro Ga 12-3456', status: 'Occupied' },
    { slotNo: 'P-102', type: 'Staff Allocated', assignedTo: 'Golam Maula Lincoln', vehicleNo: 'Dhaka Metro Kha 78-9012', status: 'Occupied' },
    { slotNo: 'P-103', type: 'Visitor Parking', assignedTo: 'Unassigned', vehicleNo: 'N/A', status: 'Available' },
    { slotNo: 'P-104', type: 'Staff Allocated', assignedTo: 'Julia Akter Lipi', vehicleNo: 'Dhaka Metro Ga 55-6677', status: 'Occupied' },
    { slotNo: 'P-105', type: 'EV Charging Bay', assignedTo: 'Unassigned', vehicleNo: 'N/A', status: 'Available' }
  ];

  const columns = [
    { header: 'Slot Number', key: 'slotNo', render: (s) => <span className="font-bold text-indigo-600">{s.slotNo}</span> },
    { header: 'Slot Type', key: 'type' },
    { header: 'Assigned Driver/Staff', key: 'assignedTo', render: (s) => <span className="font-bold text-slate-800">{s.assignedTo}</span> },
    { header: 'Vehicle Plate Number', key: 'vehicleNo' },
    { header: 'Availability', key: 'status', render: (s) => <StatusBadge status={s.status === 'Occupied' ? 'Active' : 'Inactive'} /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Basement Parking Slot Allocator</h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">Manage reserved vehicle slots, employee parking passes, and visitor bays</p>
      </div>

      <DataTable columns={columns} data={slots} />
    </div>
  );
};

export default ParkingManagement;
