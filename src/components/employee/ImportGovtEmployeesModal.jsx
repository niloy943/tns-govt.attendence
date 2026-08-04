import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Building2, 
  Database, 
  HardDrive, 
  Banknote, 
  Shield, 
  Calendar,
  AlertCircle,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { dummyMinistries } from '../../data/dummy/ministries';

const SAMPLE_GOVT_PARSED_OFFICERS = [
  {
    id: 'import-1',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    name: 'Begum Akhtar Jahan',
    designation: 'Joint Secretary (Administration)',
    office: 'Ministry of Social Welfare',
    ministryId: 1,
    email: 'akhtar.jahan@msw.gov.bd',
    phone: '02-9514022',
    employeeCode: 'EMP-GOVT-101',
    payGrade: 'Grade 3',
    monthlySalary: 66000,
    basicSalary: 56500,
    attendanceDevice: 'DEV-MSW-GATE-01',
    role: 'Officer',
    status: 'Active',
    joiningDate: '2024-01-15'
  },
  {
    id: 'import-2',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    name: 'Kazi Mohammad Hossain',
    designation: 'Deputy Secretary (Budget & Planning)',
    office: 'Ministry of Women and Children Affairs',
    ministryId: 2,
    email: 'kazi.hossain@dwa.gov.bd',
    phone: '02-4103399',
    employeeCode: 'EMP-GOVT-102',
    payGrade: 'Grade 5',
    monthlySalary: 50000,
    basicSalary: 43000,
    attendanceDevice: 'DEV-DWA-BUILDING-02',
    role: 'Officer',
    status: 'Active',
    joiningDate: '2024-02-01'
  },
  {
    id: 'import-3',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    name: 'Dr. Rashida Parveen',
    designation: 'Senior System Analyst',
    office: 'Ministry of Social Welfare',
    ministryId: 1,
    email: 'rashida.ict@msw.gov.bd',
    phone: '01711223344',
    employeeCode: 'EMP-GOVT-103',
    payGrade: 'Grade 5',
    monthlySalary: 50000,
    basicSalary: 43000,
    attendanceDevice: 'DEV-MSW-GATE-01',
    role: 'Ministry Admin',
    status: 'Active',
    joiningDate: '2024-02-15'
  }
];

export default function ImportGovtEmployeesModal({ isOpen, onClose, onImportSuccess }) {
  const [step, setStep] = useState(1); // 1: Input URL/File -> 2: Read & Preview -> 3: Batch Assignment -> 4: Complete
  const [urlInput, setUrlInput] = useState('https://msw.gov.bd/pages/officers');
  const [isFetching, setIsFetching] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  
  // Global Assignment Overrides
  const [batchMinistryId, setBatchMinistryId] = useState(1);
  const [batchPayGrade, setBatchPayGrade] = useState('Grade 5');
  const [batchDevice, setBatchDevice] = useState('DEV-SECRETARIAT-MAIN');
  const [batchRole, setBatchRole] = useState('Officer');
  const [batchStatus, setBatchStatus] = useState('Active');
  const [batchJoiningDate, setBatchJoiningDate] = useState('2024-03-01');

  if (!isOpen) return null;

  const handleFetchData = () => {
    setIsFetching(true);
    setTimeout(() => {
      setParsedData(SAMPLE_GOVT_PARSED_OFFICERS);
      setIsFetching(false);
      setStep(2);
    }, 900);
  };

  const handleApplyBatchDefaults = () => {
    const updated = parsedData.map(item => ({
      ...item,
      ministryId: Number(batchMinistryId),
      ministryName: dummyMinistries.find(m => m.id === Number(batchMinistryId))?.name || item.office,
      payGrade: batchPayGrade,
      attendanceDevice: batchDevice,
      role: batchRole,
      status: batchStatus,
      joiningDate: batchJoiningDate
    }));
    setParsedData(updated);
  };

  const handleSaveImport = () => {
    onImportSuccess(parsedData);
    setStep(4);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="animate-scale-in" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '1rem',
        maxWidth: '840px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Modal Header */}
        <div style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1E293B'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} style={{ color: '#38BDF8' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>
                Import Government Employees
              </h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
              Fetch officer directory from official websites (msw.gov.bd, dwa.gov.bd) or CSV dataset
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Wizard Step Progress Tracker */}
        <div style={{ display: 'flex', backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--slate-border)', padding: '0.75rem 1.5rem' }}>
          {[
            { num: 1, title: 'Fetch Source' },
            { num: 2, title: 'Read & Preview' },
            { num: 3, title: 'Assign Fields' },
            { num: 4, title: 'Import Complete' }
          ].map(s => (
            <div key={s.num} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: step >= s.num ? 1 : 0.4 }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '9999px',
                backgroundColor: step >= s.num ? '#059669' : '#CBD5E1',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {step > s.num ? <CheckCircle2 size={14} /> : s.num}
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: step >= s.num ? 'var(--slate-text)' : 'var(--slate-muted)' }}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* STEP 1: FETCH SOURCE */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1rem', borderRadius: '0.75rem', display: 'flex', gap: '0.75rem' }}>
                <Globe size={22} style={{ color: '#059669', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#065F46', margin: 0 }}>Government Directory Scraping & Fetch Service</h4>
                  <p style={{ fontSize: '0.775rem', color: '#047857', margin: '0.2rem 0 0 0' }}>
                    Enter an official Bangladesh Government officer directory URL or select a prepared CSV roster file.
                  </p>
                </div>
              </div>

              <div>
                <label className="form-label">Official Government Officer Directory URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    className="form-input"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://msw.gov.bd/pages/officers"
                  />
                  <button 
                    onClick={handleFetchData} 
                    disabled={isFetching}
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {isFetching ? <RefreshCw size={16} className="animate-spin" /> : <Globe size={16} />}
                    {isFetching ? 'Fetching...' : 'Read Data'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {['https://msw.gov.bd/pages/officers', 'https://dwa.gov.bd/pages/officers'].map(u => (
                    <button
                      key={u}
                      onClick={() => setUrlInput(u)}
                      style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', border: '1px solid var(--slate-border)', backgroundColor: '#F8FAFC', cursor: 'pointer' }}
                    >
                      Use {u.split('/')[2]}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ textAlignment: 'center', margin: '0.5rem 0', color: 'var(--slate-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
                — OR UPLOAD CSV FILE —
              </div>

              <div style={{ border: '2px dashed var(--slate-border)', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', backgroundColor: '#F8FAFC', cursor: 'pointer' }} onClick={handleFetchData}>
                <UploadCloud size={36} style={{ color: 'var(--primary)' }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0.5rem 0 0 0' }}>Click to upload Govt Officer Roster (.csv, .xlsx)</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: 0 }}>Supports standard Bangladesh Govt HRMS format</p>
              </div>
            </div>
          )}

          {/* STEP 2: READ DATA & PREVIEW */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Parsed Officer Roster Preview</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: 0 }}>Successfully extracted {parsedData.length} officer profiles from target website</p>
                </div>
                <span className="badge badge-active" style={{ fontSize: '0.75rem' }}>
                  <FileCheck size={14} /> Ready for Import
                </span>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>✓ Photo</th>
                      <th>✓ Name</th>
                      <th>✓ Designation</th>
                      <th>✓ Office</th>
                      <th>✓ Email</th>
                      <th>✓ Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.map(item => (
                      <tr key={item.id}>
                        <td>
                          <img src={item.photo} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '9999px', objectFit: 'cover' }} />
                        </td>
                        <td style={{ fontWeight: 700 }}>{item.name}</td>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{item.designation}</td>
                        <td>{item.office}</td>
                        <td style={{ fontSize: '0.8125rem' }}>{item.email}</td>
                        <td style={{ fontSize: '0.8125rem' }}>{item.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: BATCH ASSIGNMENT */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Assign HRMS Configuration Defaults</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: 0 }}>Assign Employee Code prefix, Pay Grade, Attendance Devices & Account Roles before saving to database</p>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--slate-border)', padding: '1.25rem', borderRadius: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Target Ministry</label>
                  <select className="form-select" value={batchMinistryId} onChange={e => setBatchMinistryId(e.target.value)}>
                    {dummyMinistries.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Default Salary Grade</label>
                  <select className="form-select" value={batchPayGrade} onChange={e => setBatchPayGrade(e.target.value)}>
                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Attendance Device Assignment</label>
                  <input
                    type="text"
                    className="form-input"
                    value={batchDevice}
                    onChange={e => setBatchDevice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">System Access Role</label>
                  <select className="form-select" value={batchRole} onChange={e => setBatchRole(e.target.value)}>
                    <option value="Officer">Officer</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Ministry Admin">Ministry Admin</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Account Service Status</label>
                  <select className="form-select" value={batchStatus} onChange={e => setBatchStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Probation">Probation</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Government Joining Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={batchJoiningDate}
                    onChange={e => setBatchJoiningDate(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleApplyBatchDefaults} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
                    <RefreshCw size={14} /> Apply Defaults to All Imported Officers
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: IMPORT COMPLETE */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '9999px', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Import Completed Successfully!</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)', marginTop: '0.375rem' }}>
                  {parsedData.length} officers mapped through <code style={{ color: '#059669' }}>GovernmentImportController</code> → <code style={{ color: '#059669' }}>EmployeeRepository</code> into the HRMS database.
                </p>
              </div>
              <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.625rem 2rem' }}>
                Return to Employee Directory
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        {step < 4 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--slate-border)', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div></div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={onClose} className="btn btn-secondary">Cancel</button>
              {step === 2 && (
                <button onClick={() => setStep(3)} className="btn btn-primary">
                  Proceed to Assignment <ArrowRight size={16} />
                </button>
              )}
              {step === 3 && (
                <button onClick={handleSaveImport} className="btn btn-primary">
                  <Database size={16} /> Save & Import Officers
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
