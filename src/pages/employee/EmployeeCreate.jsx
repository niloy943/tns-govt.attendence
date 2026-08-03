import React, { useState } from 'react';
import { Camera, Plus, FileText, Mail, Save, Check, User } from 'lucide-react';
import { useAddEmployee, useEmployees } from '../../hooks/useEmployees';
import { useNavigate } from 'react-router-dom';

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const addMutation = useAddEmployee();
  const { data: employees } = useEmployees();

  const [formData, setFormData] = useState({
    name: '',
    workEmail: '',
    employeeId: '',
    workPhone: '',
    department: '',
    jobPosition: '',
    password: '',
    status: 'Active',
    managerId: '',
    openingBalance: '',
    openingBalanceDate: '01/01/2022',
    privateAddress: '',
    division: '',
    district: '',
    upazila: '',
    privateEmail: '',
    privatePhone: '',
    bankAccount: '',
    homeDistance: '',
    emergencyName: '',
    emergencyPhone: '',
    maritalStatus: 'Single',
    childrenNumber: '',
    nationality: '',
    identificationNo: '',
    passportNo: '',
    gender: 'Male',
    dob: '',
    certificateLevel: 'Bachelor',
    fieldOfStudy: '',
    college: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please enter the employee's name.");
      return;
    }

    addMutation.mutate({
      name: formData.name,
      email: formData.workEmail || 'employee@touchandsolve.com',
      employeeCode: formData.employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      phone: formData.workPhone || '+880 1700-000000',
      designation: formData.jobPosition || 'Executive',
      department: formData.department || 'HR & Admin',
      status: 'active',
      joiningDate: new Date().toISOString().split('T')[0]
    }, {
      onSuccess: () => {
        alert("Employee profile created successfully!");
        navigate('/employee/list');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Top Header Bar with Tabs matching Image 2 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{
          backgroundColor: '#9333EA',
          color: '#FFFFFF',
          padding: '0.5rem 1.25rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 700
        }}>
          New Employees
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem', gap: '0.375rem' }}>
            <FileText size={14} /> Documents <span style={{ fontWeight: 800 }}>0</span>
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem', gap: '0.375rem' }}>
            <Mail size={14} /> Contacts <span style={{ fontWeight: 800 }}>0</span>
          </button>
        </div>
      </div>

      {/* Main Form Card matching Image 2 layout */}
      <form onSubmit={handleSubmit} className="card-base" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Title & Photo Upload Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              required
              placeholder="Employees’s Name"
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#1E293B',
                border: 'none',
                borderBottom: '2px solid var(--slate-border)',
                width: '100%',
                padding: '0.5rem 0',
                outline: 'none'
              }}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Photo Upload Box */}
          <div style={{
            width: '110px',
            height: '110px',
            borderRadius: '0.75rem',
            border: '2px dashed var(--slate-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAFC',
            cursor: 'pointer',
            position: 'relative'
          }}>
            <Camera size={28} style={{ color: '#94A3B8' }} />
            <span style={{ fontSize: '0.675rem', color: '#94A3B8', fontWeight: 600, marginTop: '0.25rem' }}>UPLOAD PHOTO</span>
            <span style={{
              position: 'absolute',
              bottom: '-6px',
              right: '-6px',
              width: '22px',
              height: '22px',
              borderRadius: '9999px',
              backgroundColor: '#9333EA',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>+</span>
          </div>
        </div>

        {/* 2-Column Core Fields Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div>
            <label className="form-label">WORK EMAIL</label>
            <input
              type="email"
              className="form-input"
              placeholder="Work Email"
              value={formData.workEmail}
              onChange={e => setFormData({ ...formData, workEmail: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">EMPLOYEE ID</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter Employee ID"
              value={formData.employeeId}
              onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">WORK PHONE</label>
            <input
              type="text"
              className="form-input"
              placeholder="Work Phone"
              value={formData.workPhone}
              onChange={e => setFormData({ ...formData, workPhone: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">DEPARTMENT</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter Department"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">PASSWORD</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">JOB POSITION</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter job position"
              value={formData.jobPosition}
              onChange={e => setFormData({ ...formData, jobPosition: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">STATUS</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="form-label">MANAGER</label>
            <select
              className="form-select"
              value={formData.managerId}
              onChange={e => setFormData({ ...formData, managerId: e.target.value })}
            >
              <option value="">- Choose a manager -</option>
              {(employees || []).map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.designation})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Opening Information */}
        <div style={{ borderTop: '1px solid var(--slate-border)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Opening Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label className="form-label">OPENING BALANCE <span style={{ fontSize: '0.7rem', color: 'var(--slate-muted)' }}>(OPTIONAL)</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="Opening Balance"
                value={formData.openingBalance}
                onChange={e => setFormData({ ...formData, openingBalance: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">OPENING BALANCE DATE <span style={{ fontSize: '0.7rem', color: 'var(--rose)' }}>(READONLY)</span></label>
              <input
                type="text"
                readOnly
                className="form-input"
                style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                value={formData.openingBalanceDate}
              />
            </div>
          </div>
        </div>

        {/* PRIVATE INFORMATION */}
        <div style={{ borderTop: '1px solid var(--slate-border)', paddingTop: '1.5rem' }}>
          <span style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: '#9333EA',
            borderBottom: '2px solid #9333EA',
            paddingBottom: '0.25rem',
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}>
            PRIVATE INFORMATION
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column: Contact, Emergency, Family */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-text)' }}>PRIVATE CONTACT</h4>
              
              <div>
                <label className="form-label">PRIVATE ADDRESS</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter private address..."
                  value={formData.privateAddress}
                  onChange={e => setFormData({ ...formData, privateAddress: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <select className="form-select" value={formData.division} onChange={e => setFormData({ ...formData, division: e.target.value })}>
                  <option value="">Division</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                </select>
                <select className="form-select" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })}>
                  <option value="">District</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Gazipur">Gazipur</option>
                </select>
                <select className="form-select" value={formData.upazila} onChange={e => setFormData({ ...formData, upazila: e.target.value })}>
                  <option value="">Upazila</option>
                  <option value="Savart">Savar</option>
                  <option value="Dhanmondi">Dhanmondi</option>
                </select>
              </div>

              <div>
                <label className="form-label">PRIVATE EMAIL</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. myprivateemail@gmail.com"
                  value={formData.privateEmail}
                  onChange={e => setFormData({ ...formData, privateEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">PRIVATE PHONE</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Private Phone"
                  value={formData.privatePhone}
                  onChange={e => setFormData({ ...formData, privatePhone: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">BANK ACCOUNT ?</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter Account Number"
                  value={formData.bankAccount}
                  onChange={e => setFormData({ ...formData, bankAccount: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">EMERGENCY CONTACT NAME</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contact Name"
                  value={formData.emergencyName}
                  onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">EMERGENCY CONTACT PHONE</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contact Phone"
                  value={formData.emergencyPhone}
                  onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
                />
              </div>
            </div>

            {/* Right Column: Citizenship, Education, Submit */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-text)' }}>CITIZENSHIP</h4>

              <div>
                <label className="form-label">NATIONALITY</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter Country Name"
                  value={formData.nationality}
                  onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">IDENTIFICATION NO</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter Identification No"
                  value={formData.identificationNo}
                  onChange={e => setFormData({ ...formData, identificationNo: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">NID DOCUMENT</label>
                <div style={{
                  border: '1px dashed var(--slate-border)',
                  borderRadius: '0.5rem',
                  padding: '0.625rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F8FAFC',
                  fontSize: '0.8125rem',
                  color: 'var(--slate-muted)'
                }}>
                  + Upload NID File
                </div>
              </div>

              <div>
                <label className="form-label">GENDER</label>
                <select className="form-select" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="Gender">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="form-label">DATE OF BIRTH</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>

              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-text)', marginTop: '0.5rem' }}>EDUCATION</h4>

              <div>
                <label className="form-label">CERTIFICATE LEVEL</label>
                <select className="form-select" value={formData.certificateLevel} onChange={e => setFormData({ ...formData, certificateLevel: e.target.value })}>
                  <option value="Certificate Level">Certificate Level</option>
                  <option value="Bachelor">Bachelor Degree</option>
                  <option value="Master">Master Degree</option>
                </select>
              </div>

              <div>
                <label className="form-label">FIELD OF STUDY</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Field of Study"
                  value={formData.fieldOfStudy}
                  onChange={e => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">COLLEGE/UNIVERSITY</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="College/University"
                  value={formData.college}
                  onChange={e => setFormData({ ...formData, college: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button (Purple Gradient matching Image 2) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-border)' }}>
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="btn btn-primary"
            style={{
              backgroundColor: '#9333EA',
              padding: '0.75rem 2.5rem',
              fontSize: '0.9375rem',
              fontWeight: 800,
              borderRadius: '0.5rem',
              boxShadow: '0 4px 14px 0 rgba(147, 51, 234, 0.39)'
            }}
          >
            {addMutation.isPending ? 'SUBMITTING...' : 'SUBMIT'}
          </button>
        </div>
      </form>
    </div>
  );
}
