import React from 'react';
import { UserCheck, Shield, Clock } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';

const VisitorManagement = () => {
  const visitors = [
    { id: 'VIS-901', name: 'Tanvir Ahmed', host: 'Golam Maula Lincoln', purpose: 'Vendor Contract Review', checkIn: '10:15 AM', badgeNo: 'B-104', status: 'Approved' },
    { id: 'VIS-902', name: 'Rashidul Islam', host: 'Julia Akter Lipi', purpose: 'Financial Audit Meeting', checkIn: '11:00 AM', badgeNo: 'B-105', status: 'Approved' },
    { id: 'VIS-903', name: 'Nusrat Jahan', host: 'Mahmud Hasan Khan', purpose: 'Hardware Delivery Verification', checkIn: '01:30 PM', badgeNo: 'B-106', status: 'Pending' }
  ];

  const columns = [
    { header: 'Pass ID', key: 'id' },
    { header: 'Visitor Name', key: 'name', render: (v) => <span className="font-bold text-slate-800">{v.name}</span> },
    { header: 'Host Employee', key: 'host' },
    { header: 'Purpose of Visit', key: 'purpose' },
    { header: 'Check In Time', key: 'checkIn' },
    { header: 'Badge Number', key: 'badgeNo', render: (v) => <span className="font-bold text-indigo-600">{v.badgeNo}</span> },
    { header: 'Status', key: 'status', render: (v) => <StatusBadge status={v.status} /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Visitor Logs & Gate Passes</h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">Manage guest registrations, security clearance badges, and host entry logs</p>
      </div>

      <DataTable columns={columns} data={visitors} />
    </div>
  );
};

export default VisitorManagement;
