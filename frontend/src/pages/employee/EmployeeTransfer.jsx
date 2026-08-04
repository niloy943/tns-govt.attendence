import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  User, 
  FileText, 
  Building2, 
  Search,
  X,
  Save
} from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployees';
import { dummyMinistries } from '../../data/dummy/ministries';
import { dummyTransferHistory } from '../../data/dummy/employees';
import { employeeService } from '../../services/employeeService';

export default function EmployeeTransfer() {
  const { data: employees = [] } = useEmployees();
  const [transfers, setTransfers] = useState(dummyTransferHistory);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Transfer Form State
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [toMinistryId, setToMinistryId] = useState(1);
  const [toDepartment, setToDepartment] = useState('Planning & Evaluation Wing');
  const [toWing, setToWing] = useState('Executive Wing');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().substring(0, 10));
  const [reason, setReason] = useState('Official Transfer Order by Public Administration Ministry');
  const [approvedBy, setApprovedBy] = useState('Additional Secretary (Admin)');

  const selectedEmp = employees.find(e => e.id === Number(selectedEmpId));

  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    if (!selectedEmp) {
      alert("Please select an officer to transfer.");
      return;
    }

    const toMinistryObj = dummyMinistries.find(m => m.id === Number(toMinistryId));
    const transferPayload = {
      employeeId: selectedEmp.id,
      employeeCode: selectedEmp.employeeCode,
      employeeName: selectedEmp.name,
      designation: selectedEmp.designation,
      fromMinistry: selectedEmp.ministryName,
      toMinistry: toMinistryObj ? toMinistryObj.name : 'Ministry of Social Welfare',
      toMinistryId: Number(toMinistryId),
      fromDepartment: selectedEmp.department,
      toDepartment: toDepartment,
      fromWing: selectedEmp.wing || 'Executive Wing',
      toWing: toWing,
      transferDate: transferDate,
      reason: reason,
      approvedBy: approvedBy
    };

    const created = await employeeService.transferEmployee(transferPayload);
    setTransfers([created, ...transfers]);
    setIsModalOpen(false);
    alert(`Transfer order created for ${selectedEmp.name}!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #1E293B'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ backgroundColor: 'rgba(5, 150, 105, 0.2)', padding: '0.625rem', borderRadius: '0.75rem' }}>
            <ArrowRightLeft size={24} color="#34D399" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              Employee Transfer & Inter-Ministry Movement
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '0.15rem 0 0 0' }}>
              Issue transfer orders, track posting changes, dates, reasons & approval logs
            </p>
          </div>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Issue Transfer Order
        </button>
      </div>

      {/* Transfer Roster & History Log */}
      <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Transfer History & Movement Roster</h2>
          <p style={{ fontSize: '0.775rem', color: 'var(--slate-muted)', margin: 0 }}>Official record of officer transfers across ministries and departments</p>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Officer</th>
                <th>Posting Movement</th>
                <th>Transfer Date</th>
                <th>Reason / Gazette Order</th>
                <th>Approved By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(item => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700 }}>{item.employeeName}</p>
                      <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600 }}>{item.employeeCode}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.775rem' }}>
                      <div style={{ color: 'var(--slate-muted)' }}>From: <strong>{item.fromMinistry}</strong> ({item.fromDepartment})</div>
                      <div style={{ color: '#059669', fontWeight: 700, marginTop: '0.15rem' }}>To: {item.toMinistry} ({item.toDepartment})</div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.transferDate}</td>
                  <td style={{ fontSize: '0.775rem', color: 'var(--slate-muted)', maxWidth: '240px' }}>{item.reason}</td>
                  <td style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-text)' }}>{item.approvedBy}</td>
                  <td>
                    <span className="badge badge-approved">{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TRANSFER MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '580px', width: '100%', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>Issue Officer Transfer Order</h3>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>Inter-Ministry / Inter-Department Transfer</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateTransfer} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Select Officer to Transfer *</label>
                <select className="form-select" required value={selectedEmpId} onChange={e => setSelectedEmpId(e.target.value)}>
                  <option value="">-- Choose Officer --</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.employeeCode}) - {e.ministryName}</option>
                  ))}
                </select>
              </div>

              {selectedEmp && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.775rem' }}>
                  Current Ministry: <strong>{selectedEmp.ministryName}</strong> | Department: <strong>{selectedEmp.department}</strong>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Destination Ministry *</label>
                  <select className="form-select" value={toMinistryId} onChange={e => setToMinistryId(e.target.value)}>
                    {dummyMinistries.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Destination Department *</label>
                  <input type="text" required className="form-input" value={toDepartment} onChange={e => setToDepartment(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Destination Wing</label>
                  <input type="text" className="form-input" value={toWing} onChange={e => setToWing(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Effective Transfer Date *</label>
                  <input type="date" required className="form-input" value={transferDate} onChange={e => setTransferDate(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="form-label">Reason / Order Reference *</label>
                <input type="text" required className="form-input" value={reason} onChange={e => setReason(e.target.value)} />
              </div>

              <div>
                <label className="form-label">Approving Authority *</label>
                <input type="text" required className="form-input" value={approvedBy} onChange={e => setApprovedBy(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Issue Transfer Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
