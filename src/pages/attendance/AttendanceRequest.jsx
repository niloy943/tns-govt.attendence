import React, { useState } from 'react';
import { CalendarCheck, Plus, CheckCircle, XCircle } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Dropdown from '../../components/common/Dropdown';
import { useAppState } from '../../context/AppStateContext';
import { useToast } from '../../context/ToastContext';

const AttendanceRequest = () => {
  const { employees, addPunchLog } = useAppState();
  const { addToast } = useToast();

  const [requests, setRequests] = useState([
    { id: 'REQ-301', employeeName: 'Farhana Rahman', date: '2026-08-01', requestType: 'Missed Punch In Correction', reason: 'Biometric terminal hardware offline at Gate 3.', status: 'Pending' },
    { id: 'REQ-302', employeeName: 'Mahmud Hasan Khan', date: '2026-08-02', requestType: 'Official Duty (On-Site Work)', reason: 'Offsite datacenter cable maintenance.', status: 'Approved' }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [empId, setEmpId] = useState(employees[0]?.id || '');
  const [reqType, setReqType] = useState('Missed Punch In Correction');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === empId);
    const newReq = {
      id: `REQ-${300 + requests.length + 1}`,
      employeeName: emp ? emp.name : 'Staff',
      date: new Date().toISOString().split('T')[0],
      requestType: reqType,
      reason,
      status: 'Pending'
    };
    setRequests([newReq, ...requests]);
    addToast('Attendance adjustment request submitted!', 'success');
    setIsOpen(false);
  };

  const handleUpdateStatus = (id, status) => {
    setRequests(requests.map((r) => r.id === id ? { ...r, status } : r));
    addToast(`Request marked as ${status}`, status === 'Approved' ? 'success' : 'info');
  };

  const columns = [
    { header: 'Request ID', key: 'id' },
    { header: 'Employee', key: 'employeeName', render: (r) => <span className="font-bold text-slate-800">{r.employeeName}</span> },
    { header: 'Target Date', key: 'date' },
    { header: 'Adjustment Type', key: 'requestType', render: (r) => <span className="font-bold text-indigo-600">{r.requestType}</span> },
    { header: 'Reason / Justification', key: 'reason' },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Action',
      key: 'actions',
      render: (r) => (
        r.status === 'Pending' && (
          <div className="flex gap-2 text-xs font-bold">
            <button onClick={() => handleUpdateStatus(r.id, 'Approved')} className="text-emerald-600 hover:underline">Approve</button>
            <button onClick={() => handleUpdateStatus(r.id, 'Rejected')} className="text-rose-600 hover:underline">Reject</button>
          </div>
        )
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Request Attendance Adjustment</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Submit missed punch corrections and official field duty logs</p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Attendance Request</span>
        </button>
      </div>

      <DataTable columns={columns} data={requests} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Attendance Adjustment Request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Dropdown
            label="Select Employee"
            required
            options={employees.map((e) => ({ label: `${e.name} (${e.id})`, value: e.id }))}
            value={empId}
            onChange={setEmpId}
          />

          <Dropdown
            label="Adjustment Type"
            options={[
              { label: 'Missed Punch In Correction', value: 'Missed Punch In Correction' },
              { label: 'Missed Punch Out Correction', value: 'Missed Punch Out Correction' },
              { label: 'Official Duty / Field Work', value: 'Official Duty (On-Site Work)' }
            ]}
            value={reqType}
            onChange={setReqType}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Task Details</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State reason for missing punch or field work assignment..."
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/30 transition-all"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AttendanceRequest;
