import React from 'react';
import { Layers, Folder, Clock, CheckCircle } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';

const ProjectManagement = () => {
  const projects = [
    { id: 'PRJ-101', name: 'Digital Ministry Portal Migration', lead: 'Golam Maula Lincoln', teamSize: 8, progress: '85%', status: 'Active' },
    { id: 'PRJ-102', name: 'Biometric Attendance Hardware Audit', lead: 'Mahmud Hasan Khan', teamSize: 5, progress: '60%', status: 'Active' },
    { id: 'PRJ-103', name: 'Chittagong Medical Complex Extension', lead: 'Dr. Abul Kalam Azad', teamSize: 12, progress: '40%', status: 'Pending' }
  ];

  const columns = [
    { header: 'Project ID', key: 'id' },
    { header: 'Project Name', key: 'name', render: (p) => <span className="font-bold text-slate-800">{p.name}</span> },
    { header: 'Project Lead', key: 'lead' },
    { header: 'Team Allocated', key: 'teamSize', render: (p) => <span>{p.teamSize} Engineers</span> },
    { header: 'Completion Progress', key: 'progress', render: (p) => <span className="font-extrabold text-indigo-600">{p.progress}</span> },
    { header: 'Status', key: 'status', render: (p) => <StatusBadge status={p.status} /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Project Attendance Track</h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">Track project-level time allocations, task hours, and team deployments</p>
      </div>

      <DataTable columns={columns} data={projects} />
    </div>
  );
};

export default ProjectManagement;
