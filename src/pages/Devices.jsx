import React from 'react';
import { Cpu, Wifi, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';

const Devices = () => {
  const devices = [
    { id: 'DEV-FAC-01', name: 'Agargaon HQ - Gate 1 Terminal', type: 'Face Recognition', ipAddress: '192.168.1.101', location: 'Agargaon ICT Tower', lastSync: '2 mins ago', status: 'Active' },
    { id: 'DEV-BIO-04', name: 'Motijheel Office - Main Lobby', type: 'Biometric Fingerprint', ipAddress: '192.168.2.45', location: 'Motijheel HQ', lastSync: '1 min ago', status: 'Active' },
    { id: 'DEV-BIO-02', name: 'Motijheel Office - Gate 2', type: 'Biometric Fingerprint', ipAddress: '192.168.2.46', location: 'Motijheel HQ', lastSync: '5 mins ago', status: 'Active' },
    { id: 'DEV-FAC-02', name: 'Server Room Biometric Scanner', type: 'Face + Iris Recognition', ipAddress: '192.168.1.105', location: 'Agargaon Server Room', lastSync: 'Just now', status: 'Active' },
    { id: 'DEV-D84', name: 'Chittagong Gate 3 Node', type: 'Biometric Fingerprint', ipAddress: '192.168.3.84', location: 'Chittagong Medical Complex', lastSync: '2 hours ago', status: 'Offline' }
  ];

  const columns = [
    { header: 'Device ID', key: 'id', render: (d) => <span className="font-bold text-indigo-600">{d.id}</span> },
    { header: 'Terminal Name', key: 'name', render: (d) => <span className="font-bold text-slate-800">{d.name}</span> },
    { header: 'Terminal Type', key: 'type' },
    { header: 'IP Address', key: 'ipAddress' },
    { header: 'Location Zone', key: 'location' },
    { header: 'Last Heartbeat Sync', key: 'lastSync' },
    { header: 'Status', key: 'status', render: (d) => <StatusBadge status={d.status} /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Active Biometric Devices & Nodes</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Monitor real-time status of fingerprint, face recognition, and RFID punch terminals</p>
        </div>
      </div>

      <DataTable columns={columns} data={devices} />
    </div>
  );
};

export default Devices;
